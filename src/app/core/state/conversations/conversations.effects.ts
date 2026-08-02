import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, filter, mergeMap, tap } from 'rxjs/operators';
import { ConversationActions } from './conversations.actions';
import { WebsocketService } from '../../services/websocket.service';

@Injectable()
export class ConversationsEffects {
  private actions$ = inject(Actions);
  private ws = inject(WebsocketService);

  // Re-broadcast WebSocket messages into the store
  wsMessage$ = createEffect(() =>
    this.ws.messages$.pipe(
      map(msg => {
        if (msg.type === 'new_message' && msg.payload) {
          const p = msg.payload as { conversationId: string; content: string; senderName: string };
          return ConversationActions.receiveMessage({
            conversationId: p.conversationId,
            content: p.content,
            senderName: p.senderName,
          });
        }
        return null;
      }),
      filter((a): a is NonNullable<typeof a> => a !== null),
    )
  );

  // Send agent messages out through the WebSocket
  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConversationActions.sendMessage),
      tap(({ conversationId, content }) => {
        this.ws.send({ type: 'agent_message', payload: { conversationId, content } });
      }),
      mergeMap(() => of({ type: '[Conversations] Send Message Complete' })),
    )
  );
}
