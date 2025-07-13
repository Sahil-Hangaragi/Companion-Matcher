import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Send,
  User,
  Phone,
  Video,
  MoreVertical,
  Smile,
} from "lucide-react";
import {
  Message,
  ConversationWithUser,
  SendMessageRequest,
  SendMessageResponse,
  GetMessagesResponse,
} from "@shared/api";
import { toast } from "sonner";
import { format, isToday, isYesterday } from "date-fns";

export default function Chat() {
  const { username, conversationId } = useParams<{
    username: string;
    conversationId: string;
  }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState<ConversationWithUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (username && conversationId) {
      fetchMessages();
      fetchConversationDetails();
    }
  }, [username, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversationDetails = async () => {
    try {
      const response = await fetch(`/api/conversations/${username}`);
      const data = await response.json();
      const conversation = data.conversations.find(
        (c: ConversationWithUser) => c.id === conversationId,
      );
      if (conversation) {
        setOtherUser(conversation);
      } else {
        // If conversation doesn't exist yet, derive other user from conversation ID
        const participants = conversationId?.split("_") || [];
        const otherUsername = participants.find(
          (p) => p !== username?.toLowerCase(),
        );

        if (otherUsername) {
          // Try to fetch the other user's profile from matches or create a mock conversation
          try {
            const matchesResponse = await fetch(`/api/matches/${username}`);
            const matchesData = await matchesResponse.json();
            const match = matchesData.matches?.find(
              (m: any) => m.name.toLowerCase() === otherUsername,
            );

            if (match) {
              setOtherUser({
                id: conversationId!,
                otherUser: {
                  name: match.name,
                  age: match.age,
                  interests: match.interests,
                  photo: match.photo,
                  bio: match.bio,
                  location: match.location,
                  occupation: match.occupation,
                  lookingFor: match.lookingFor,
                },
                lastActivity: new Date().toISOString(),
                unreadCount: 0,
              });
            }
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching conversation details:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/messages/${username}/${conversationId}?limit=100`,
      );
      const data: GetMessagesResponse = await response.json();
      setMessages(data.messages);
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !otherUser || isSending) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    try {
      const response = await fetch(`/api/messages/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverUsername: otherUser.otherUser.name,
          content: messageContent,
        } as SendMessageRequest),
      });

      const data: SendMessageResponse = await response.json();

      if (data.success && data.messageData) {
        setMessages((prev) => [...prev, data.messageData!]);
        // Focus back to input
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        toast.error(data.message || "Failed to send message");
        setNewMessage(messageContent); // Restore message if failed
      }
    } catch (error) {
      toast.error("Failed to send message");
      setNewMessage(messageContent); // Restore message if failed
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, "HH:mm")}`;
    } else {
      return format(date, "MMM d, HH:mm");
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = new Date(message.timestamp);
      let dateKey: string;

      if (isToday(date)) {
        dateKey = "Today";
      } else if (isYesterday(date)) {
        dateKey = "Yesterday";
      } else {
        dateKey = format(date, "MMMM d, yyyy");
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });

    return groups;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gradient-start via-companion-pink to-gradient-end flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gradient-start via-companion-pink to-gradient-end flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardContent className="py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Conversation Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              This conversation doesn't exist or you don't have access to it.
            </p>
            <Link to={`/conversations/${username}`}>
              <Button className="bg-gradient-to-r from-companion-purple to-companion-pink">
                Back to Conversations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Chat Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-4 shadow-sm">
        <Link to={`/conversations/${username}`}>
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={otherUser.otherUser.photo}
              alt={otherUser.otherUser.name}
            />
            <AvatarFallback className="bg-gradient-to-br from-companion-purple to-companion-pink text-white">
              {otherUser.otherUser.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="font-semibold text-gray-900">
              {otherUser.otherUser.name}
            </h1>
            <p className="text-sm text-gray-500">
              {otherUser.otherUser.location &&
                `${otherUser.otherUser.location} • `}
              {otherUser.otherUser.age} years old
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {Object.entries(messageGroups).map(([dateKey, dayMessages]) => (
            <div key={dateKey}>
              {/* Date Separator */}
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {dateKey}
                </div>
              </div>

              {/* Messages for this date */}
              <div className="space-y-4">
                {dayMessages.map((message, index) => {
                  const isOwn = message.senderId === username?.toLowerCase();
                  const prevMessage = index > 0 ? dayMessages[index - 1] : null;
                  const showAvatar =
                    !prevMessage || prevMessage.senderId !== message.senderId;

                  return (
                    <div
                      key={message.id}
                      className={`flex items-end gap-2 ${
                        isOwn ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex-shrink-0 ${showAvatar ? "opacity-100" : "opacity-0"}`}
                      >
                        {!isOwn && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={otherUser.otherUser.photo}
                              alt={otherUser.otherUser.name}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-companion-purple to-companion-pink text-white text-sm">
                              {otherUser.otherUser.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      {/* Message Content */}
                      <div
                        className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-[70%]`}
                      >
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwn
                              ? "bg-gradient-to-r from-companion-purple to-companion-pink text-white"
                              : "bg-white border border-gray-200 text-gray-900"
                          } shadow-sm`}
                        >
                          <p className="text-sm leading-relaxed break-words">
                            {message.content}
                          </p>
                        </div>
                        <p
                          className={`text-xs text-gray-500 mt-1 ${isOwn ? "text-right" : "text-left"}`}
                        >
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="pr-10 py-3 text-base border-gray-200 focus:border-companion-purple focus:ring-companion-purple rounded-full"
                disabled={isSending}
                maxLength={1000}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded-full"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="bg-gradient-to-r from-companion-purple to-companion-pink hover:from-companion-purple/90 hover:to-companion-pink/90 rounded-full px-4 py-3"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {newMessage.length}/1000 characters
          </p>
        </div>
      </main>
    </div>
  );
}
