"use client";

import { ShoppingBag, UserCheck, Zap, ArrowRight, PlayCircle } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            id: "01",
            title: "Choose Your Game",
            desc: "Browse our extensive collection of popular games and select your desired credits or top-up amount.",
            icon: <ShoppingBag size={24} />,
            color: "bg-blue-600",
            shadow: "shadow-blue-600/20"
        },
        {
            id: "02",
            title: "Enter Player ID",
            desc: "Provide your in-game Player ID or account details. Our system securely links your selection to your account.",
            icon: <UserCheck size={24} />,
            color: "bg-orange-500",
            shadow: "shadow-orange-500/20"
        },
        {
            id: "03",
            title: "Instant Delivery",
            desc: "Complete your secure payment and watch your credits appear in your account within minutes.",
            icon: <Zap size={24} />,
            color: "bg-pink-600",
            shadow: "shadow-pink-600/20"
        }
    ];

    return (
        <section className="py-24 px-5 bg-transparent relative overflow-hidden">
            {/* Background Glow behind Title */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-gradient-to-r from-blue-100/10 via-white to-purple-100/10 blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 animate-[fadeIn_0.8s_ease-out]">
                    <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-orange-100 shadow-sm">
                        <PlayCircle size={14} />
                        <span>Process Overview</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-[#1a2b4b] mb-4 tracking-tight">
                        How <span className="text-purple-600">Biriq Store</span> Works
                    </h2>
                    <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
                        Experience the fastest and most secure way to top up your favorite games in just three simple steps.
                    </p>
                </div>

                {/* Steps Grid / Stack */}
                <div className="relative mt-10">
                    {/* Connection Line (Desktop Only) */}
                    <div className="hidden md:block absolute top-[110px] left-[15%] right-[15%] h-[2px] bg-slate-100 z-0 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-1/2 animate-[flow_3s_linear_infinite]" />
                    </div>

                    {/* Stacked on Mobile, Grid on Desktop */}
                    <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8">
                        {steps.map((step, idx) => (
                            <div 
                                key={step.id} 
                                className="group relative bg-white rounded-[12px] p-6 md:p-10 shadow-[0_10px_50px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-2xl hover:shadow-blue-600/10 hover:-translate-y-2 md:hover:-translate-y-4 transition-all duration-500 z-10"
                            >
                                <div className="flex flex-row md:flex-col items-center md:text-center gap-5 md:gap-0">
                                    {/* Icon Container */}
                                    <div className={`w-14 h-14 md:w-16 md:h-16 ${step.color} rounded-2xl flex items-center justify-center text-white shadow-xl ${step.shadow} md:mb-8 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                        {step.icon}
                                    </div>

                                    <div className="space-y-1 md:space-y-4">
                                        <span className="text-[9px] md:text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">Step {step.id}</span>
                                        <h3 className="text-base md:text-xl font-black text-[#1a2b4b] uppercase tracking-tight">{step.title}</h3>
                                        <p className="text-slate-400 text-[10px] md:text-sm font-medium leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Button */}
                <div className="mt-20 text-center">
                    <a 
                        href="#"
                        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="bg-[#1a2b4b] text-white px-10 py-4 rounded-full font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/40 hover:scale-110 active:scale-95 transition-all inline-flex items-center gap-3 mx-auto group border-4 border-white"
                    >
                        <span>Start Topping Up Now</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes flow {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
            `}</style>
        </section>
    );
}
