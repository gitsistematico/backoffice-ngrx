import { createReducer, on } from '@ngrx/store';
import { AuthUser, AuthSession } from '../../models/auth.model';
import { AuthActions } from './auth.actions';

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user, session }) => ({
    ...state,
    user,
    session,
    loading: false,
    error: null,
    isAuthenticated: true,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
  })),

  on(AuthActions.signup, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.signupSuccess, (state, { user, session }) => ({
    ...state,
    user,
    session,
    loading: false,
    error: null,
    isAuthenticated: true,
  })),

  on(AuthActions.signupFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.restoreSession, (state, { user, session }) => ({
    ...state,
    user,
    session,
    loading: false,
    isAuthenticated: true,
  })),

  on(AuthActions.logoutSuccess, () => ({
    ...initialState,
  })),

  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null,
  })),
);
