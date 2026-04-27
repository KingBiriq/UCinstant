"use client";

import { Users, Zap, Clock, ShieldCheck } from "lucide-react";

export default function TrustStats() {
    const stats = [
        { icon: Users, label: "Macaamiil", value: "10K+", color: "text-blue-500", bg: "bg-blue-50" },
        { icon: Zap, label: "Daqiiqado", value: "Instant", color: "text-amber-500", bg: "bg-amber-50" },
        { icon: Clock, label: "Support", value: "24/7", color: "text-indigo-500", bg: "bg-indigo-50" },
        { icon: ShieldCheck, label: "Aaminka", value: "100%", color: "text-emerald-500", bg: "bg-emerald-50" },
    ];

    return (
        <section className="py-16 px-5 bg-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div 
                                key={idx} 
                                className="bg-white rounded-[15px] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-[12px] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon size={24} strokeWidth={2.5} />
                                </div>
                                <div className="text-2xl font-black text-[#1a2b4b] tracking-tighter uppercase mb-1">{item.value}</div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
