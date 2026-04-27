"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingSupport() {
    return (
        <a 
            href="https://wa.me/252616010749" 
            target="_blank" 
            rel="noopener noreferrer"
            className="fixed bottom-8 right-6 z-[999] group flex items-center gap-3"
        >
            {/* Floating Circle */}
            <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-900/40 hover:scale-110 active:scale-95 transition-all duration-300 relative">
                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
                <MessageCircle size={32} />
            </div>
        </a>
    );
}
