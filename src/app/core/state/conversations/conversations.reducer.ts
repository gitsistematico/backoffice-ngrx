import { createReducer, on } from "@ngrx/store";
import { Conversation, Message } from "../../models/conversation.model";
import { ConversationActions } from "./conversations.actions";

export interface ConversationsState {
  conversations: Conversation[];
  selectedId: number | string | null;
}

const initialState: ConversationsState = {
  conversations: [],
  selectedId: null,
};

export const conversationsReducer = createReducer(
  initialState,
  on(ConversationActions.loadConversations, (_, { conversations }) => ({
    conversations,
    selectedId: conversations.length ? conversations[0].id : null,
  })),

  on(
    ConversationActions.selectConversation,
    (state, { id, userId, country, userName }) => ({
      ...state,
      selectedId: id,
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, unreadCount: 0 } : c,
      ),
    }),
  ),

  on(
    ConversationActions.sendMessage,
    (state, { conversationId, conversationRef, content }) => {
      const msg: Message = {
        id: crypto.randomUUID(),
        conversationId,
        conversationRef,
        sender: "agent",
        senderName: "eses-main",
        content,
        timestamp: new Date(),
        read: false,
      };
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [...c.messages, msg],
                lastMessage: content,
                lastMessageTime: new Date(),
              }
            : c,
        ),
      };
    },
  ),

  on(
    ConversationActions.receiveMessage,
    (state, { userId, country, conversationId, content, senderName }) => {
      const msg: Message = {
        id: userId,
        conversationId,
        sender: "user",
        senderName,
        content,
        timestamp: new Date(),
        read: false,
      };
      const conversationExists = state.conversations.some(
        (c) => c.id.toString() === conversationId.toString(),
      );

      console.log(msg, { conversationId, content, senderName }, state);
      if (conversationExists) {
        return {
          ...state,
          conversations: state.conversations.map((c) => {
            console.log(
              c.id.toString() + "===" + msg.conversationId.toString(),
            );
            if (c.id.toString() === msg.conversationId.toString()) {
              const messages = [...c.messages, msg];
              console.log("messages", messages);
              return {
                ...c,
                messages: [...c.messages, msg],
                lastMessage: content,
                lastMessageTime: new Date(),
                unreadCount:
                  state.selectedId === conversationId ? 0 : c.unreadCount + 1,
              };
            } else {
              console.log("entro por aca", c);

              return c;
            }
          }),
        };
      }

      const newConversation: Conversation = {
        id: conversationId,
        userId,
        userName: senderName,
        userInitials: "NA",
        userAvatarColor: "#000000",
        country,
        countryFlag: "🇺🇸",
        language: "Español",
        conversationRef: "",
        status: "open",
        route: "eses-main",
        unreadCount: 0,
        lastMessage: content,
        lastMessageTime: new Date(),
        startedAt: new Date(),
        messages: [msg],
      };

      return {
        ...state,
        conversations: [...state.conversations, newConversation],
      };
    },
  ),

  on(ConversationActions.closeConversation, (state, { id }) => ({
    ...state,
    conversations: state.conversations.map((c) =>
      c.id === id ? { ...c, status: "closed" as const } : c,
    ),
  })),
);
