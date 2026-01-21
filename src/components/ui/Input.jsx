export function Input({ className = "", ...props }) {
    return (
        <input
            className={`
        w-full rounded-xl border border-ag-border bg-white px-3.5 py-2.5 text-sm
        text-ag-text placeholder:text-ag-textMuted/70
        focus:outline-none focus:ring-2 focus:ring-ag-primary focus:border-transparent
        transition duration-150 ease-ag
        ${className}
      `}
            {...props}
        />
    );
}
