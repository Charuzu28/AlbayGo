import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

export default function ChatContainer({ messages = [] }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      {messages.map((msg, index) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          previousMessage={messages[index - 1]}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
