import "./CircleWrapper.css";

export function CircleWrapper({
    width = "2rem",
    height = "2rem",
    children,
    backgroundColor = "#00bba7"
}) {
    return (
        <div
            className="circle-wrapper"
            style={{
                width,
                height,
                backgroundColor
            }}
        >
            {children}
        </div>
    );
}
