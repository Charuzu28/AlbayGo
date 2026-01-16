export default function ChatMessage({ message, previousMessage }) {
  const isUser = message.role === "user";
  const isSameRole =
    previousMessage && previousMessage.role === message.role;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[80%]
          px-4 py-2
          text-sm
          leading-relaxed
          rounded-2xl
          ${
            isUser
              ? "bg-black text-white rounded-br-md"
              : "bg-gray-100 text-gray-900 rounded-bl-md"
          }
          ${isSameRole ? "mt-1" : "mt-3"}
        `}
      >
        {message.content}
      </div>
    </div>
  );
}
