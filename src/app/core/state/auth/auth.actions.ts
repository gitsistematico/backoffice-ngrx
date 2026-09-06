import { createActionGroup, props, emptyProps } from '@ngrx/store';
import { User, Session } from '@supabase/supabase-js';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login': props<{ email: string; password: string }>(),
    'Login Success': props<{ user: User; session: Session }>(),
    'Login Failure': props<{ error: string }>(),
    'Signup': props<{ email: string; password: string }>(),
    'Signup Success': props<{ user: User | null; session: Session | null }>(),
    'Signup Failure': props<{ error: string }>(),
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
    'Restore Session': props<{ user: User; session: Session }>(),
    'Clear Error': emptyProps(),
  },
});
