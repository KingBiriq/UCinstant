"use client";

export default function ClientAlertButton({ children, message, className }: { children: React.ReactNode, message: string, className?: string }) {
    return (
        <button onClick={() => alert(message)} className={className}>
            {children}
        </button>
    );
}
