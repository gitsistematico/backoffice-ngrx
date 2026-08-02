import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ConversationsState } from './conversations.reducer';

export const selectConversationsState = createFeatureSelector<ConversationsState>('conversations');

export const selectAllConversations = createSelector(
  selectConversationsState,
  (state) => state.conversations,
);

export const selectSelectedId = createSelector(
  selectConversationsState,
  (state) => state.selectedId,
);

export const selectSelectedConversation = createSelector(
  selectAllConversations,
  selectSelectedId,
  (conversations, id) => conversations.find(c => c.id === id),
);

export const selectPendingCount = createSelector(
  selectAllConversations,
  (conversations) => conversations.filter(c => c.status === 'pending').length,
);

export const selectOpenCount = createSelector(
  selectAllConversations,
  (conversations) => conversations.filter(c => c.status === 'open').length,
);
