import { useState } from "react";

export default function SearchInput({onSend, disabled}) {
  const [query, setQuery] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || disabled) return;

    onSend(query);
    setQuery("");
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
        onChange={(e) => setQuery(e.target.value)}
        className="
          w-full
          max-w-xs
          sm:max-w-sm
          md:max-w-xl
          lg:max-w-4xl
          px-4 py-3
          border border-gray-300
          rounded-xl
          text-base
          focus:outline-none
          focus:ring-2 focus:ring-black
          font-poppins
        "
      />
    </form>
  );
}
