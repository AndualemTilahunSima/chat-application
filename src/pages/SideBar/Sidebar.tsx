import { useState } from "react";
import { ChevronLeftIcon } from "../../components/Icons/ChevronLeftIcon";
import { LogoutIcon } from "../../components/Icons/LogoutIcon";
import { MessageCircleIcon } from "../../components/Icons/MessageCircleIcon";
import { SettingsIcon } from "../../components/Icons/SettingsIcon";
import SidebarItem from "./SidebarItem";
import "./Sidebar.css";

export default function Sidebar({ onSelect }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("Chats");

  function handleSelect(item) {
    setActiveItem(item);
    onSelect(item); // 🔥 notify parent
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
        <div className="logout">
          <LogoutIcon size={18} />
          {!collapsed && "Logout"}
        </div>
      </div>
    </div>
  );
}
