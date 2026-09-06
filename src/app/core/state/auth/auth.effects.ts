import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AuthActions } from './auth.actions';
import { MockAuthService } from '../../services/mock-auth.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private mockAuth = inject(MockAuthService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password }) =>
        this.mockAuth.login(email, password).pipe(
          map((session) =>
            AuthActions.loginSuccess({ user: session.user, session }),
          ),
          catchError((err: Error) =>
            of(AuthActions.loginFailure({ error: err.message })),
          ),
        ),
      ),
    ),
  );

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      mergeMap(({ email, password }) =>
        this.mockAuth.signup(email, password).pipe(
          map((session) =>
            AuthActions.signupSuccess({ user: session.user, session }),
          ),
          catchError((err: Error) =>
            of(AuthActions.signupFailure({ error: err.message })),
          ),
        ),
      ),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        this.mockAuth.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(() => of(AuthActions.logoutSuccess())),
        ),
      ),
    ),
  );
}
