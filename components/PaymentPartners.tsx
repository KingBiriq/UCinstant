"use client";

import { useEffect, useState } from "react";
import { ChevronRight, CreditCard } from "lucide-react";

export default function PaymentPartners({ partners }: { partners: any[] }) {
    const [showAll, setShowAll] = useState(false);
    
    if (!partners || partners.length === 0) return null;

    // We double the array to create a seamless infinite scroll effect
    const doubledPartners = [...partners, ...partners, ...partners, ...partners];

    return (
        <section className="mt-16 mb-24 px-4 relative">
            <div className="max-w-7xl mx-auto bg-white rounded-[12px] h-[150px] md:h-[180px] pt-5 pb-8 px-5 md:px-10 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between group">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-40 group-hover:opacity-60 transition-opacity" />
                
                {/* Header Row */}
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#1a2b4b] flex items-center justify-center shadow-lg shadow-blue-900/20">
                            <CreditCard size={14} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-[10px] md:text-base font-black text-[#1a2b4b] uppercase tracking-tight">Payment Partners</h2>
                            <p className="hidden md:block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Secure & Fast Transactions</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setShowAll(true)}
                        className="flex items-center gap-2 text-blue-600 font-black text-[10px] md:text-[11px] uppercase tracking-widest bg-blue-50 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-blue-100/50 hover:bg-blue-600 hover:text-white transition-all cursor-pointer active:scale-95"
                    >
                        <span className="hidden sm:inline">Active:</span> <span>{partners.length} Partners</span>
                        <ChevronRight size={14} />
                    </button>
                </div>

                {/* Marquee Container */}
                <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-10" />

                    <div className="overflow-hidden w-full">
                        <div className="flex gap-4 md:gap-8 animate-[scroll_25s_linear_infinite] whitespace-nowrap">
                            {doubledPartners.map((p, i) => (
                                <div 
                                    key={`${p.id}-${i}`} 
                                    className="w-28 h-14 md:w-40 md:h-20 bg-white rounded-[12px] shadow-sm border border-slate-50 p-2.5 flex items-center justify-center shrink-0 hover:shadow-xl hover:shadow-blue-600/5 transition-all duration-500 group relative"
                                >
                                    <img 
                                        src={p.image} 
                                        alt={p.name} 
                                        className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── ALL PARTNERS MODAL ── */}
            {showAll && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-10">
                    <div className="absolute inset-0 bg-[#1a2b4b]/60 backdrop-blur-sm" onClick={() => setShowAll(false)} />
                    
                    <div className="bg-white w-full max-w-2xl rounded-[12px] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[80vh] animate-[slideUp_0.3s_ease-out]">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                            <div>
                                <h2 className="text-xl font-black text-[#1a2b4b] uppercase tracking-tight">Our Partners</h2>
                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Total {partners.length} Channels</p>
                            </div>
                            <button 
                                onClick={() => setShowAll(false)}
                                className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-[#1a2b4b] transition-all"
                            >
                                <ChevronRight className="rotate-90" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {partners.map((p) => (
                                    <div key={p.id} className="bg-[#f4f7fa] rounded-[12px] p-6 flex flex-col items-center justify-center gap-3 border border-slate-100 hover:border-blue-200 transition-all group">
                                        <div className="w-full aspect-[2/1] relative">
                                            <img 
                                                src={p.image} 
                                                alt={p.name} 
                                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-[#1a2b4b] uppercase tracking-widest opacity-60">{p.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure & Fast Topup Experience</p>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    );
}
