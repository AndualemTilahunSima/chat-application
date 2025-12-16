import { useEffect, useState, useMemo } from "react";
import ChatBubble from "./ChatBubble";
import "./Chat.css";
import { EllipsisVerticalIcon } from "../../Icons/EllipsisVerticalIcon";
import { PaperclipIcon } from "../../Icons/PaperclipIcon";
import { SendIcon } from "../../Icons/SendIcon";
import { SmileIcon } from "../../Icons/SmileIcon";
import { Button } from "../../ui/Button/Button";
import { ChatInput } from "../../ui/ChatInput/ChatInput";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectChatThreads, selectCurrentThread } from "../../../store/slices/chatThreadSlice";
import { loadMessagesByThread, selectMessagesByThread } from "../../../store/slices/chatMessageSlice";

export default function ChatWindow() {
  const dispatch = useAppDispatch();

  // Current thread from Redux
  const currentThread = useAppSelector(selectCurrentThread) || {
    id: -1,
    name: "",
    avatar: "",
    preview: "",
    unread: 0,
  };

  // All threads from Redux
  const chatThreads = useAppSelector(selectChatThreads);

  // Active thread object
  const activeThread = useMemo(() => {
    if (!chatThreads || chatThreads.length === 0) return null;
    return chatThreads.find((t) => t.id === currentThread.id) ?? null;
  }, [chatThreads, currentThread.id]);

  // Always call the hook, even if the thread ID is invalid
  const messages = useAppSelector(selectMessagesByThread(currentThread.id)) ?? [];

  // Load messages for the current thread
  useEffect(() => {
    if (currentThread.id !== -1) {
      dispatch(loadMessagesByThread(currentThread.id));
    }
  }, [currentThread.id, dispatch]);

  // Draft message state
  const [draftMessage, setDraftMessage] = useState("");

  const handleSend = () => {
    if (!draftMessage.trim()) return;
    // TODO: implement sending logic
    setDraftMessage("");
  };

  const handleDraftChange = (value: string) => setDraftMessage(value);

  // Empty state if no active thread
  if (!activeThread) {
    return (
      <div className="chat-panel empty-state">
        No conversations yet. Start one from the thread list.
      </div>
    );
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <img className="avatar" src={activeThread.avatar} alt={activeThread.name} />
        <div>
          <div className="chat-name">{activeThread.name}</div>
          <span className="chat-status">online</span>
        </div>
        <div className="chat-menu">
          <EllipsisVerticalIcon size={18} />
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty-message">No messages yet. Say hi!</div>
        ) : (
          messages.map((message, index) => (
            <ChatBubble key={`${activeThread.id}-${index}`} {...message} />
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
        <ChatInput
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
          <SendIcon size={18} />
        </Button>
      </div>
    </div>
  );
}
