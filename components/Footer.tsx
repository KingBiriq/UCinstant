"use client";

import Link from "next/link";
import { Facebook, MessageCircle, Send, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#1a2b4b] text-white pt-16 pb-32 md:pb-16 px-5 mt-20 relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] pointer-events-none rounded-full" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-500 rounded-[12px] flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <span className="text-xl font-black italic">B</span>
                            </div>
                            <h2 className="text-2xl font-black tracking-tighter uppercase">Biriq Store</h2>
                        </div>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
                            Suuqa ugu weyn ee gaming-ka Soomaaliya. Waxaan kuu keenaa top-up degdeg ah, ammaan ah, oo qiimo jaban.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="w-10 h-10 bg-white/5 rounded-[12px] flex items-center justify-center hover:bg-blue-500 transition-all border border-white/10 group">
                                <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white/5 rounded-[12px] flex items-center justify-center hover:bg-blue-500 transition-all border border-white/10 group">
                                <Send size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                            <a href="https://wa.me/252616010749" className="w-10 h-10 bg-white/5 rounded-[12px] flex items-center justify-center hover:bg-blue-500 transition-all border border-white/10 group">
                                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-blue-400">Quick Links</h3>
                        <ul className="space-y-4 text-slate-400 text-sm font-bold">
                            <li><Link href="/" className="hover:text-white transition-colors flex items-center gap-2 uppercase tracking-wide">Home Page</Link></li>
                            <li><Link href="/profile" className="hover:text-white transition-colors flex items-center gap-2 uppercase tracking-wide">My Profile</Link></li>
                            <li><Link href="/wallet" className="hover:text-white transition-colors flex items-center gap-2 uppercase tracking-wide">Wallet Balance</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors flex items-center gap-2 uppercase tracking-wide">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Support Details */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-blue-400">Support Info</h3>
                        <ul className="space-y-4 text-slate-400 text-sm font-bold">
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                                    <Phone size={16} />
                                </div>
                                <span>+252 616 010 749</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                                    <Mail size={16} />
                                </div>
                                <span>Info@biriqstore.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                                    <MapPin size={16} />
                                </div>
                                <span>Wyoming, United States</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter/Trust */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-blue-400">Why Us?</h3>
                        <div className="bg-white/5 rounded-[15px] p-5 border border-white/10 space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">"The fastest and most reliable top-up service in the region."</p>
                            <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase">
                                <ShieldCheck size={14} /> 100% Secure Payments
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <div>© 2026 Biriq Store. All Rights Reserved.</div>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function ShieldCheck({ size, className }: { size?: number, className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size || 24} 
            height={size || 24} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
