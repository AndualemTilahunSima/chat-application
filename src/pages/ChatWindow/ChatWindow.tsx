import { useMemo, useState, type ChangeEvent } from "react";
import ChatBubble from "./ChatBubble";
import "./Chat.css";
import { chatMessagesByThread, chatThreads } from "./ChatMessages";
import { useChatContext } from "../ChatContext/ChatContext";
import { TextInput } from "../../components/ui/TextInput/TextInput";
import { Button } from "../../components/ui/Button/Button";

export default function ChatWindow() {
  const { selectedThreadId } = useChatContext();
  const [draftMessage, setDraftMessage] = useState("");

  const activeThread = useMemo(() => {
    if (!chatThreads.length) {
      return undefined;
    }

    return (
      chatThreads.find((thread) => thread.id === selectedThreadId) ??
      chatThreads[0]
    );
  }, [selectedThreadId]);

  if (!activeThread) {
    return (
      <div className="chat-panel empty-state">
        No conversations yet. Start one from the thread list.
      </div>
    );
  }

  const messages = chatMessagesByThread[activeThread.id] ?? [];

  const handleDraftChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftMessage(event.target.value);
  };

  const handleSend = () => {
    if (!draftMessage.trim()) {
      return;
    }

    // The actual send logic will be implemented once backend wiring is ready.
    setDraftMessage("");
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <img className="avatar" src={activeThread.avatar} />
        <div>
          <div className="chat-name">{activeThread.name}</div>
          <div className="chat-status">online</div>
        </div>
        <div className="chat-menu">⋮</div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty-message">
            No messages yet. Say hi!
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatBubble
              key={`${activeThread.id}-${index}`}
              {...message}
            />
          ))
        )}
      </div>

      <div className="chat-input">
        <TextInput
          type="text"
          placeholder="Type a message..."
          value={draftMessage}
          onChange={handleDraftChange}
        />
        <Button
          type="button"
          onClick={handleSend}
          disabled={!draftMessage.trim()}
          className="chat-send-btn"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
