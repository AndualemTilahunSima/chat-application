import ChatBubble from "./ChatBubble";
import "./Chat.css"
import {ChatList,chatThreads} from "./ChatMessages";
import { useContext } from "react";
import { ChatContext } from "../ChatContext/ChatContext";
import { TextInput } from "../../components/ui/TextInput/TextInput";

export default function ChatWindow() {
  const { selectedThreadId } = useContext(ChatContext);
console.log(selectedThreadId);
  return (
    <div className="chat-panel">
      <div className="chat-header">
        <img
          className="avatar"
          src={chatThreads[selectedThreadId-1].avatar}
        />
        <div>
          <div className="chat-name">{chatThreads[selectedThreadId-1].name}</div>
          <div className="chat-status">online</div>
        </div>
        <div className="chat-menu">⋮</div>
      </div>

      <div className="chat-messages">
        {ChatList[selectedThreadId||1].map((m, i) => (
          <ChatBubble key={i} {...m} />
        ))}
      </div>

      <div className="chat-input">
        <div></div>
        <div>attac</div>
        <TextInput type="text" placeholder="Type a message..."></TextInput>
      </div>
    </div>
  );
}
