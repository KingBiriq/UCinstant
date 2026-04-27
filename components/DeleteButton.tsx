"use client";

export default function DeleteButton({ url, children, className }: { url: string, children?: React.ReactNode, className?: string }) {
    async function removeItem() {
        if (!confirm("Ma hubtaa inaad tirtirayso?")) return;

        const res = await fetch(url, { method: "DELETE" });
        const data = await res.json();

        if (!data.success) {
            alert(data.message || "Delete failed");
            return;
        }

        window.location.reload();
    }

    return (
        <button onClick={removeItem} className={className || "rounded-xl bg-red-500 px-3 py-2 font-bold text-white"}>
            {children || "Delete"}
        </button>
    );
}