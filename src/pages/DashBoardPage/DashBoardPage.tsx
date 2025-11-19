import ChatWindow from "../ChatWindow/ChatWindow";
import ChatThreadList from "../ChatThread/ChatThreadList";
import Sidebar from "../SideBar/Sidebar";

import "./DashBoardPage.css";
import Settings from "../Settings/Settings";
import { useState } from "react";

export default function DashBoardPage() {
  const [option, setOption] = useState("Chats");

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

