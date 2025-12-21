import { useState } from 'react';
import Logo from '../components/Logo';
import SearchInput from '../components/SearchInput';
import ChatContainer from '../components/ChatContainer';

const Home = () => {
  const [messages, setMessages] = useState([]);

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
      content: text
    };
    setMessages((prev) => [...prev, userMessage]);
    
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now(),
        role: "assistant",
        content: "Got it. I’ll help you with that."
      };

      setMessages((prev) => [...prev, assistantMessage]);
    }, 600)
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
            <SearchInput onSend={handleSend} />
        </div>
    </main>
  )
}

export default Home