import "./Button.css";

export function Button({ children, type = "button", onClick }) {
    return (
        <button
            className="app-button"
            type={type}
            onClick={onClick}   // ← add this
        >
            {children}
        </button>
    );
}

