import { Injectable } from "@angular/core";
import { Conversation } from "../models/conversation.model";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ConversationService {
  serverUrl = import.meta.env.NG_APP_BACKEND_URL;
  allConversationsUrl = import.meta.env.NG_APP_ALL_CONVERSATIONS_URL;
  constructor(private http: HttpClient) {}

  getMockConversations(): Observable<Conversation[]> {
    return this.http
      .get<Conversation[]>(`${this.serverUrl}/${this.allConversationsUrl}`)
      .pipe(
        map((data: any) => {
          console.log("respuesta", data);

          // Aquí puedes transformar los datos si es necesario antes de devolverlos
          return data.data;
        }),
      );

    // return [
    //   {
    //     id: 'conv-1',
    //     userId: '23',
    //     userName: 'Lucía Ortega',
    //     userInitials: 'LO',
    //     userAvatarColor: '#c8e6c9',
    //     country: 'España',
    //     countryFlag: 'ES',
    //     language: 'Español',
    //     conversationRef: 'conv-2',
    //     status: 'pending',
    //     route: 'eses-main',
    //     unreadCount: 1,
    //     lastMessage: 'Perfecto, muchas gracias. Entonces...',
    //     lastMessageTime: new Date('2025-07-16T12:42:00'),
    //     startedAt: new Date('2025-07-16T12:18:00'),
    //     messages: [
    //       { id: 'm1', conversationId: 'conv-1', sender: 'user', senderName: 'Lucía', content: 'Hola, he empezado el reto de organización semanal, pero no encuentro dónde marcar el segundo día como completado.', timestamp: new Date('2025-07-16T12:18:00'), read: true },
    //       { id: 'm2', conversationId: 'conv-1', sender: 'agent', senderName: 'eses-main', content: 'Hola, Lucía. Entra de nuevo en el reto y desliza hasta el bloque "Mi progreso". Allí verás el botón para completar el día 2.', timestamp: new Date('2025-07-16T12:31:00'), read: true },
    //       { id: 'm3', conversationId: 'conv-1', sender: 'user', senderName: 'Lucía', content: 'Perfecto, muchas gracias. Entonces tengo que entrar desde "Retos activos", ¿verdad?', timestamp: new Date('2025-07-16T12:42:00'), read: true },
    //     ],
    //   },
    //   {
    //     id: 'conv-2',
    //     userId: '24',
    //     userName: 'Javier Molina',
    //     userInitials: 'JM',
    //     userAvatarColor: '#b2dfdb',
    //     country: 'España',
    //     countryFlag: 'ES',
    //     language: 'Español',
    //     conversationRef: 'conv-1',
    //     status: 'pending',
    //     route: 'eses-main',
    //     unreadCount: 2,
    //     lastMessage: 'No encuentro la sesión que guardé ayer.',
    //     lastMessageTime: new Date('2025-07-16T11:18:00'),
    //     startedAt: new Date('2025-07-16T11:05:00'),
    //     messages: [
    //       { id: 'm4', conversationId: 'conv-2', sender: 'user', senderName: 'Javier', content: 'No encuentro la sesión que guardé ayer.', timestamp: new Date('2025-07-16T11:18:00'), read: false },
    //     ],
    //   },
    //   {
    //     id: 'conv-3',
    //     userId: 'u3',
    //     userName: 'Camille Laurent',
    //     userInitials: 'CL',
    //     userAvatarColor: '#ffe0b2',
    //     country: 'Francia',
    //     countryFlag: 'FR',
    //     language: 'Francés',
    //     conversationRef: '#FR-1204',
    //     status: 'open',
    //     route: 'eses-main',
    //     unreadCount: 1,
    //     lastMessage: 'Bonjour, j\'ai une question sur le défi...',
    //     lastMessageTime: new Date('2025-07-16T10:36:00'),
    //     startedAt: new Date('2025-07-16T10:20:00'),
    //     messages: [
    //       { id: 'm5', conversationId: 'conv-3', sender: 'user', senderName: 'Camille', content: 'Bonjour, j\'ai une question sur le défi de la semaine.', timestamp: new Date('2025-07-16T10:36:00'), read: false },
    //     ],
    //   },
    //   {
    //     id: 'conv-4',
    //     userId: 'u4',
    //     userName: 'Sofía Martín',
    //     userInitials: 'SM',
    //     userAvatarColor: '#f8bbd0',
    //     country: 'España',
    //     countryFlag: 'ES',
    //     language: 'Español',
    //     conversationRef: '#ES-2835',
    //     status: 'open',
    //     route: 'eses-main',
    //     unreadCount: 0,
    //     lastMessage: 'Gracias por la explicación, ya lo tengo.',
    //     lastMessageTime: new Date('2025-07-15T09:20:00'),
    //     startedAt: new Date('2025-07-15T09:00:00'),
    //     messages: [
    //       { id: 'm6', conversationId: 'conv-4', sender: 'user', senderName: 'Sofía', content: 'Gracias por la explicación, ya lo tengo.', timestamp: new Date('2025-07-15T09:20:00'), read: true },
    //     ],
    //   },
    //   {
    //     id: 'conv-5',
    //     userId: 'u5',
    //     userName: 'Antoine Roux',
    //     userInitials: 'AR',
    //     userAvatarColor: '#e1bee7',
    //     country: 'Francia',
    //     countryFlag: 'FR',
    //     language: 'Francés',
    //     conversationRef: '#FR-1199',
    //     status: 'open',
    //     route: 'eses-main',
    //     unreadCount: 0,
    //     lastMessage: 'La notification ne s\'affiche pas.',
    //     lastMessageTime: new Date('2025-07-15T08:10:00'),
    //     startedAt: new Date('2025-07-15T07:55:00'),
    //     messages: [
    //       { id: 'm7', conversationId: 'conv-5', sender: 'user', senderName: 'Antoine', content: 'La notification ne s\'affiche pas.', timestamp: new Date('2025-07-15T08:10:00'), read: true },
    //     ],
    //   },
    //   {
    //     id: 'conv-6',
    //     userId: 'u6',
    //     userName: 'Elena Ruiz',
    //     userInitials: 'ER',
    //     userAvatarColor: '#fff9c4',
    //     country: 'España',
    //     countryFlag: 'ES',
    //     language: 'Español',
    //     conversationRef: '#ES-2820',
    //     status: 'closed',
    //     route: 'eses-main',
    //     unreadCount: 0,
    //     lastMessage: 'He completado el reto de esta semana.',
    //     lastMessageTime: new Date('2025-07-14T16:00:00'),
    //     startedAt: new Date('2025-07-14T15:30:00'),
    //     messages: [
    //       { id: 'm8', conversationId: 'conv-6', sender: 'user', senderName: 'Elena', content: 'He completado el reto de esta semana.', timestamp: new Date('2025-07-14T16:00:00'), read: true },
    //     ],
    //   },
    // ];
  }
}
