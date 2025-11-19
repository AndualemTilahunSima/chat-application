type ChatThreadItemProps = {
  id: number;
  avatar: string;
  name: string;
  preview: string;
  time: string;
  unread?: number;
  active?: boolean;
  onClick?: (id: number) => void;
};

export default function ChatThreadItem({
  id,
  avatar,
  name,
  preview,
  time,
  unread,
  active = false,
  onClick,
}: ChatThreadItemProps) {
  function handleOnClick() {
    onClick?.(id);
  }

  return (
    <button
      type="button"
      className={`chat-thread-item ${active ? "active" : ""}`}
      onClick={handleOnClick}
    >
      <img src={avatar} className="chat-thread-avatar" alt={`${name} avatar`} />

      <div className="chat-thread-info">
        <div className="chat-thread-row">
          <span className="chat-thread-name">{name}</span>
          <span className="chat-thread-time">{time}</span>
        </div>
        <div className="chat-thread-preview">
          <span className="chat-thread-preview-text">{preview}</span>
          {unread ? <div className="chat-thread-badge">{unread}</div> : null}
        </div>
      </div>
    </button>
  );
}
