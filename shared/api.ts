export interface DemoResponse {
  message: string;
  ping: string;
}

export interface UserProfile {
  name: string;
  age: number;
  interests: string[];
  photo?: string; // Base64 encoded image or URL
  bio?: string;
  location?: string;
  occupation?: string;
  lookingFor?: string;
}

export interface UserMatch {
  name: string;
  interests: string[];
  sharedInterests?: string[];
  compatibilityScore?: number;
  age?: number;
  photo?: string;
  bio?: string;
  location?: string;
  occupation?: string;
  lookingFor?: string;
}

export interface CreateUserRequest {
  name: string;
  age: number;
  interests: string[];
  photo?: string;
  bio?: string;
  location?: string;
  occupation?: string;
  lookingFor?: string;
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}

export interface GetMatchesResponse {
  matches: UserMatch[];
  totalMatches: number;
}

export interface ShortlistRequest {
  username: string;
  targetUsername: string;
}

export interface ShortlistResponse {
  success: boolean;
  message: string;
}

export interface GetShortlistResponse {
  shortlist: UserMatch[];
}

export const INTERESTS_OPTIONS = [
  "music",
  "tech",
  "sports",
  "gaming",
  "reading",
  "cooking",
  "travel",
  "movies",
  "fitness",
  "art",
  "photography",
  "dancing",
  "hiking",
  "coding",
  "writing",
  "fashion",
  "nature",
  "yoga",
  "meditation",
  "volunteering",
] as const;

export const LOOKING_FOR_OPTIONS = [
  "friendship",
  "romantic relationship",
  "activity partner",
  "study buddy",
  "workout partner",
  "travel companion",
  "professional networking",
  "hobby buddy",
  "mentorship",
  "casual hangouts",
] as const;

export type Interest = (typeof INTERESTS_OPTIONS)[number];
export type LookingFor = (typeof LOOKING_FOR_OPTIONS)[number];

// Messaging interfaces
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: [string, string]; // [user1, user2]
  lastMessage?: Message;
  lastActivity: string;
  unreadCount: number; // For the current user
}

export interface ConversationWithUser {
  id: string;
  otherUser: UserProfile;
  lastMessage?: Message;
  lastActivity: string;
  unreadCount: number;
}

export interface SendMessageRequest {
  receiverUsername: string;
  content: string;
}

export interface SendMessageResponse {
  success: boolean;
  message?: string;
  messageData?: Message;
}

export interface GetConversationsResponse {
  conversations: ConversationWithUser[];
}

export interface GetMessagesRequest {
  conversationId: string;
  limit?: number;
  offset?: number;
}

export interface GetMessagesResponse {
  messages: Message[];
  totalMessages: number;
  hasMore: boolean;
}
