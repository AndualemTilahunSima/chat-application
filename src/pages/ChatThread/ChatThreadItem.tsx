export default function ChatThreadItem({
  avatar,
  name,
  preview,
  time,
  unread,
  active,
}) {
  return (
    <>
      <style>{`
        .chat-thread-item {
  display: flex;
  padding: 0.8rem;
  gap: 1rem;
  border-radius: 12px;
  cursor: pointer;
}

.chat-thread-item.active {
  background: #f0fbf8;
}

.avatar {
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 50%;
}

.chat-thread-info {
  flex: 1;
}

.row {
  display: flex;
  justify-content: space-between;
}

.time {
  font-size: 0.85rem;
  color: #828a95;
}

.preview {
  display: flex;
  justify-content: space-between;
  margin-top:0.5rem;
}
.preview-text{
  font-size: 0.9rem;
  color: #61656b;
  margin-top: 2px;
}

.badge {
  background: #22b8a4;
  color: #fff;
  font-weight: bold;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content:center;
}
      `}</style>
      <div className={`chat-thread-item ${active ? "active" : ""}`}>
        <img src={avatar} className="avatar" />

        <div className="chat-thread-info">
          <div className="row">
            <span className="name">{name}</span>
            <span className="time">{time}</span>
          </div>
          <div className="preview">
            <span className="preview-text">{preview}</span>
            <div>{unread && <div className="badge">{unread}</div>}</div>
          </div>
        </div>
      </div>
    </>
  );
}
