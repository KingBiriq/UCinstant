"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function ImageUpload({
    value,
    onChange,
    label = "IMAGE (OPTIONAL)",
}: {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
}) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);

    async function upload(file: File) {
        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "biriqstore");

        try {
            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dtqftgnt3/image/upload",
                { method: "POST", body: formData }
            );

            const data = await res.json();
            setLoading(false);

            if (data.error) {
                alert("Cloudinary Error: " + data.error.message);
                return;
            }

            if (!data.secure_url) {
                alert("Upload failed. No URL returned.");
                return;
            }

            onChange(data.secure_url);
        } catch (error: any) {
            setLoading(false);
            alert("Upload failed: " + error.message);
        }
    }

    return (
        <div>
            <label className="mb-2 block text-xs font-black uppercase text-gray-400">
                {label}
            </label>

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex h-28 w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
            >
                {value ? (
                    <img src={value} className="h-full w-full rounded-xl object-cover" />
                ) : (
                    <>
                        <Upload size={20} />
                        <span className="mt-2 text-xs">
                            {loading ? "Uploading..." : "Click to upload image"}
                        </span>
                    </>
                )}
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) upload(file);
                }}
            />
        </div>
    );
}