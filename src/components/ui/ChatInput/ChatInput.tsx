import { type ChangeEvent } from "react";
import "./ChatInput.css";
import { MicIcon } from "../../Icons/MicIcon";
import { VideoIcon } from "../../Icons/VideoIcon";

type ChatInputProps = {
    placeholder?: string;
    required?: boolean;
    width?: string | number;
    value?: string;
    onChange?: (value: string) => void;
};

export function ChatInput({
    placeholder = "",
    required = false,
    width = "100%",
    value,
    onChange,
}: ChatInputProps) {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.value);
    };

    return (
        <div className="chat-input-container">
            <input
                type="text"
                placeholder={placeholder}
                required={required}
                style={{ width }}
                className="chat-input"
                value={value ?? ""}
                onChange={handleChange}
            />
            <div className="chat-input-icon">
            <MicIcon size={20} />
            </div>
            <div className="chat-input-icon">
            <VideoIcon size={18} />
            </div>
        </div>
    );
}
