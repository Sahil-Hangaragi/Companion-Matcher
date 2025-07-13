import { RequestHandler } from "express";
import {
  Message,
  Conversation,
  ConversationWithUser,
  SendMessageRequest,
  SendMessageResponse,
  GetConversationsResponse,
  GetMessagesRequest,
  GetMessagesResponse,
  UserProfile,
} from "@shared/api";

// In-memory storage (in production, this would be a database)
const messages: Map<string, Message> = new Map();
const conversations: Map<string, Conversation> = new Map();

// Import users from users.ts - we'll need to access this
// For now, we'll pass it as a parameter or access it differently
let usersStore: Map<string, UserProfile>;

export function setUsersStore(users: Map<string, UserProfile>) {
  usersStore = users;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getOrCreateConversation(user1: string, user2: string): Conversation {
  // Normalize conversation ID (alphabetical order)
  const participants: [string, string] = [user1, user2].sort() as [
    string,
    string,
  ];
  const conversationId = `${participants[0]}_${participants[1]}`;

  let conversation = conversations.get(conversationId);

  if (!conversation) {
    conversation = {
      id: conversationId,
      participants,
      lastActivity: new Date().toISOString(),
      unreadCount: 0,
    };
    conversations.set(conversationId, conversation);
  }

  return conversation;
}

export const sendMessage: RequestHandler = (req, res) => {
  try {
    const senderUsername = req.params.username;
    const { receiverUsername, content }: SendMessageRequest = req.body;

    if (!senderUsername || !receiverUsername || !content) {
      return res.status(400).json({
        success: false,
        message: "Sender, receiver, and content are required",
      } as SendMessageResponse);
    }

    if (!usersStore) {
      return res.status(500).json({
        success: false,
        message: "Users store not available",
      } as SendMessageResponse);
    }

    // Check if both users exist
    const sender = usersStore.get(senderUsername.toLowerCase());
    const receiver = usersStore.get(receiverUsername.toLowerCase());

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: "One or both users not found",
      } as SendMessageResponse);
    }

    if (senderUsername.toLowerCase() === receiverUsername.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Cannot send message to yourself",
      } as SendMessageResponse);
    }

    // Get or create conversation
    const conversation = getOrCreateConversation(
      senderUsername.toLowerCase(),
      receiverUsername.toLowerCase(),
    );

    // Create message
    const messageId = generateId();
    const timestamp = new Date().toISOString();

    const message: Message = {
      id: messageId,
      conversationId: conversation.id,
      senderId: senderUsername.toLowerCase(),
      receiverId: receiverUsername.toLowerCase(),
      content: content.trim(),
      timestamp,
      read: false,
    };

    // Store message
    messages.set(messageId, message);

    // Update conversation
    conversation.lastMessage = message;
    conversation.lastActivity = timestamp;
    // Note: unreadCount would be managed per user in a real app

    conversations.set(conversation.id, conversation);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      messageData: message,
    } as SendMessageResponse);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as SendMessageResponse);
  }
};

export const getConversations: RequestHandler = (req, res) => {
  try {
    const username = req.params.username;

    if (!username) {
      return res.status(400).json({
        conversations: [],
      } as GetConversationsResponse);
    }

    if (!usersStore) {
      return res.status(500).json({
        conversations: [],
      } as GetConversationsResponse);
    }

    const user = usersStore.get(username.toLowerCase());
    if (!user) {
      return res.status(404).json({
        conversations: [],
      } as GetConversationsResponse);
    }

    // Get all conversations for this user
    const userConversations: ConversationWithUser[] = [];

    for (const conversation of conversations.values()) {
      if (conversation.participants.includes(username.toLowerCase())) {
        // Get the other participant
        const otherUsername = conversation.participants.find(
          (p) => p !== username.toLowerCase(),
        );

        if (otherUsername) {
          const otherUser = usersStore.get(otherUsername);
          if (otherUser) {
            userConversations.push({
              id: conversation.id,
              otherUser,
              lastMessage: conversation.lastMessage,
              lastActivity: conversation.lastActivity,
              unreadCount: 0, // Simplified for now
            });
          }
        }
      }
    }

    // Sort by last activity (most recent first)
    userConversations.sort(
      (a, b) =>
        new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime(),
    );

    res.json({
      conversations: userConversations,
    } as GetConversationsResponse);
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({
      conversations: [],
    } as GetConversationsResponse);
  }
};

