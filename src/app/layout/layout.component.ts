import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { WebsocketService } from '../core/services/websocket.service';
import { ConversationService } from '../core/services/conversation.service';
import { ConversationActions } from '../core/state/conversations/conversations.actions';
import { UserService } from '../core/services/user.service';
import { UserActions } from '../core/state/users/users.actions';
import { filter, map } from 'rxjs';
import { AppState } from '../core/state/app.state';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  pageTitle = 'Conversaciones';

  constructor(
    private ws: WebsocketService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private convService: ConversationService,
    private userService: UserService,
  ) {
    this.ws.connect('wss://echo.websocket.org');
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => this.getDeepestTitle(this.route)),
    ).subscribe(title => this.pageTitle = title);
  }

  ngOnInit(): void {
    this.store.dispatch(
      ConversationActions.loadConversations({ conversations: this.convService.getMockConversations() })
    );
    this.store.dispatch(
      UserActions.loadUsers({ users: this.userService.getMockUsers() })
    );
  }

  private getDeepestTitle(route: ActivatedRoute): string {
    let r = route.firstChild;
    let title = 'Conversaciones';
    while (r) {
      const data = r.snapshot.data['title'];
      if (data) title = data as string;
      r = r.firstChild;
    }
    return title;
  }
}
