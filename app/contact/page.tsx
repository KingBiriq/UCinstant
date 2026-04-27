"use client";

import { MessageSquare, Phone, Mail, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#f4f7fa] pb-24 font-sans">
            {/* ── HEADER ── */}
            <div className="bg-white px-5 pt-12 pb-12 rounded-b-[30px] shadow-sm border-b border-slate-100 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
                
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6 hover:text-[#1a2b4b] transition-colors">
                    <ArrowLeft size={14} /> Back to Home
                </Link>

                <h1 className="text-3xl font-black text-[#1a2b4b] leading-tight">Contact Us</h1>
                <p className="text-slate-400 text-xs font-bold mt-2 tracking-tight">We're here to help. Reach out through any channel below.</p>
            </div>

            <div className="px-5 mt-10 max-w-2xl mx-auto space-y-4">
                
                {/* EMAIL */}
                <a href="mailto:Info@biriqstore.com" className="bg-white rounded-[15px] p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:border-blue-500/30 transition-all group">
                    <div className="w-14 h-14 rounded-[12px] bg-[#1a2b4b] text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/10 transition-all">
                        <Mail size={24} />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</h3>
                        <p className="text-sm font-black text-[#1a2b4b] mt-0.5">Info@biriqstore.com</p>
                    </div>
                </a>

                {/* PHONE */}
                <a href="tel:0616010749" className="bg-white rounded-[15px] p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:border-blue-500/30 transition-all group">
                    <div className="w-14 h-14 rounded-[12px] bg-[#1a2b4b] text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/10 transition-all">
                        <Phone size={24} />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</h3>
                        <p className="text-sm font-black text-[#1a2b4b] mt-0.5">0616010749</p>
                    </div>
                </a>

                {/* WHATSAPP */}
                <a href="https://wa.me/252616010749" target="_blank" className="bg-white rounded-[15px] p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:border-emerald-500/30 transition-all group">
                    <div className="w-14 h-14 rounded-[12px] bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/10 transition-all">
                        {/* WhatsApp Icon placeholder via Lucide MessageSquare */}
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</h3>
                        <p className="text-sm font-black text-[#1a2b4b] mt-0.5">Chat with us</p>
                    </div>
                </a>

                {/* LOCATION */}
                <div className="bg-white rounded-[15px] p-6 shadow-sm border border-slate-100 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-[12px] bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/10">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</h3>
                        <p className="text-sm font-black text-[#1a2b4b] mt-0.5">Wyoming, United States</p>
                    </div>
                </div>

                <div className="text-center pt-8">
                    <p className="text-slate-400 text-xs font-bold">Have a question? <span className="text-blue-600">Check our News & Updates</span></p>
                </div>
            </div>
        </main>
    );
}