export const getMessages: RequestHandler = (req, res) => {
  try {
    const username = req.params.username;
    const { conversationId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    if (!username || !conversationId) {
      return res.status(400).json({
        messages: [],
        totalMessages: 0,
        hasMore: false,
      } as GetMessagesResponse);
    }

    if (!usersStore) {
      return res.status(500).json({
        messages: [],
        totalMessages: 0,
        hasMore: false,
      } as GetMessagesResponse);
    }

    // Check if user exists
    const user = usersStore.get(username.toLowerCase());
    if (!user) {
      return res.status(404).json({
        messages: [],
        totalMessages: 0,
        hasMore: false,
      } as GetMessagesResponse);
    }

    // Parse conversation ID to get the other user
    const participants = conversationId.split("_");
    if (participants.length !== 2) {
      return res.status(400).json({
        messages: [],
        totalMessages: 0,
        hasMore: false,
      } as GetMessagesResponse);
    }

    // Check if the current user is one of the participants
    if (!participants.includes(username.toLowerCase())) {
      return res.status(403).json({
        messages: [],
        totalMessages: 0,
        hasMore: false,
      } as GetMessagesResponse);
    }

    // Get the other user
    const otherUsername = participants.find(
      (p) => p !== username.toLowerCase(),
    );
    if (!otherUsername || !usersStore.get(otherUsername)) {
      return res.status(404).json({
        messages: [],
        totalMessages: 0,
        hasMore: false,
      } as GetMessagesResponse);
    }

    // Get or create the conversation (this allows access to empty conversations)
    let conversation = conversations.get(conversationId);
    if (!conversation) {
      // Create an empty conversation if it doesn't exist but both users exist
      conversation = getOrCreateConversation(
        username.toLowerCase(),
        otherUsername,
      );
    }

    // Get all messages for this conversation
    const conversationMessages: Message[] = [];
    for (const message of messages.values()) {
      if (message.conversationId === conversationId) {
        conversationMessages.push(message);
      }
    }

    // Sort by timestamp (oldest first for chat display)
    conversationMessages.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    // Apply pagination
    const totalMessages = conversationMessages.length;
    const paginatedMessages = conversationMessages.slice(
      offset,
      offset + limit,
    );
    const hasMore = offset + limit < totalMessages;

    res.json({
      messages: paginatedMessages,
      totalMessages,
      hasMore,
    } as GetMessagesResponse);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({
      messages: [],
      totalMessages: 0,
      hasMore: false,
    } as GetMessagesResponse);
  }
};

export const markMessagesAsRead: RequestHandler = (req, res) => {
  try {
    const username = req.params.username;
    const { conversationId } = req.params;

    if (!username || !conversationId) {
      return res.status(400).json({
        success: false,
        message: "Username and conversation ID are required",
      });
    }

    if (!usersStore) {
      return res.status(500).json({
        success: false,
        message: "Users store not available",
      });
    }

    // Check if user exists and is part of the conversation
    const user = usersStore.get(username.toLowerCase());
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const conversation = conversations.get(conversationId);
    if (
      !conversation ||
      !conversation.participants.includes(username.toLowerCase())
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Mark all messages in this conversation as read for this user
    let updatedCount = 0;
    for (const message of messages.values()) {
      if (
        message.conversationId === conversationId &&
        message.receiverId === username.toLowerCase() &&
        !message.read
      ) {
        message.read = true;
        messages.set(message.id, message);
        updatedCount++;
      }
    }

    res.json({
      success: true,
      message: `Marked ${updatedCount} messages as read`,
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
