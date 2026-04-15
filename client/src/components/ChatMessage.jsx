import RouteCard from "./RouteCard";

export default function ChatMessage({ message, previousMessage }) {
  const isUser = message.role === "user";
  const isSameRole =
    previousMessage && previousMessage.role === message.role;

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
              px-4 py-2
              text-sm
              leading-relaxed
              rounded-2xl
              ${
                isUser
                  ? "bg-black text-white rounded-br-md"
                  : "bg-gray-100 text-gray-900 rounded-bl-md"
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