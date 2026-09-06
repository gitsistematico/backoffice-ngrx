import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { io, Socket } from "socket.io-client";
import { JoinedConversation } from "../models/conversation.model";

export interface WsMessage {
  userId: string;
  conversationId?: string;
  country: string;
  conversationRef?: string;
  userName?: string;
  type: string;
  payload: unknown;
  sender?: "user" | "agent"; 
}

@Injectable({ providedIn: "root" })
export class WebsocketService implements OnDestroy {
  private socket: Socket | null = null;

  private connected$ = new BehaviorSubject<boolean>(false);
  messages$ = new Subject<WsMessage>();
  
  // NUEVO: Subject para escuchar los mensajes de la sala global
  globalMessages$ = new Subject<WsMessage>(); 

  connected = this.connected$.asObservable();

  connect(url: string, dataConection?: JoinedConversation): void {
    if (this.socket?.connected) return;
    
    this.socket = io(url, {
      autoConnect: true,
      transports: ["websocket", "polling"],
      auth: {
        userId: "1", // hay que cargar la info del agente logueado
        role: "agent", // NUEVO: Obligatorio para que el backend lo meta a 'global-agents'
        lastMessageId: 0, 
      },
    });

    this.socket.on("connect", () => {
      this.connected$.next(true);
      console.log("[WS] Connected to", url, "ID:", this.socket?.id);

      if (dataConection) {
        this.emit("join-chat", { ...dataConection });
      }
    });

    this.socket.on('listen-room', (data: any) =>{
      console.log('[WS] Listening to room:', data);
    });

    // Escucha la sala de chat individual (solo la que el agente tenga abierta)
    this.socket.on("new-message", (data: WsMessage) => {
      console.log("[WS] Received message 1 a 1:", data);
      if (data.type !== "agent_message") {
        this.messages$.next(data);
      }
    });

    // NUEVO: Escucha el radar global de todos los usuarios
    this.socket.on("incoming-user-message", (data: WsMessage) => {
      console.log("[WS] Mensaje global recibido (para actualizar lista):", data);
      this.globalMessages$.next(data);
      this.messages$.next(data);
    });

    this.socket.on("disconnect", (reason) => {
      this.connected$.next(false);
      console.log("[WS] Disconnected:", reason);
    });

    this.socket.on("connect_error", (err) => {
      console.error("[WS] Connection Error", err);
    });
  }

  send(message: WsMessage): void {
    if (this.socket?.connected) {
      console.log("[WS] Sending message:", message);
      this.socket.emit("send-message", message);
    }
  }

  emit(eventName: string, data: unknown): void {
    if (this.socket?.connected) {
      console.log(`[WS] Emitting event '${eventName}' with data:`, data);
      this.socket.emit(eventName, data);
    }
  }

  // NUEVO: Método para que el agente se una a la sala específica al hacer clic en un chat
  agentJoinConversation(conversationId: string): void {
    if (this.socket?.connected) {
      console.log(`[WS] Agente solicitando unirse a la sala: ${conversationId}`);
      this.socket.emit("agent-join-conversation", conversationId);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected$.next(false);
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}