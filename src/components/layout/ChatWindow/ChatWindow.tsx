import { useEffect, useState, useMemo, useRef } from "react";
import ChatBubble from "./ChatBubble";
import "./Chat.css";
import { EllipsisVerticalIcon } from "../../Icons/EllipsisVerticalIcon";
import { PaperclipIcon } from "../../Icons/PaperclipIcon";
import { SendIcon } from "../../Icons/SendIcon";
import { SmileIcon } from "../../Icons/SmileIcon";
import { Button } from "../../ui/Button/Button";
import { ChatInput } from "../../ui/ChatInput/ChatInput";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectChatThreads, selectCurrentThread, markThreadAsRead as markThreadAsReadAction } from "../../../store/slices/chatThreadSlice";
import { loadMessagesByThread, selectMessagesByThread, addMessage, markThreadAsRead, sendMessage } from "../../../store/slices/chatMessageSlice";
import { webSocketService } from "../../../services/websocket.service";
import { selectAuthProfile } from "../../../store/slices/authSlice";

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

  const profile = useAppSelector(selectAuthProfile);
  
  // Always call the hook, even if the thread ID is invalid
  const messages = useAppSelector(selectMessagesByThread(currentThread.id)) ?? [];

  // Load messages for the current thread
  useEffect(() => {
    if (currentThread.id !== -1 && typeof currentThread.id === 'string') {
      dispatch(loadMessagesByThread(currentThread.id));
      // Mark thread as read when opened
      dispatch(markThreadAsRead(currentThread.id));
      if (webSocketService.isConnected()) {
        webSocketService.markThreadAsRead(currentThread.id);
      }
    }
  }, [currentThread.id, dispatch]);

  // Set up WebSocket listeners
  useEffect(() => {
    if (!profile?.token) return;

    const handleNewMessage = (data: any) => {
      // Transform backend message to frontend format
      const decoded = profile.token ? (() => {
        try {
          const base64Url = profile.token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          return JSON.parse(jsonPayload);
        } catch (error) {
          return null;
        }
      })() : null;
      const currentUserId = decoded?.sub;

      const message = {
        id: data.id,
        threadId: data.threadId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        side: data.senderId === currentUserId ? "right" : "left" as const,
        text: data.text,
        time: new Date(data.createdAt).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        isRead: data.isRead,
        createdAt: new Date(data.createdAt),
      };

      dispatch(addMessage({ threadId: data.threadId, message }));
    };

    const unsubscribeNewMessage = webSocketService.on('new-message', handleNewMessage);
    const unsubscribeMessageSent = webSocketService.on('message-sent', handleNewMessage);

    return () => {
      unsubscribeNewMessage();
      unsubscribeMessageSent();
    };
  }, [profile?.token, dispatch]);

  // Draft message state
  const [draftMessage, setDraftMessage] = useState("");

  const handleSend = async () => {
    if (!draftMessage.trim() || !activeThread || !profile?.token) return;
    
    // Decode JWT to get current user ID
    const decoded = profile.token ? (() => {
      try {
        const base64Url = profile.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch (error) {
        return null;
      }
    })() : null;
    
    if (!decoded?.sub) return;
    
    const currentUserId = decoded.sub;
    const threadId = String(currentThread.id);
    
    // TODO: For now, we need receiverId from thread data
    // Since default threads from JSON don't have participant IDs,
    // this needs to be handled by loading threads from backend API
    // For now, this will work when threads are loaded from backend
    // For JSON threads, we'd need to map them to user IDs
    
    // Try to get receiverId from the thread's participantIds (if available from backend)
    // For now, we'll use the threadId and let the backend handle thread creation
    // This is a placeholder - in production, threads should store participant information
    const receiverId = ""; // This should come from thread.participantIds (other than currentUserId)
    
    // If we have a valid threadId (string UUID), try to send via WebSocket
    // Otherwise, use REST API which will create the thread
    if (threadId && receiverId && webSocketService.isConnected()) {
      webSocketService.sendMessage(threadId, receiverId, draftMessage.trim());
    } else {
      // For now, just clear the draft - proper implementation needs thread participant info
      console.warn("Cannot send message: missing thread or receiver information");
    }
    
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
