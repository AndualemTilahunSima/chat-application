import "./Select.css";

export function Select() {
    return (
        <div className="select-wrapper">
            <select className="select">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
            </select>
        </div>
    );
}
