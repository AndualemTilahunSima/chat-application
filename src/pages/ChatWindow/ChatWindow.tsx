import ChatBubble from "./ChatBubble";
import "./Chat.css"

export default function ChatWindow() {
  const messages = [
    { side: "left", text: "Hey! How are you doing?", time: "03:27 PM" },
    {
      side: "right",
      text: "I'm good! Thanks for asking. How about you?",
      time: "03:32 PM",
    },
    {
      side: "left",
      text: "Doing great! Want to meet up tomorrow?",
      time: "03:37 PM",
    },
    {
      side: "right",
      text: "Sure! What time works for you?",
      time: "03:42 PM",
    },
    {
      side: "left",
      text: "How about 2 PM at the coffee shop?",
      time: "04:17 PM",
    },
    {
      side: "right",
      text: "Perfect! I'll be there.",
      time: "04:19 PM",
    },
    {
      side: "left",
      text: "See you tomorrow!",
      time: "04:22 PM",
    },
  ];

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <img
          className="avatar"
          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
        />
        <div>
          <div className="chat-name">Alice Johnson</div>
          <div className="chat-status">online</div>
        </div>
        <div className="chat-menu">⋮</div>
      </div>

      <div className="chat-messages">
        {messages.map((m, i) => (
          <ChatBubble key={i} {...m} />
        ))}
      </div>

      <div className="chat-input">
        <input type="text" placeholder="Type a message..." />
      </div>
    </div>
  );
}
