import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { AuthUser, AuthSession } from '../../models/auth.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ email: string; password: string }>(),
    'Login Success': props<{ user: AuthUser; session: AuthSession }>(),
    'Login Failure': props<{ error: string }>(),
    'Signup': props<{ email: string; password: string }>(),
    'Signup Success': props<{ user: AuthUser; session: AuthSession }>(),
    'Signup Failure': props<{ error: string }>(),
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
    'Restore Session': props<{ user: AuthUser; session: AuthSession }>(),
    'Clear Error': emptyProps(),
  },
});
