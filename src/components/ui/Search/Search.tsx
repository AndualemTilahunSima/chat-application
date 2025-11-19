import { type ChangeEvent } from "react";
import { SearchIcon } from "../../Icons/SearchIcon";
import "./Search.css";

type SearchProps = {
    type?: string;
    placeholder?: string;
    required?: boolean;
    width?: string | number;
    value?: string;
    onChange?: (value: string) => void;
};

export function Search({
    type = "text",
    placeholder = "",
    required = false,
    width = "100%",
    value,
    onChange,
}: SearchProps) {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.value);
    };

    return (
        <div className="search">
            <SearchIcon size={16} color="#9CA3AF" className="search-icon" />

            <input
                type={type}
                placeholder={placeholder}
                required={required}
                style={{ width }}
                className="search-input"
                value={value ?? ""}
                onChange={handleChange}
                aria-label="Search conversations"
                autoComplete="off"
            />
        </div>
    );
}