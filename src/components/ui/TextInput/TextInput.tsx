import { useState, useEffect } from "react";
import "./TextInput.css";

export function TextInput({
  type = "text",
  placeholder = "",
  defaultValue = "",
  required = false,
  disabled = false,
  value,
  onChange,
  width = "100%",
}) {
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);

  // Sync internal state when parent updates value
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleChange = (e) => {
    setInternalValue(e.target.value);
    onChange?.(e); // only call if provided
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      value={internalValue}
      onChange={handleChange}
      style={{ width }}
    />
  );
}
