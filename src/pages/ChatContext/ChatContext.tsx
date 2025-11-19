// ChatContext.js
import { createContext, useState } from "react";

export const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [selectedThreadId, setSelectedThreadId] = useState(1);

  return (
    <ChatContext.Provider value={{ selectedThreadId, setSelectedThreadId }}>
      {children}
    </ChatContext.Provider>
  );
}
