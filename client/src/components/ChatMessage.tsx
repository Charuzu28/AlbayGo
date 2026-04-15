import RouteCard from "./RouteCard";
import type { ChatMessage as ChatMessageType } from "../types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
  previousMessage?: ChatMessageType;
}

export default function ChatMessage({
  message,
  previousMessage,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSameRole = previousMessage?.role === message.role;

  const shouldRenderRouteCards =
    !isUser &&
    message.messageType === "route-result" &&
    Array.isArray(message.routeOptions) &&
    message.routeOptions.length > 0;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] ${isSameRole ? "mt-1" : "mt-3"}`}>
        {shouldRenderRouteCards ? (
          <div className="space-y-3">
            {message.content && (
              <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-2 text-sm leading-relaxed text-gray-900">
                {message.content}
              </div>
            )}

            {message.routeOptions.map((route, index) => (
              <RouteCard
                key={`${message.id}-route-${index}`}
                route={route}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div
            className={`
              rounded-2xl
              px-4
              py-2
              text-sm
              leading-relaxed
              ${
                isUser
                  ? "rounded-br-md bg-black text-white"
                  : "rounded-bl-md bg-gray-100 text-gray-900"
              }
            `}
          >
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
}