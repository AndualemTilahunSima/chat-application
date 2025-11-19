import { useState, useEffect, type ChangeEvent } from "react";
import "./TextInput.css";

type TextInputProps = {
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  width?: string | number;
  className?: string;
  name?: string;
  autoComplete?: string;
  id?: string;
};

export function TextInput({
  type = "text",
  placeholder = "",
  defaultValue = "",
  required = false,
  disabled = false,
  value,
  onChange,
  width = "100%",
  className = "",
  name,
  autoComplete,
  id,
}: TextInputProps) {
  const [internalValue, setInternalValue] = useState<string>(
    value ?? defaultValue ?? ""
  );

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInternalValue(event.target.value);
    onChange?.(event);
  };

  return (
    <input
      className={`text-input ${className}`.trim()}
      type={type}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      value={internalValue}
      onChange={handleChange}
      style={{ width }}
      name={name}
      autoComplete={autoComplete}
      id={id}
    />
  );
}
