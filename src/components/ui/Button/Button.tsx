import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import "./Button.css";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({
    children,
    type = "button",
    className = "",
    ...rest
}: ButtonProps) {
    return (
        <button
            className={`app-button ${className}`.trim()}
            type={type}
            {...rest}
        >
            {children}
        </button>
    );
}