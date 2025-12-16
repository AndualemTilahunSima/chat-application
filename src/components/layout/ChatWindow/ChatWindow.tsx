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
import { selectChatThreads, selectCurrentThread, markThreadAsRead as markThreadAsReadAction, setThreadStatusForUser } from "../../../store/slices/chatThreadSlice";
import { loadMessagesByThread, selectMessagesByThread, addMessage, markThreadAsRead, sendMessage } from "../../../store/slices/chatMessageSlice";
import { webSocketService } from "../../../services/websocket.service";
import { selectAuthProfile } from "../../../store/slices/authSlice";

export default function ChatWindow() {
  const dispatch = useAppDispatch();

  // Current thread from Redux
  const currentThread = useAppSelector(selectCurrentThread) || {
    id: "-1",
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
    if (currentThread.id && currentThread.id !== "-1") {
      const threadId = String(currentThread.id);
      dispatch(loadMessagesByThread(threadId));
      // Mark thread as read when opened
      dispatch(markThreadAsRead(threadId));
      if (webSocketService.isConnected()) {
        webSocketService.markThreadAsRead(threadId);
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
    const unsubscribeUserOnline = webSocketService.on('user-online', (data: { userId: string }) => {
      dispatch(setThreadStatusForUser({ userId: data.userId, status: "online" }));
    });
    const unsubscribeUserOffline = webSocketService.on('user-offline', (data: { userId: string }) => {
      dispatch(setThreadStatusForUser({ userId: data.userId, status: "offline" }));
    });

    return () => {
      unsubscribeNewMessage();
      unsubscribeMessageSent();
      unsubscribeUserOnline();
      unsubscribeUserOffline();
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
    const threadId = String(activeThread.id);
    const receiverId = activeThread.receiverId;

    if (!threadId || !receiverId) {
      console.warn("Cannot send message: missing thread or receiver information");
      setDraftMessage("");
      return;
    }

    // Prefer WebSocket for real-time messaging
    if (webSocketService.isConnected()) {
      webSocketService.sendMessage(threadId, receiverId, draftMessage.trim());
    } else {
      // Fallback to REST API
      dispatch(sendMessage({ threadId, receiverId, text: draftMessage.trim() }));
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
          <span className="chat-status">
            {activeThread.status === "online" ? "online" : "offline"}
          </span>
        </div>
        <div className="chat-menu">
          <EllipsisVerticalIcon size={18} />
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty-message">No messages yet. Say hi!</div>
        ) : (
          messages.map((message, index) => {
            const senderName =
              message.side === "right"
                ? profile?.displayName || "You"
                : activeThread.name;

            return (
              <ChatBubble
                key={`${activeThread.id}-${index}`}
                side={message.side}
                text={message.text}
                time={message.time}
                senderName={senderName}
              />
            );
          })
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
