"use client";

import { Zap, Clock, ShieldCheck, Heart } from "lucide-react";

export default function WhyChoose() {
    const features = [
        {
            icon: Zap,
            title: "Instant Delivery",
            desc: "Hel gaming credits-kaaga ilbiriqsiyo gudahood, ma jiro wax sugeysid mar dambe.",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            borderColor: "border-blue-100"
        },
        {
            icon: Clock,
            title: "24/7 Support",
            desc: "Kooxdayada caawinaada waxay diyaar kuu yihiin 24/7 si ay kaaga caawiyaan wax kasta.",
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            borderColor: "border-indigo-100"
        },
        {
            icon: Heart,
            title: "Trusted Platform",
            desc: "Ku biir kumanaan macaamiil ah oo maalin kasta nagu aaminay dalabaadkooda.",
            color: "text-rose-500",
            bg: "bg-rose-500/10",
            borderColor: "border-rose-100"
        },
        {
            icon: ShieldCheck,
            title: "Secure Payment",
            desc: "Lacag bixintaadu waa 100% ammaan, annaga oo isticmaalayna nidaamka ugu casrisan.",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            borderColor: "border-emerald-100"
        }
    ];

    return (
        <section className="py-20 px-5 bg-transparent relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-[#1a2b4b] tracking-tighter uppercase leading-none mb-4">Why Choose Biriq?</h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">Experience the future of gaming top-up</p>
                    <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <div 
                                key={i} 
                                className={`bg-white rounded-[25px] p-8 border ${f.borderColor} hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center text-center`}
                            >
                                <div className={`w-16 h-16 ${f.bg} ${f.color} rounded-[20px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                                    <Icon size={30} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-lg font-black text-[#1a2b4b] mb-3 uppercase tracking-tight">{f.title}</h3>
                                <p className="text-slate-500 text-xs font-bold leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
