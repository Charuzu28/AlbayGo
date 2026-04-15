export type Role = "user" | "assistant";

export type MessageType = "text" | "route-result" | "route-followup";

export interface RouteOption {
  fromKey?: string;
  toKey?: string;
  from: string;
  to: string;
  vehicle: string;
  via: string[];
  fare?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  intent: string | null;
  messageType: MessageType;
  routeOptions: RouteOption[];
  selectedRoute: RouteOption | null;
  createdAt: string;
}

export interface ChatApiResponse {
  reply: string;
  intent?: string;
  messageType?: MessageType;
  routeOptions?: RouteOption[];
  selectedRoute?: RouteOption | null;
}