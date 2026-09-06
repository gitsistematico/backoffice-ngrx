import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppState } from '../../core/state/app.state';
import { AuthActions } from '../../core/state/auth/auth.actions';
import {
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from '../../core/state/auth/auth.selectors';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  isSignupMode = false;
  showPassword = false;

  loading = false;
  error: string | null = null;
  private subs: Subscription[] = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private supabase: SupabaseService,
  ) {
    this.subs.push(this.store.select(selectAuthLoading).subscribe(l => this.loading = l));
    this.subs.push(this.store.select(selectAuthError).subscribe(e => this.error = e));
    this.subs.push(
      this.store.select(selectIsAuthenticated).subscribe(authed => {
        if (authed) this.router.navigate(['/dashboard']);
      }),
    );
  }

  ngOnInit(): void {
    this.supabase.supabase.auth.getSession().then(({ data }) => {
      if (data.session && data.session.user) {
        this.store.dispatch(AuthActions.restoreSession({
          user: data.session.user,
          session: data.session,
        }));
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  toggleMode(): void {
    this.isSignupMode = !this.isSignupMode;
    this.store.dispatch(AuthActions.clearError());
  }

  switchToLogin(): void {
    this.isSignupMode = false;
    this.store.dispatch(AuthActions.clearError());
  }

  switchToSignup(): void {
    this.isSignupMode = true;
    this.store.dispatch(AuthActions.clearError());
  }

  submit(): void {
    if (!this.email.trim() || !this.password.trim()) return;
    if (this.isSignupMode) {
      this.store.dispatch(AuthActions.signup({ email: this.email.trim(), password: this.password }));
    } else {
      this.store.dispatch(AuthActions.login({ email: this.email.trim(), password: this.password }));
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
