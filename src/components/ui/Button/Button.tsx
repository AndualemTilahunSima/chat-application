import { type MouseEvent, type ReactNode } from "react";
import "./Button.css";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
  disabled?: boolean;
};

export function Button({
  type = "button",
  className = "",
  onClick,
  children,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={`app-button ${className}`.trim()}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
