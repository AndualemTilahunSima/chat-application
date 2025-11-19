import { type ChangeEvent } from "react";
import "./Select.css";

type SelectOption = {
    label: string;
    value: string;
};

type SelectProps = {
    value: string;
    onChange: (value: string) => void;
    options?: SelectOption[];
    id?: string;
    name?: string;
};

const defaultOptions: SelectOption[] = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
];

export function Select({
    value,
    onChange,
    options = defaultOptions,
    id,
    name,
}: SelectProps) {
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className="select-wrapper">
            <select
                className="select"
                value={value}
                onChange={handleChange}
                id={id}
                name={name}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}