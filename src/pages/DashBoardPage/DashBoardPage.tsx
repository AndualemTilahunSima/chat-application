import ChatWindow from "../ChatWindow/ChatWindow";
import ChatThreadList from "../ChatThread/ChatThreadList";
import Sidebar from "../SideBar/Sidebar";

import "./DashBoardPage.css";
import Settings from "../Settings/Settings";
import { useState } from "react";
import { ChatProvider } from "../ChatContext/ChatContext";

export default function DashBoardPage() {
  const [option, setOption] = useState("Chats");

  return (
    <div className="chatapp-container">

      <Sidebar onSelect={setOption} />

      {option === "Chats" && (
        <>
          <ChatProvider>
            <ChatThreadList />
            <ChatWindow />
          </ChatProvider>
        </>
      )}

      {option === "Settings" && <Settings />}
    </div>
  );
}

