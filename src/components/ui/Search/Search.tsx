import { SearchIcon } from "../../Icons/SearchIcon";
import "./Search.css";

export function Search({
    type = "text",
    placeholder = "",
    required = false,
    width = "100%",
    onChange,
}) {
    return (
        <div className="search">
            <SearchIcon size={16} color="#9CA3AF" className="search-icon" />

            <input
                type={type}
                placeholder={placeholder}
                required={required}
                style={{ width }}
                className="search-input"
                onChange={(e) => onChange && onChange(e.target.value)}
            />
        </div>
    );
}

