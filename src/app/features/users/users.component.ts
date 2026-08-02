import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../core/state/app.state';
import { UserActions } from '../../core/state/users/users.actions';
import {
  selectAllUsers,
  selectActiveCount,
  selectAdminCount,
  selectAgentCount,
} from '../../core/state/users/users.selectors';
import { AdminUser } from '../../core/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnDestroy {
  users$ = this.store.select(selectAllUsers);
  activeCount$ = this.store.select(selectActiveCount);
  adminCount$ = this.store.select(selectAdminCount);
  agentCount$ = this.store.select(selectAgentCount);

  users: AdminUser[] = [];
  activeCount = 0;
  adminCount = 0;
  agentCount = 0;

  search = '';
  roleFilter: 'all' | AdminUser['role'] = 'all';
  statusFilter: 'all' | AdminUser['status'] = 'all';
  showModal = false;

  newUser: {
    name: string;
    email: string;
    role: AdminUser['role'];
    route: string;
    status: AdminUser['status'];
  } = {
    name: '',
    email: '',
    role: 'agent',
    route: 'eses-main',
    status: 'active',
  };

  private subs: Subscription[] = [];

  constructor(private store: Store<AppState>) {
    this.subs.push(this.users$.subscribe(u => this.users = u));
    this.subs.push(this.activeCount$.subscribe(c => this.activeCount = c));
    this.subs.push(this.adminCount$.subscribe(c => this.adminCount = c));
    this.subs.push(this.agentCount$.subscribe(c => this.agentCount = c));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  get filteredUsers(): AdminUser[] {
    const term = this.search.toLowerCase();
    return this.users.filter(u => {
      const matchSearch = !term || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
      const matchRole = this.roleFilter === 'all' || u.role === this.roleFilter;
      const matchStatus = this.statusFilter === 'all' || u.status === this.statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.newUser = { name: '', email: '', role: 'agent', route: 'eses-main', status: 'active' };
  }

  createUser(): void {
    const u = this.newUser;
    if (!u.name || !u.email) return;
    this.store.dispatch(UserActions.addUser({
      user: { name: u.name, email: u.email, role: u.role, route: u.route, status: u.status },
    }));
    this.closeModal();
  }

  toggleStatus(id: string): void {
    const user = this.users.find(u => u.id === id);
    if (!user) return;
    this.store.dispatch(UserActions.updateUser({
      id,
      changes: { status: user.status === 'active' ? 'inactive' : 'active' },
    }));
  }

  remove(id: string): void {
    this.store.dispatch(UserActions.deleteUser({ id }));
  }

  roleLabel(role: string): string {
    return role === 'admin' ? 'Administrador' : role === 'agent' ? 'Agente' : 'Supervisor';
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
}
