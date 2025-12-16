import { useState } from "react";
import "./ChatThread.css"
import ChatThreadItem from "./ChatThreadItem";
import { Search } from "../../ui/Search/Search";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectChatThreads, selectChatThread, selectCurrentThread, markThreadAsRead as markThreadAsReadAction, type ChatThread } from "../../../store/slices/chatThreadSlice";
import { markThreadAsRead } from "../../../store/slices/chatMessageSlice";
import { webSocketService } from "../../../services/websocket.service";


export default function ChatThreadList() {
  const [search, setSearch] = useState("");
  // const { selectedThreadId, setSelectedThreadId } = useChatContext();
  const chatThreads = useAppSelector(selectChatThreads);
  const dispatch = useAppDispatch();
  const currentThread = useAppSelector(selectCurrentThread) || { id: "-1", name: "", avatar: "", preview: "", unread: 0 };

  

  // const chatThreads = Threads.chatThreads

  // ---- FILTERING ----
  const filteredChatThreads = chatThreads.filter((chatThread: ChatThread) => {
    const text = search.toLowerCase();
    return (
      chatThread.name.toLowerCase().includes(text) ||
      chatThread.preview.toLowerCase().includes(text)
    );
  });
  const handleSearch = (value: string) => {
    setSearch(value)
  };

  return (
    <div className="chat-threads-panel">

      <h5>Messages</h5>

      <Search
        placeholder="Search conversations..."
        onChange={handleSearch}
        value={search}
      />

      <div className="chat-threads-list">
        {filteredChatThreads.length === 0 ? (
          <div className="no-results">No conversations found</div>
        ) : (
          filteredChatThreads.map((msg: ChatThread) => (

            <ChatThreadItem
              key={msg.id}
              {...msg}
              active={msg.id === currentThread.id} // <-- condition for active
              onClick={(id) => { 
                dispatch(selectChatThread({ id }));
                // Mark thread as read when selected
                dispatch(markThreadAsReadAction(id));
                // Also mark as read in backend and via websocket
                if (webSocketService.isConnected()) {
                  dispatch(markThreadAsRead(id));
                  webSocketService.markThreadAsRead(id);
                }
              }} // update selected thread
            />
          ))
        )}
      </div>
    </div>
  );
}
