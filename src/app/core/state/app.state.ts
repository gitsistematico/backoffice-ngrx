import { ActionReducerMap } from '@ngrx/store';
import { conversationsReducer, ConversationsState } from './conversations/conversations.reducer';
import { usersReducer, UsersState } from './users/users.reducer';

export interface AppState {
  conversations: ConversationsState;
  users: UsersState;
}

export const reducers: ActionReducerMap<AppState> = {
  conversations: conversationsReducer,
  users: usersReducer,
};
