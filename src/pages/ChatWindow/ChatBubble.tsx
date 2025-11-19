import "./Chat.css";
import type { ChatMessage } from "./ChatMessages";

type ChatBubbleProps = ChatMessage;

export default function ChatBubble({ side, text, time }: ChatBubbleProps) {
  return (
    <div className={`msg ${side === "right" ? "right" : "left"}`}>
      {text}
      <div className="time">{time}</div>
    </div>
  );
}
