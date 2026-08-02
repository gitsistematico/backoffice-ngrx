import { createActionGroup, props } from '@ngrx/store';
import { Conversation, Message } from '../../models/conversation.model';

export const ConversationActions = createActionGroup({
  source: 'Conversations',
  events: {
    'Load Conversations': props<{ conversations: Conversation[] }>(),
    'Select Conversation': props<{ id: string }>(),
    'Send Message': props<{ conversationId: string; content: string }>(),
    'Receive Message': props<{ conversationId: string; content: string; senderName: string }>(),
    'Close Conversation': props<{ id: string }>(),
  },
});
