export function Card({ className = "", children, ...props }) {
    return (
        <div
            className={`bg-ag-card rounded-ag shadow-ag p-6 md:p-8 transition-transform duration-200 ease-ag hover:shadow-ag-soft ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
