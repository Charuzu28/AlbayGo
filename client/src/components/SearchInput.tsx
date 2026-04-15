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

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        placeholder={
          disabled
            ? "AlbayGo is thinking...."
            : "Ask how to get around Albay… (Press Enter)"
        }
        value={query}
        onChange={handleChange}
        className="
          w-full
          max-w-xl
          sm:max-w-4xl
          md:max-w-6xl
          lg:max-w-5xl
          px-4 py-3
          border border-gray-300
          rounded-3xl
          text-base
          focus:outline-none
          focus:ring-1 focus:ring-black
          font-poppins
        "
      />
    </form>
  );
}