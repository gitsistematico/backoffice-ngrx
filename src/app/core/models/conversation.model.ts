import { AdminUser } from "./user.model";

export interface Message {
  id: string;
  conversationId: string;
  conversationRef?: string;
  sender: "user" | "agent";
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userInitials: string;
  userAvatarColor: string;
  country: string;
  countryFlag: string;
  language: string;
  conversationRef: string;
  status: "pending" | "open" | "closed";
  route: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: Date;
  startedAt: Date;
  user?: AdminUser;
  messages: Message[];
}

export interface JoinedConversation {
  id: number | string;
  userId: string;
  country: string;
  userName?: string;
}
