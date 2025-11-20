import { useMemo, useState, type ChangeEvent } from "react";
import ChatBubble from "./ChatBubble";
import "./Chat.css";
import { chatMessagesByThread, chatThreads } from "./ChatMessages";
import { useChatContext } from "../ChatContext/ChatContext";
import { TextInput } from "../../components/ui/TextInput/TextInput";
import { Button } from "../../components/ui/Button/Button";
import { EllipsisVerticalIcon } from "../../components/Icons/EllipsisVerticalIcon";
import { PaperclipIcon } from "../../components/Icons/PaperclipIcon";
import { SmileIcon } from "../../components/Icons/SmileIcon";
import { SendIcon } from "../../components/Icons/SendIcon";
import { MicIcon } from "../../components/Icons/MicIcon";
import { VideoIcon } from "../../components/Icons/VideoIcon";

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
          <span className="chat-status">online</span>
        </div>
        <div className="chat-menu">
          <EllipsisVerticalIcon size={18}></EllipsisVerticalIcon>
        </div>
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
        <div className="chat-input-icon">
          <SmileIcon size={20} color="#000" />
        </div>
        <div className="chat-input-icon">
          <PaperclipIcon size={20} color="#000" />
        </div>
        <TextInput
          type="text"
          placeholder="Type a message..."
          value={draftMessage}
          onChange={handleDraftChange}
        />
        <div className="chat-input-icon">
          <MicIcon size={20} color="#000" />
        </div>
        <div className="chat-input-icon">
          <VideoIcon size={20} color="#000" />
        </div>
        <Button
          type="button"
          onClick={handleSend}
          disabled={!draftMessage.trim()}
          className="chat-send-btn"
        >
          <SendIcon size={18} />
        </Button>
      </div>
    </div>
  );
}
