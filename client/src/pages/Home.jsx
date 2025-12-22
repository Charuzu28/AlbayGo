import { useRef, useState } from 'react';
import Logo from '../components/Logo';
import SearchInput from '../components/SearchInput';
import ChatContainer from '../components/ChatContainer';
import TypingIndicator from '../components/TypingIndicator';

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  // const typingTimeoutRef = useRef(null);

  // const handleSend = (text) => {
  //   const userMessage = {
  //     id: Date.now(),
  //     role: 'user',
  //     content: text
  //   };
  //   setMessages = ((prev) => [...prev, userMessage]);
  // };

   const handleSend = (text) => {
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      createdAt: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Got it. I’ll help you with that.",
        createdAt: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800)
  };

  return (
    <main className='min-h-screen flex justify-center px-4 items-center'>
        <div className='w-full max-w-full text-center space-y-6'>
            <Logo />
            <p className='
            text-gray-600 
              text-sm
              sm:text-lg
              font-poppins
              '>Your local guide for moving around Albay.</p>
              <ChatContainer messages={messages}/>
              {isTyping && <TypingIndicator />}
            <SearchInput onSend={handleSend} />
        </div>
    </main>
  )
}

export default Home