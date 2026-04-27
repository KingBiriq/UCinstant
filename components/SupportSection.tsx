"use client";

import { MessageCircle, Mail, ArrowRight } from "lucide-react";

export default function SupportSection() {
    return (
        <section className="pt-20 pb-0 px-5 bg-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-black text-[#1a2b4b] uppercase tracking-tight">Ma u baahantahay caawinaad?</h2>
                    <p className="text-slate-400 text-xs font-black mt-2 uppercase tracking-[0.2em]">Waxaan diyaar kuu nahay 24/7 si aan kuu caawino</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* WhatsApp Support Card */}
                    <a 
                        href="https://wa.me/252616010749" 
                        target="_blank"
                        className="group relative bg-[#f4f7fa] rounded-[12px] p-8 md:p-10 overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 border border-slate-100"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                        
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <div className="w-14 h-14 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6 group-hover:scale-110 transition-transform">
                                    <MessageCircle size={28} />
                                </div>
                                <h3 className="text-xl font-black text-[#1a2b4b] mb-2 uppercase tracking-tight">WhatsApp Support</h3>
                                <p className="text-slate-500 text-sm font-bold leading-relaxed max-w-[260px]">
                                    Nala soo xiriir WhatsApp si aad u hesho caawinaad degdeg ah oo ku saabsan dalabkaaga.
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm group-hover:translate-x-2 transition-transform">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </a>

                    {/* Email Support Card */}
                    <a 
                        href="mailto:Info@biriqstore.com"
                        className="group relative bg-[#f4f7fa] rounded-[12px] p-8 md:p-10 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 border border-slate-100"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                        
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <div className="w-14 h-14 rounded-lg bg-[#1a2b4b] text-white flex items-center justify-center shadow-lg shadow-blue-900/20 mb-6 group-hover:scale-110 transition-transform">
                                    <Mail size={28} />
                                </div>
                                <h3 className="text-xl font-black text-[#1a2b4b] mb-2 uppercase tracking-tight">Email Support</h3>
                                <p className="text-slate-500 text-sm font-bold leading-relaxed max-w-[260px]">
                                    Haddii aad qabto su'aalo ama faallo, noogu soo dir fariin email ah mar kasta.
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1a2b4b] shadow-sm group-hover:translate-x-2 transition-transform">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
}
