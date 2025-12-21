import React from 'react'
import ChatMessage from './ChatMessage'

export default function ChatContainer({messages = []}) {
    if(messages.length === 0) return null;
  return (
    <div className='space-y-3'>
        {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
        ))}
    </div>
  )
}

