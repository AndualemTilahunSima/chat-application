export default function SidebarItem({ icon, label, active, collapsed, onClick }) {
  return (
    <button
      className={`sidebar-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="icon-wrapper">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </button>
  );
}
