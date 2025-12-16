import "./Chat.css";

type ChatBubbleProps = {
  side: "left" | "right";
  text: string;
  time: string;
  /**
   * Display label for who sent the message.
   * e.g. "You" for the logged-in user or the other participant's name.
   */
  senderName?: string;
};

export default function ChatBubble({ side, text, time, senderName }: ChatBubbleProps) {
  return (
    <div className={`msg ${side === "right" ? "right" : "left"}`}>
      {senderName && <div className="msg-sender">{senderName}</div>}
      <div className="msg-text">{text}</div>
      <div className="time">{time}</div>
    </div>
  );
}
