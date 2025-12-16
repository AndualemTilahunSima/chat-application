import { useState } from "react";
import { ChevronLeftIcon } from "../../../components/Icons/ChevronLeftIcon";
import { LogoutIcon } from "../../../components/Icons/LogoutIcon";
import { MessageCircleIcon } from "../../../components/Icons/MessageCircleIcon";
import { SettingsIcon } from "../../../components/Icons/SettingsIcon";
import SidebarItem from "./SidebarItem";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logout, logoutUser, selectAuthProfile } from "../../../store/slices/authSlice";
import { clearMessage } from "../../../store/slices/chatMessageSlice";
import { clearChatThreads } from "../../../store/slices/chatThreadSlice";
import { webSocketService } from "../../../services/websocket.service";


export type SidebarOption = "Chats" | "Settings";

type SidebarProps = {
  onSelect: (option: SidebarOption) => void;
};

export default function Sidebar({ onSelect }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState<SidebarOption>("Chats");

  function handleSelect(item: SidebarOption) {
    setActiveItem(item);
    onSelect(item);
  }

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectAuthProfile);

  async function handleLogout() {
    await logoutUser(profile?.token);
    webSocketService.disconnect();
    dispatch(logout());
    dispatch(clearMessage());
    dispatch(clearChatThreads());
    navigate("/login");
  }

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!collapsed && <label className="sidebar-title">ChatApp</label>}

        <div className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <ChevronLeftIcon
            size={20}
            className={`chevron ${collapsed ? "rotate" : ""}`}
          />
        </div>
      </div>

      <div className="sidebar-menu">
        <SidebarItem
          icon={<MessageCircleIcon size={15} />}
          label="Chats"
          active={activeItem === "Chats"}
          collapsed={collapsed}
          onClick={() => handleSelect("Chats")}
        />

        <SidebarItem
          icon={<SettingsIcon size={15} />}
          label="Settings"
          active={activeItem === "Settings"}
          collapsed={collapsed}
          onClick={() => handleSelect("Settings")}
        />
      </div>

      <div className="sidebar-footer">
        <button className="logout" onClick={handleLogout}>
          <LogoutIcon size={18} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}


