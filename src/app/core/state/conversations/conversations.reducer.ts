import { createReducer, on } from '@ngrx/store';
import { Conversation, Message } from '../../models/conversation.model';
import { ConversationActions } from './conversations.actions';

export interface ConversationsState {
  conversations: Conversation[];
  selectedId: string | null;
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

  on(ConversationActions.selectConversation, (state, { id }) => ({
    ...state,
    selectedId: id,
    conversations: state.conversations.map(c =>
      c.id === id ? { ...c, unreadCount: 0 } : c
    ),
  })),

  on(ConversationActions.sendMessage, (state, { conversationId, content }) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      conversationId,
      sender: 'agent',
      senderName: 'eses-main',
      content,
      timestamp: new Date(),
      read: false,
    };
    return {
      ...state,
      conversations: state.conversations.map(c =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, msg], lastMessage: content, lastMessageTime: new Date() }
          : c
      ),
    };
  }),

  on(ConversationActions.receiveMessage, (state, { conversationId, content, senderName }) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      conversationId,
      sender: 'user',
      senderName,
      content,
      timestamp: new Date(),
      read: false,
    };
    return {
      ...state,
      conversations: state.conversations.map(c =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, msg],
              lastMessage: content,
              lastMessageTime: new Date(),
              unreadCount: state.selectedId === conversationId ? 0 : c.unreadCount + 1,
            }
          : c
      ),
    };
  }),

  on(ConversationActions.closeConversation, (state, { id }) => ({
    ...state,
    conversations: state.conversations.map(c =>
      c.id === id ? { ...c, status: 'closed' as const } : c
    ),
  })),
);
