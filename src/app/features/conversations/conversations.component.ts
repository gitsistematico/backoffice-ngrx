import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../core/state/app.state';
import { ConversationActions } from '../../core/state/conversations/conversations.actions';
import {
  selectAllConversations,
  selectSelectedConversation,
  selectSelectedId,
  selectPendingCount,
  selectOpenCount,
} from '../../core/state/conversations/conversations.selectors';
import { Conversation } from '../../core/models/conversation.model';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.css',
})
export class ConversationsComponent implements OnInit, OnDestroy {
  conversations$ = this.store.select(selectAllConversations);
  selected$ = this.store.select(selectSelectedConversation);
  pendingCount$ = this.store.select(selectPendingCount);
  openCount$ = this.store.select(selectOpenCount);

  filter: 'all' | 'pending' | 'open' | 'closed' = 'all';
  draft = '';

  // local copies for the template (since we're not using async everywhere)
  conversations: Conversation[] = [];
  selected: Conversation | null = null;
  pendingCount = 0;
  openCount = 0;
  private subs: Subscription[] = [];

  constructor(private store: Store<AppState>) {
    this.subs.push(this.conversations$.subscribe(c => this.conversations = c));
    this.subs.push(this.selected$.subscribe(s => this.selected = s ?? null));
    this.subs.push(this.pendingCount$.subscribe(c => this.pendingCount = c));
    this.subs.push(this.openCount$.subscribe(c => this.openCount = c));
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  get filteredConversations(): Conversation[] {
    if (this.filter === 'all') return this.conversations;
    return this.conversations.filter(c => c.status === this.filter);
  }

  select(id: string): void {
    this.store.dispatch(ConversationActions.selectConversation({ id }));
  }

  send(): void {
    if (!this.selected || !this.draft.trim()) return;
    this.store.dispatch(ConversationActions.sendMessage({
      conversationId: this.selected.id,
      content: this.draft.trim(),
    }));
    this.draft = '';
  }

  closeConv(id: string): void {
    this.store.dispatch(ConversationActions.closeConversation({ id }));
  }

  statusLabel(status: string): string {
    return status === 'pending' ? 'Pendiente' : status === 'open' ? 'Abierta' : 'Cerrada';
  }

  timeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'ahora';
    if (mins < 60) return mins + 'm';
    const hours = Math.floor(mins / 60);
    if (hours < 24) return hours + 'h';
    return Math.floor(hours / 24) + 'd';
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
