import { ActionReducerMap } from '@ngrx/store';
import { conversationsReducer, ConversationsState } from './conversations/conversations.reducer';
import { usersReducer, UsersState } from './users/users.reducer';
import { authReducer, AuthState } from './auth/auth.reducer';

export interface AppState {
  conversations: ConversationsState;
  users: UsersState;
  auth: AuthState;
}

export const reducers: ActionReducerMap<AppState> = {
  conversations: conversationsReducer,
  users: usersReducer,
  auth: authReducer,
};
