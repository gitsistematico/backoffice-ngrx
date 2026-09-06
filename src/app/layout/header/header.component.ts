import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppState } from '../../core/state/app.state';
import { AuthActions } from '../../core/state/auth/auth.actions';
import { selectAuthUser } from '../../core/state/auth/auth.selectors';
import { AuthUser } from '../../core/models/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnDestroy {
  @Input() title = '';
  user: AuthUser | null = null;
  menuOpen = false;
  private sub: Subscription;

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
    this.sub = this.store.select(selectAuthUser).subscribe(u => this.user = u);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.menuOpen = false;
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/login']);
  }

  get initials(): string {
    const name = this.user?.name ?? '';
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }
}
