import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, Routes } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { reducers } from './app/core/state/app.state';
import { ConversationsEffects } from './app/core/state/conversations/conversations.effects';
import { LayoutComponent } from './app/layout/layout.component';
import { ConversationsComponent } from './app/features/conversations/conversations.component';
import { UsersComponent } from './app/features/users/users.component';
import { SettingsComponent } from './app/features/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ConversationsComponent, data: { title: 'Conversaciones' } },
      { path: 'users', component: UsersComponent, data: { title: 'Gestión de usuarios' } },
      { path: 'settings', component: SettingsComponent, data: { title: 'Ajustes' } },
    ],
  },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideStore(reducers),
    provideEffects([ConversationsEffects]),
    provideStoreDevtools(),
  ],
}).catch((err) => console.error(err));
