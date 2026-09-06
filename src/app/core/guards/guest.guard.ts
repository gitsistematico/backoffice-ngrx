import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { AppState } from '../state/app.state';
import { selectIsAuthenticated } from '../state/auth/auth.selectors';

export const guestGuard: CanActivateFn = () => {
  const store = inject(Store<AppState>);
  const router = inject(Router);

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(authed => (authed ? router.createUrlTree(['/dashboard']) : true)),
  );
};
