import { useRef, useState } from 'react';
import Logo from '../components/Logo';
import SearchInput from '../components/SearchInput';
import ChatContainer from '../components/ChatContainer';
import TypingIndicator from '../components/TypingIndicator';

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  // const typingTimeoutRef = useRef(null);

  // const handleSend = (text) => {
  //   const userMessage = {
  //     id: Date.now(),
  //     role: 'user',
  //     content: text
  //   };
  //   setMessages = ((prev) => [...prev, userMessage]);
  // };
  
  const handleSend = async (text) => {
     if(!text.trim()) return;
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      createdAt: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({message: text})
      });
      clearTimeout(timeoutId);

      const data = await response.json();
       setTimeout(() => {
        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.reply, 
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        setIsTyping(false);
      }, 2000);
    } catch (error) {
      console.error('Error', error);

       setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          content:
            error.name === "AbortError"
              ? "Request timed out. Please try again."
              : "Something went wrong.", 
          createdAt: new Date(),
       }]);

       setIsTyping(false);
    }
  };

  return (
      <main className="min-h-screen px-4 flex flex-col items-center justify-center">
        <div className="max-w-2xl mx-auto text-center space-y-6 pt-24 mb-5">
          <Logo />
          <p className="text-gray-600 text-sm sm:text-lg font-poppins">
            Your local guide for moving around Albay.
          </p>
        </div>

        <div className="w-full max-w-2xl text-left mb-5">
          <ChatContainer messages={messages} />
          {isTyping && <TypingIndicator />}
        </div>

        <div className="w-full max-w-2xl items-center">
          <SearchInput onSend={handleSend} disabled={isTyping}/>
        </div>
    </main>

  )
}

export default Home