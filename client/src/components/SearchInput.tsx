import { useState, type FormEvent, type ChangeEvent } from "react";

interface SearchInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function SearchInput({
  onSend,
  disabled,
}: SearchInputProps) {
  const [query, setQuery] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query.trim() || disabled) return;

    onSend(query);
    setQuery("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSendClick = () => {
    if (!query.trim() || disabled) return;
    onSend(query);
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder={
            disabled
              ? "AlbayGo is thinking...."
              : "Ask how to get around Albay…"
          }
          value={query}
          onChange={handleChange}
          disabled={disabled}
          className="
            flex-1
            px-4 py-3
            border border-gray-300
            rounded-2xl
            text-base
            focus:outline-none
            focus:ring-1 focus:ring-pink-400
            font-poppins
            disabled:opacity-60
          "
        />
        <button
          type="button"
          onClick={handleSendClick}
          disabled={disabled || !query.trim()}
          className="
            p-2.5
            bg-black
            text-white
            rounded-full
            hover:bg-gray-900
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200
            flex items-center justify-center
          "
          aria-label="Send message"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}