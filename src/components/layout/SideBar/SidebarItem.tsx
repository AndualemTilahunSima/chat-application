import type { ReactNode } from "react";

type SidebarItemProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
};

export default function SidebarItem({
  icon,
  label,
  active = false,
  collapsed = false,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      className={`sidebar-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="icon-wrapper">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
