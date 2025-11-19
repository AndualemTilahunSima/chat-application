import { type ChangeEvent } from "react";
import "./ChatInput.css";
import { SearchIcon } from "../../Icons/SearchIcon";

type ChatInputProps = {
    placeholder?: string;
    required?: boolean;
    width?: string | number;
    onChange?: (value: string) => void;
};

export function ChatInput({
    placeholder = "",
    required = false,
    width = "100%",
    onChange,
}: ChatInputProps) {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.value);
    };

    return (
        <div className="search">
            <SearchIcon size={16} color="#9CA3AF" className="search-icon" />

            <input
                type="text"
                placeholder={placeholder}
                required={required}
                style={{ width }}
                className="search-input"
                onChange={handleChange}
            />
        </div>
    );
}
