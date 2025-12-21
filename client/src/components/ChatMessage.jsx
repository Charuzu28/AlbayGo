import React from 'react'

export default function ChatMessage({message}) {
    const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div className={
            `
            max-w-[80%]
            rounded-xl
            px-4 py-2
            text-sm
            ${isUser 
            ? "bg-black text-white"
            : "bg-gray-100 text-black"}`
        }>
            {message.content}
        </div>
    </div>
  )
}

