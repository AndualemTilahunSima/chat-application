export function LogoutIcon({ size = 24, color = "currentColor", className = "", ...props }) {
    return (<svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width={size}
        height={size}
        className={className}
        {...props}
    >
        <path d="m16 17 5-5-5-5"></path>
        <path d="M21 12H9"></path>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    </svg>
    )
};
