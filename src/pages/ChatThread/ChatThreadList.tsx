import { useState } from "react";
import "./ChatThread.css"
import ChatThreadItem from "./ChatThreadItem";
import { Search } from "../../components/ui/Search/Search";

export default function ChatThreadList() {
  const [search, setSearch] = useState("");

  const chatThreads = [
    {
      id: 1,
      name: "Alice Johnson",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      preview: "See you tomorrow!",
      time: "5d ago",
      unread: 2,
      active: true,
    },
    {
      id: 2,
      name: "Bob Smith",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
      preview: "Thanks for the update!",
      time: "5d ago",
    },
    {
      id: 3,
      name: "Carol White",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      preview: "Let me know when you're free",
      time: "6d ago",
    },
    {
      id: 4,
      name: "David Brown",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      preview: "Sounds good 👍",
      time: "11/10/2025",
    },
    {
      id: 5,
      name: "Emma Davis",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      preview: "Can you send me the files?",
      time: "11/9/2025",
      unread: 1,
    },
  ];

  // ---- FILTERING ----
  const filteredChatThreads = chatThreads.filter((chatThread) => {
    const text = search.toLowerCase();
    return (
      chatThread.name.toLowerCase().includes(text) ||
      chatThread.preview.toLowerCase().includes(text)
    );
  });
  const handleSearch = (value) => {
        setSearch(value)
    };

  return (
    <div className="chat-threads-panel">
      
      <h5>Messages</h5>

      <Search placeholder="Search conversations..." onChange={handleSearch} />

      <div className="chat-threads-list">
        {filteredChatThreads.length === 0 ? (
          <div className="no-results">No conversations found</div>
        ) : (
          filteredChatThreads.map((msg) => (
            <ChatThreadItem {...msg} />
          ))
        )}
      </div>
    </div>
  );
}
