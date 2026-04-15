import { useState } from 'react';
import Logo from '../components/Logo';
import SearchInput from '../components/SearchInput';
import ChatContainer from '../components/ChatContainer';
import TypingIndicator from '../components/TypingIndicator';

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const hasMessages = messages.length > 0;

  const handleSend = async (text) => {
    if (!text.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/chat`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.reply || "No reply received.",
        intent: data.intent || null,
        messageType: data.messageType || "text",
        routeOptions: data.routeOptions || [],
        selectedRoute: data.selectedRoute || null,
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Frontend request error:", error);

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content:
          error.name === "AbortError"
            ? "Request timed out. Please try again."
            : "Something went wrong.",
        intent: null,
        messageType: "text",
        routeOptions: [],
        selectedRoute: null,
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      clearTimeout(timeoutId);
      setIsTyping(false);
    }
  };

  return (
    <main className="min-h-screen h-dvh flex flex-col bg-white">
      <header
        className={`w-full max-w-2xl mx-auto px-4 transition-all duration-300
          ${hasMessages ? "pt-4 pb-2 text-left" : "flex-1 flex flex-col items-center justify-center"}
        `}
      >
        <Logo />

        {!hasMessages && (
          <p className="text-gray-600 text-sm sm:text-lg font-poppins mt-3 text-center">
            Your local guide for moving around Albay.
          </p>
        )}
      </header>

      {hasMessages && (
        <section className="w-full max-w-2xl mx-auto flex-1 overflow-y-auto px-4 py-4 space-y-3">
          <ChatContainer messages={messages} />
          {isTyping && <TypingIndicator />}
        </section>
      )}

      <footer
        className={`w-full max-w-2xl mx-auto px-4 pb-4 pt-2 bg-white
          ${hasMessages ? "sticky bottom-0" : "mb-10"}
        `}
      >
        <SearchInput onSend={handleSend} disabled={isTyping} />
      </footer>
    </main>
  );
};

export default Home;