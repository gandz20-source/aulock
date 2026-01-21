export function Label({ className = "", children, ...props }) {
    return (
        <label
            className={`block text-xs font-medium uppercase tracking-wide text-ag-textMuted mb-1.5 ${className}`}
            {...props}
        >
            {children}
        </label>
    );
}
