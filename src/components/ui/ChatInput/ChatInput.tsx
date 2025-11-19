import "./ChatInput.css";

export function ChatInput({
    placeholder = "",
    required = false,
    width = "100%",
    onChange,
}) {
    return (
        <div className="search">
            <SearchIcon size={16} color="#9CA3AF" className="search-icon" />

            <input
                type="text"
                placeholder={placeholder}
                required={required}
                style={{ width }}
                className="search-input"
                onChange={(e) => onChange && onChange(e.target.value)}
            />
        </div>
    );
}

