"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import Link from "next/link";
import { Wallet, ShoppingCart, ArrowUpRight, History, ArrowLeft, ChevronRight, Info } from "lucide-react";

export default function CashbackHub() {
    const [profile, setProfile] = useState<any>(null);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const s = supabaseBrowser();
            const { data: userData } = await s.auth.getUser();
            const userId = userData.user?.id;

            if (!userId) return;

            // Fetch Profile for Balance
            const { data: profileData } = await s
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            // Fetch Recent Activity (Cashback History)
            const { data: historyData } = await s
                .from("cashback_history")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
                .limit(5);

            setProfile(profileData);
            setRecentActivity(historyData || []);
            setLoading(false);
        }

        load();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f7fa] flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f4f7fa] pb-24">
            {/* ── HEADER ── */}
            <div className="bg-white px-5 pt-10 pb-8 rounded-b-[3rem] shadow-sm border-b border-slate-100 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 blur-3xl opacity-50" />
                
                <Link href="/wallet" className="inline-flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-6 hover:text-[#1a2b4b] transition-colors">
                    <ArrowLeft size={14} /> Back to Wallet
                </Link>

                <h1 className="text-3xl font-black text-[#1a2b4b] mb-1">Cashback</h1>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Manage your earnings</p>
            </div>

            <div className="max-w-md mx-auto px-5 -mt-6">
                {/* ── BALANCE CARD ── */}
                <div className="bg-[#1a2b4b] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-900/30">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                            <Wallet size={28} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200/60 mb-2">Available Balance</span>
                        <div className="text-5xl font-black mb-6 tracking-tight">${Number(profile?.cashback_balance || 0).toFixed(2)}</div>
                        
                        <div className="w-full bg-white/5 rounded-2xl p-4 flex justify-between items-center backdrop-blur-sm border border-white/10">
                            <div className="text-center flex-1 border-r border-white/10">
                                <div className="text-[8px] font-black text-blue-200/50 uppercase tracking-widest">Total Earned</div>
                                <div className="text-sm font-black">${Number(profile?.total_cashback_earned || 0).toFixed(2)}</div>
                            </div>
                            <div className="text-center flex-1">
                                <div className="text-[8px] font-black text-blue-200/50 uppercase tracking-widest">Total Used</div>
                                <div className="text-sm font-black">${Number(profile?.total_cashback_used || 0).toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── ACTION BUTTONS ── */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <Link href="/rewards" className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-all active:scale-95">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                            <ShoppingCart size={24} />
                        </div>
                        <span className="text-xs font-black text-[#1a2b4b] uppercase tracking-widest">Buy UC</span>
                    </Link>

                    <Link href="/cashback/withdraw" className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-all active:scale-95">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                            <ArrowUpRight size={24} />
                        </div>
                        <span className="text-xs font-black text-[#1a2b4b] uppercase tracking-widest">Withdraw</span>
                    </Link>
                </div>

                {/* ── HISTORY SECTION ── */}
                <div className="mt-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-sm font-black text-[#1a2b4b] uppercase tracking-widest flex items-center gap-2">
                            <History size={16} /> Recent Activity
                        </h3>
                        <Link href="/cashback/history" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline">View All</Link>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((h) => (
                                <div key={h.id} className="p-5 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${h.amount > 0 ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}>
                                            {h.amount > 0 ? <ArrowUpRight size={18} /> : <ShoppingCart size={18} />}
                                        </div>
                                        <div>
                                            <div className="text-xs font-black text-[#1a2b4b]">{h.description || "Cashback Reward"}</div>
                                            <div className="text-[10px] text-slate-400 font-bold">{new Date(h.created_at).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className={`text-sm font-black ${h.amount > 0 ? "text-emerald-500" : "text-[#1a2b4b]"}`}>
                                        {h.amount > 0 ? "+" : ""}${Math.abs(h.amount).toFixed(2)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center text-slate-400 text-xs font-bold italic uppercase tracking-widest">
                                No activity yet
                            </div>
                        )}
                    </div>
                </div>

                {/* ── INFO BANNER ── */}
                <div className="mt-8 bg-orange-50 rounded-3xl p-5 border border-orange-100 flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                        <Info size={20} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-[#1a2b4b] uppercase tracking-widest mb-1">Fee & Limits</h4>
                        <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                            Minimum withdrawal is $1.00. Cashback is awarded for every successful order.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
