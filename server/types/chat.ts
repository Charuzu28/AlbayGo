export type Intent =
  | "route"
  | "food"
  | "stay"
  | "tourist"
  | "nearby"
  | "itinerary"
  | "extend-itinerary"
  | "recommend"
  | "why"
  | "transport"
  | "remove-place"
  | "move-place"
  | "replace-place"
  | "context-followup"
  | "greeting"
  | "gratitude"
  | "capability"
  | "farewell"
  | "unknown";

export type MessageType =
  | "text"
  | "route-result"
  | "route-followup"
  | "missing-route-origin"
  | "missing-route-destination";

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

export interface RouteSlots {
  from: string | null;
  to: string | null;
  mentionedPlaces: string[];
}

export interface SessionState {
  createdAt: number;
  updatedAt: number;
  pendingRoute: {
    from: string | null;
    to: string | null;
  };
  lastRouteOptions: RouteOption[];
  selectedRoute: RouteOption | null;
  lastIntent?: Intent | null;
  itinerary?: {
    location: string;
    days: Array<{
      day: number;
      places: Array<{
        _id?: string;
        name: string;
      }>;
    }>;
  };
  lastPlaceKey?: string;
  lastEditedPlace?: string;
}

export interface ChatResponse {
  reply: string;
  intent?: Intent | string;
  messageType?: MessageType;
  routeOptions?: RouteOption[];
  selectedRoute?: RouteOption | null;
}