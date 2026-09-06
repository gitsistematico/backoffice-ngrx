import { createActionGroup, props } from "@ngrx/store";
import { Conversation, Message } from "../../models/conversation.model";

export const ConversationActions = createActionGroup({
  source: "Conversations",
  events: {
    "Load Conversations": props<{ conversations: Conversation[] }>(),
    "Select Conversation": props<{
      id: number | string;
      userId: string;
      country: string;
      userName?: string;
    }>(),
    "Send Message": props<{
      userId: string;
      conversationId: string;
      country?: string;
      conversationRef: string;
      userName: string;
      content: string;
      sender: "user" | "agent";
    }>(),
    "Receive Message": props<{
      userId: string;
      country: string;
      conversationId: string;
      conversationRef: string;
      content: string;
      senderName: string;
    }>(),
    "Close Conversation": props<{ id: string }>(),
  },
});
