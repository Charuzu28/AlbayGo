const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mt-3" aria-live="polite" aria-label="Assistant is typing">
      <div className="max-w-[80%]">
        <div className="typing-bubble rounded-2xl rounded-bl-md px-4 py-3">
          <div className="typing-sheen" aria-hidden="true" />

          <div className="relative z-10 flex items-center gap-2.5">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="typing-dot" style={{ animationDelay: "0ms" }} />
              <span className="typing-dot" style={{ animationDelay: "180ms" }} />
              <span className="typing-dot" style={{ animationDelay: "360ms" }} />
            </div>

            <span className="text-xs font-medium text-gray-500 tracking-wide">
              AlbayGo is typing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;