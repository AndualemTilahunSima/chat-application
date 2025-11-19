import "./Chat.css"

export default function ChatBubble({ side, text, time }) {
  return (
    <div className={`msg ${side === "right" ? "right" : "left"}`}>
      {text}
      <div className="time">{time}</div>
    </div>
  );
}
