import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { WebsocketService } from '../../core/services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnDestroy {
  expanded = false;
  connected = false;
  private sub: Subscription;

  constructor(private ws: WebsocketService) {
    this.sub = this.ws.connected.subscribe(c => this.connected = c);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
