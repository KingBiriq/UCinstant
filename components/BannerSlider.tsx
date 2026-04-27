"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function BannerSlider({ banners }: { banners: any[] }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrent(prev => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    if (!banners || banners.length === 0) {
        return (
            <div className="mb-8 rounded-2xl overflow-hidden relative aspect-[21/9] md:aspect-[21/6] bg-gradient-to-r from-blue-900 to-blue-600 shadow-xl">
                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end bg-gradient-to-t from-blue-900/90 to-transparent">
                    <h1 className="text-xl md:text-4xl font-black text-white leading-tight uppercase">
                        Invite Friends To Assist & Get Up To
                        <br className="hidden md:block"/> 20,000 Tokens!
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-8 rounded-2xl overflow-hidden relative aspect-[21/9] md:aspect-[21/6] shadow-xl group bg-gray-900">
            {banners.map((b, i) => {
                let link = "#";
                let subtitle = "";
                let bg_color = b.game_code || "linear-gradient(to right, #3b82f6, #8b5cf6)";
                try {
                    if (b.description?.startsWith("{")) {
                        const p = JSON.parse(b.description);
                        link = p.link || "#";
                        subtitle = p.subtitle || "";
                    }
                } catch(e) {}

                const Content = () => (
                    <div 
                        className={`absolute inset-0 transition-opacity duration-1000 bg-cover bg-center ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                        style={b.image ? { backgroundImage: `url(${b.image})` } : { background: bg_color }}
                    >
                        {/* Overlay only if image exists */}
                        {b.image && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />}
                        
                        <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                            <h1 className="text-xl md:text-4xl font-black text-white leading-tight uppercase drop-shadow-lg">
                                {b.name}
                            </h1>
                            {subtitle && <p className="text-white/90 mt-1 md:mt-2 text-xs md:text-sm font-bold drop-shadow-md">{subtitle}</p>}
                        </div>
                    </div>
                );

                return link !== "#" && link ? (
                    <a key={b.id} href={link} className={i === current ? "pointer-events-auto" : "pointer-events-none"}>
                        <Content />
                    </a>
                ) : (
                    <div key={b.id} className={i === current ? "pointer-events-auto" : "pointer-events-none"}>
                        <Content />
                    </div>
                );
            })}

            {/* Pagination Dots */}
            {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                    {banners.map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setCurrent(i)}
                            className={`h-1.5 md:h-2 rounded-full transition-all ${i === current ? 'bg-white w-6 md:w-8' : 'bg-white/50 w-1.5 md:w-2'}`} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
