import { Component, inject, OnInit } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, RouterOutlet, Routes } from "@angular/router";
import { provideStore } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { Store } from "@ngrx/store";
import { reducers } from "./app/core/state/app.state";
import { AppState } from "./app/core/state/app.state";
import { ConversationsEffects } from "./app/core/state/conversations/conversations.effects";
import { AuthEffects } from "./app/core/state/auth/auth.effects";
import { LayoutComponent } from "./app/layout/layout.component";
import { ConversationsComponent } from "./app/features/conversations/conversations.component";
import { UsersComponent } from "./app/features/users/users.component";
import { SettingsComponent } from "./app/features/settings/settings.component";
import { LoginComponent } from "./app/features/auth/login.component";
import { authGuard } from "./app/core/guards/auth.guard";
import { guestGuard } from "./app/core/guards/guest.guard";
import { MockAuthService } from "./app/core/services/mock-auth.service";
import { AuthActions } from "./app/core/state/auth/auth.actions";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { HttpIntercptorService } from "./app/core/services/http-interceptor.service";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: "",
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      {
        path: "dashboard",
        component: ConversationsComponent,
        data: { title: "Conversaciones" },
      },
      {
        path: "users",
        component: UsersComponent,
        data: { title: "Gestión de usuarios" },
      },
      {
        path: "settings",
        component: SettingsComponent,
        data: { title: "Ajustes" },
      },
    ],
  },
  { path: "**", redirectTo: "" },
];

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App implements OnInit {
  private mockAuth = inject(MockAuthService);
  private store = inject(Store<AppState>);

  ngOnInit(): void {
    const session = this.mockAuth.restoreSession();
    if (session) {
      this.store.dispatch(
        AuthActions.restoreSession({ user: session.user, session }),
      );
    }
  }
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpIntercptorService,
      multi: true,
    },
    provideRouter(routes),
    provideStore(reducers),
    provideEffects([ConversationsEffects, AuthEffects]),
    provideStoreDevtools(),
  ],
}).catch((err) => console.error(err));
