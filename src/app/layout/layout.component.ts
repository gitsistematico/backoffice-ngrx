import {  Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  RouterOutlet,
  ActivatedRoute,
  NavigationEnd,
  Router,
} from "@angular/router";
import { Store } from "@ngrx/store";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { HeaderComponent } from "./header/header.component";
import { WebsocketService } from "../core/services/websocket.service";
import { ConversationService } from "../core/services/conversation.service";
import { ConversationActions } from "../core/state/conversations/conversations.actions";
import { UserService } from "../core/services/user.service";
import { UserActions } from "../core/state/users/users.actions";
import { filter, map } from "rxjs";
import { AppState } from "../core/state/app.state";
import { Conversation } from "../core/models/conversation.model";
import { AdminUser } from "../core/models/user.model";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: "./layout.component.html",
  styleUrl: "./layout.component.css",
})
export class LayoutComponent implements OnInit {
  pageTitle = "Conversaciones";

  constructor(
    private ws: WebsocketService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private convService: ConversationService,
    private userService: UserService,    
  ) {
    this.ws.connect("http://localhost:8000");

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => this.getDeepestTitle(this.route)),
      )
      .subscribe((title) => (this.pageTitle = title));
  }

  ngOnInit(): void {
    this.convService.getMockConversations().subscribe({
      next: (data: Conversation[]) => {
        console.log(data);

        // Cuando los datos llegan de la API, los envías al store
        const conversationsData: Conversation[] = data.map((conv: any) => {
          return {
            id: conv.id,
            userId: conv.user_id,
            userName: conv.user.userName,
            userInitials: 'US', // Here you can generate initials from the user name
            userAvatarColor: '#c8e6c9', // Here you can assign an avatar color based on some criteria
            country: conv.country.id,
            countryFlag: conv.country.i18n,
            language: conv.country.name,
            conversationRef: conv.conversation_ref, 
            status: 'open',
            route: conv.country.folder,          
            unreadCount: 1,
            lastMessage: conv.lastMessage,
            lastMessageTime: new Date(conv.lastMessageTime),
            startedAt: new Date(conv.startedAt),
            messages: conv.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            }))
          } as Conversation;
        });
        this.store.dispatch(
          ConversationActions.loadConversations({ conversations: conversationsData }),
        );

        const usersConversartions: AdminUser[] = data
          .map((conversation: any) => {
            const user = conversation.user;
            if (!user) {
              return null;
            }

            return {
              id: user.id,
              name: user.userName,
              email: user.email,
              role: user.role,
              route: user.userRoute,
              status: "active",
              createdAt: new Date(user.createdAt),
              lastLogin: user.lastLogin ? new Date(user.lastLogin) : new Date(),
              initials: "US",
              avatarColor: "#c8e6c9",
            } as AdminUser;
          })
          .filter((user): user is AdminUser => !!user);

        this.store.dispatch(
          UserActions.loadUsers({ users: usersConversartions }),
        );
        console.log("usersConversartions", usersConversartions);
      },
      error: (error: any) => {
        console.error("Error loading mock conversations:", error);
        // Aquí puedes manejar el error, mostrar un toast, etc.
      },
    });

    // this.store.dispatch(
    //   UserActions.loadUsers({ users: this.userService.getMockUsers() }),
    // );
  }

  private getDeepestTitle(route: ActivatedRoute): string {
    let r = route.firstChild;
    let title = "Conversaciones";
    while (r) {
      const data = r.snapshot.data["title"];
      if (data) title = data as string;
      r = r.firstChild;
    }
    return title;
  }
}
