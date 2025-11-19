import { useState } from "react";
import "./ChatThread.css"
import ChatThreadItem from "./ChatThreadItem";
import { Search } from "../../components/ui/Search/Search";
import { useChatContext } from "../ChatContext/ChatContext";
import { chatThreads } from "../ChatWindow/ChatMessages";

export default function ChatThreadList() {
  const [search, setSearch] = useState("");
  const { selectedThreadId, setSelectedThreadId } = useChatContext();


  

  // ---- FILTERING ----
  const filteredChatThreads = chatThreads.filter((chatThread) => {
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
          filteredChatThreads.map((msg) => (

            <ChatThreadItem
              key={msg.id}
              {...msg}
              active={msg.id === selectedThreadId} // <-- condition for active
              onClick={(id) => setSelectedThreadId(id)} // update selected thread
            />
          ))
        )}
      </div>
    </div>
  );
}
