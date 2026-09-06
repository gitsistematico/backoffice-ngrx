import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { AuthActions } from './auth.actions';
import { SupabaseService } from '../../services/supabase.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private supabase = inject(SupabaseService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password }) =>
        from(this.supabase.supabase.auth.signInWithPassword({ email, password })).pipe(
          map(({ data, error }) => {
            if (error || !data.session || !data.user) {
              return AuthActions.loginFailure({ error: error?.message ?? 'Credenciales inválidas' });
            }
            return AuthActions.loginSuccess({ user: data.user, session: data.session });
          }),
          catchError((err) =>
            of(AuthActions.loginFailure({ error: err.message ?? 'Error de conexión' })),
          ),
        ),
      ),
    ),
  );

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      mergeMap(({ email, password }) =>
        from(this.supabase.supabase.auth.signUp({ email, password })).pipe(
          map(({ data, error }) => {
            if (error) {
              return AuthActions.signupFailure({ error: error.message });
            }
            return AuthActions.signupSuccess({ user: data.user, session: data.session });
          }),
          catchError((err) =>
            of(AuthActions.signupFailure({ error: err.message ?? 'Error de conexión' })),
          ),
        ),
      ),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        from(this.supabase.supabase.auth.signOut()).pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(() => of(AuthActions.logoutSuccess())),
        ),
      ),
    ),
  );
}
