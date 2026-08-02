import { createReducer, on } from '@ngrx/store';
import { AdminUser } from '../../models/user.model';
import { UserActions } from './users.actions';

export interface UsersState {
  users: AdminUser[];
}

const initialState: UsersState = {
  users: [],
};

const AVATAR_COLORS = ['#c8e6c9', '#b2dfdb', '#ffe0b2', '#f8bbd0', '#e1bee7', '#fff9c4'];

function makeInitials(name: string): string {
  return name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export const usersReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, (_, { users }) => ({ users })),

  on(UserActions.addUser, (state, { user }) => {
    const newUser: AdminUser = {
      id: crypto.randomUUID(),
      name: user.name,
      email: user.email,
      role: user.role,
      route: user.route,
      status: user.status,
      initials: makeInitials(user.name),
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      createdAt: new Date(),
    };
    return { users: [newUser, ...state.users] };
  }),

  on(UserActions.updateUser, (state, { id, changes }) => ({
    users: state.users.map(u => (u.id === id ? { ...u, ...changes } : u)),
  })),

  on(UserActions.deleteUser, (state, { id }) => ({
    users: state.users.filter(u => u.id !== id),
  })),
);
