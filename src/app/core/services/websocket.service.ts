import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface WsMessage {
  type: string;
  payload: unknown;
}

@Injectable({ providedIn: 'root' })
export class WebsocketService implements OnDestroy {
  private socket: WebSocket | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  private connected$ = new BehaviorSubject<boolean>(false);
  messages$ = new Subject<WsMessage>();

  connected = this.connected$.asObservable();

  connect(url: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) return;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      this.connected$.next(true);
      console.log('[WS] Connected to', url);
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const data: WsMessage = JSON.parse(event.data as string);
        this.messages$.next(data);
      } catch {
        // ignore malformed messages
      }
    };

    this.socket.onclose = () => {
      this.connected$.next(false);
      console.log('[WS] Disconnected — retrying in 5s');
      this.reconnectTimeout = setTimeout(() => this.connect(url), 5000);
    };

    this.socket.onerror = (err) => {
      console.error('[WS] Error', err);
      this.socket?.close();
    };
  }

  send(message: WsMessage): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  disconnect(): void {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.socket?.close();
    this.socket = null;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
