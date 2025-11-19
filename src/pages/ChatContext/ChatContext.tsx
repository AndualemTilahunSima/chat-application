import { createContext, useContext, useState, type ReactNode } from "react";

type ChatContextValue = {
  selectedThreadId: number;
  setSelectedThreadId: (id: number) => void;
};

export const ChatContext = createContext<ChatContextValue | undefined>(
  undefined
);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [selectedThreadId, setSelectedThreadId] = useState<number>(1);

  return (
    <ChatContext.Provider value={{ selectedThreadId, setSelectedThreadId }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }

  return context;
}
