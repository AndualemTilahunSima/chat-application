

import "./DashBoardPage.css";
import { useState } from "react";
import { ChatProvider } from "../../context/ChatContext/ChatContext";
import Sidebar, { type SidebarOption } from "../../components/layout/SideBar/Sidebar";
import ChatThreadList from "../../components/layout/ChatThread/ChatThreadList";
import ChatWindow from "../../components/layout/ChatWindow/ChatWindow";
import Settings from "../../components/layout/Settings/Settings";

export default function DashBoardPage() {
  const [option, setOption] = useState<SidebarOption>("Chats");

  return (
    <div className="chatapp-container">

      <Sidebar onSelect={setOption} />

      {option === "Chats" && (
        <>
            <ChatThreadList />
            <ChatWindow />
        </>
      )}

      {option === "Settings" && <Settings />}
    </div>
  );
}

