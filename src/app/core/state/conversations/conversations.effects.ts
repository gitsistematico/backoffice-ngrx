import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { map, filter, mergeMap, tap } from "rxjs/operators";
import { ConversationActions } from "./conversations.actions";
import { WebsocketService } from "../../services/websocket.service";

@Injectable()
export class ConversationsEffects {
  private actions$ = inject(Actions);
  private ws = inject(WebsocketService);

  // Re-broadcast WebSocket messages into the store
  wsMessage$ = createEffect(() =>
    this.ws.messages$.pipe(
      map((msg) => {
        console.log(msg);

        // if (
        //   (msg.type === "new_message" || msg.type === "agent_message") &&
        //   msg.payload
        // ) {
        //   const p = msg.payload as {
        //     conversationId: string;
        //     conversationRef: string;
        //     content: string;
        //     senderName: string;
        //   };
        //   return ConversationActions.receiveMessage({
        //     conversationId: msg.conversationId || p.conversationId,
        //     conversationRef: msg.conversationRef || p.conversationRef,
        //     content: p.content,
        //     senderName: p.senderName || "Usuario",
        //   });
        // }
        if (msg && msg.payload) {
          const p = msg.payload as {
            conversationId: string;
            conversationRef: string;
            content: string;
            senderName: string;
          };

          // El ID del hilo de chat al que pertenece el mensaje
          const targetConversationId =
            msg.conversationId ?? p.conversationId ?? "";
          console.log("targetConversationId", targetConversationId);

          return ConversationActions.receiveMessage({
            userId: msg.userId,
            country: msg.country,
            conversationId: targetConversationId,
            conversationRef: msg.conversationRef || p.conversationRef || "",
            content: p.content,
            senderName: p.senderName || msg.userName || "Usuario",
          });
        }
        return null;
      }),
      filter((a): a is NonNullable<typeof a> => a !== null),
    ),
  );

  // Send agent messages out through the WebSocket
  sendMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConversationActions.sendMessage),
      tap(({ userId, country, conversationId, conversationRef, userName, content }) => {
        this.ws.send({
          userId,
          conversationId,
          conversationRef,
          country: country ?? "",
          userName,
          type: "agent_message",
          payload: { conversationId, content },
          sender: "agent",
        });
      }),
      mergeMap(() => of({ type: "[Conversations] Send Message Complete" })),
    ),
  );

  selectConversation$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ConversationActions.selectConversation),
        tap(({ id, userId, country, userName }) => {
          console.log({ userId, country, userName });
          this.ws.emit("join-chat", { userId, country, userName });
        }),
      ),
    { dispatch: false },
  );
}
