import type { ReactNode } from "react";
import "./CircleWrapper.css";

type CircleWrapperProps = {
    width?: string | number;
    height?: string | number;
    backgroundColor?: string;
    children?: ReactNode;
};

export function CircleWrapper({
    width = "2rem",
    height = "2rem",
    children,
    backgroundColor = "#00bba7",
}: CircleWrapperProps) {
    return (
        <div
            className="circle-wrapper"
            style={{
                width,
                height,
                backgroundColor,
            }}
        >
            {children}
        </div>
    );
}
