import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.reducer';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(
  selectUsersState,
  (state) => state.users,
);

export const selectActiveCount = createSelector(
  selectAllUsers,
  (users) => users.filter(u => u.status === 'active').length,
);

export const selectAdminCount = createSelector(
  selectAllUsers,
  (users) => users.filter(u => u.role === 'admin').length,
);

export const selectAgentCount = createSelector(
  selectAllUsers,
  (users) => users.filter(u => u.role === 'agent').length,
);
