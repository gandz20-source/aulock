export function Button({
    children,
    variant = "primary",
    className = "",
    ...props
}) {
    const base =
        "inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl transition-transform duration-200 ease-ag focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ag-primary disabled:opacity-60 disabled:cursor-not-allowed";

    const variants = {
        primary:
            "bg-ag-primary text-white shadow-ag hover:-translate-y-0.5 hover:shadow-ag-soft",
        secondary:
            "bg-white text-ag-primary border border-ag-primary hover:bg-ag-primarySoft shadow-ag-soft",
        ghost: "bg-transparent text-ag-text hover:bg-ag-primarySoft",
    };

    return (
        <button
            className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
