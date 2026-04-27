"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    ArrowLeft, Edit3, ShoppingBag, Shield, 
    LogOut, XCircle, RefreshCw, Mail, Phone, CheckCircle2,
    Wallet, Gift
} from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const s = supabaseBrowser();
            const { data: userData } = await s.auth.getUser();
            const userId = userData.user?.id;

            if (userId) {
                const { data: profileData } = await s
                    .from("profiles")
                    .select("*")
                    .eq("id", userId)
                    .single();

                setProfile(profileData);
            }
            setLoading(false);
        }

        load();
    }, []);

    return (
        <main className="min-h-screen bg-[#f4f7fb] pt-8 pb-32">
            <div className="max-w-2xl mx-auto px-6">
                
                {/* ── TOP ACTIONS ── */}
                <div className="flex items-center justify-between mb-8">
                    <button 
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-500 shadow-sm border border-gray-100 hover:bg-gray-50 transition"
                    >
                        <ArrowLeft size={14} /> Home
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold text-[#1a2b4b] hover:text-blue-600 transition">
                        <Edit3 size={14} /> Edit Profile
                    </button>
                </div>

                {/* ── PROFILE CARD ── */}
                <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left border border-white">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-[1.5rem] p-1 bg-gradient-to-tr from-gray-100 to-gray-200 shadow-inner">
                            <img 
                                src={`https://ui-avatars.com/api/?name=${profile?.name || "User"}&background=000&color=fff&size=200`}
                                alt="Avatar" 
                                className="w-full h-full rounded-2xl object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white"></div>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                        <h1 className="text-2xl font-black text-[#1a2b4b]">{profile?.name || "User"}</h1>
                        
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg text-[11px] font-bold text-gray-500 border border-gray-100">
                                <Mail size={12} /> {profile?.email || "No Email"}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg text-[11px] font-bold text-gray-500 border border-gray-100">
                                <Phone size={12} /> {profile?.phone || "No Phone"}
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black tracking-widest uppercase border border-blue-100 mt-2">
                            <CheckCircle2 size={12} /> Member Account
                        </div>
                    </div>
                </div>

                {/* ── CASHBACK & POINTS ── */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 bg-green-50 text-green-500 rounded-xl flex items-center justify-center mb-3">
                            <Wallet size={18} />
                        </div>
                        <p className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Cashback</p>
                        <h2 className="text-2xl font-black text-[#1a2b4b] mt-1">
                            ${Number(profile?.cashback_balance || 0).toFixed(2)}
                        </h2>
                        <Link href="/wallet" className="mt-3 px-4 py-1.5 bg-gray-50 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full text-[10px] font-black tracking-widest uppercase transition">
                            View Wallet
                        </Link>
                    </div>

                    <div className="bg-white rounded-[2rem] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center mb-3">
                            <Gift size={18} />
                        </div>
                        <p className="text-[11px] font-black uppercase text-gray-400 tracking-widest">Points</p>
                        <h2 className="text-2xl font-black text-[#1a2b4b] mt-1">
                            {Number(profile?.points_balance || 0).toFixed(0)} pts
                        </h2>
                        <Link href="/rewards" className="mt-3 px-4 py-1.5 bg-gray-50 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full text-[10px] font-black tracking-widest uppercase transition">
                            Use Points
                        </Link>
                    </div>
                </div>

                {/* ── MENU LIST ── */}
                <div className="bg-white rounded-[2rem] p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 space-y-1">
                    
                    {/* Payment Channels */}
                    <Link href="/profile/payments" className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition group">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Wallet size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-[#1a2b4b] text-[15px]">Payment Channels</h3>
                            <p className="text-xs font-semibold text-gray-400 mt-0.5">Manage your saved phone numbers</p>
                        </div>
                        <ArrowLeft size={16} className="text-gray-300 rotate-180" />
                    </Link>

                    {/* Your Orders */}
                    <Link href="/orders" className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition group">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                            <ShoppingBag size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-[#1a2b4b] text-[15px]">Your Orders</h3>
                            <p className="text-xs font-semibold text-gray-400 mt-0.5">View order history & receipts</p>
                        </div>
                        <ArrowLeft size={16} className="text-gray-300 rotate-180" />
                    </Link>

                    {/* Privacy Policy */}
                    <Link href="#" className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition group">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Shield size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-[#1a2b4b] text-[15px]">Privacy Policy</h3>
                            <p className="text-xs font-semibold text-gray-400 mt-0.5">Review our data rules</p>
                        </div>
                        <ArrowLeft size={16} className="text-gray-300 rotate-180" />
                    </Link>

                    {/* Sign Out */}
                    <button className="w-full flex items-center gap-4 p-4 hover:bg-orange-50 rounded-2xl transition group text-left">
                        <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                            <LogOut size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-[#1a2b4b] text-[15px]">Sign Out</h3>
                            <p className="text-xs font-semibold text-gray-400 mt-0.5">Logout from your account</p>
                        </div>
                        <ArrowLeft size={16} className="text-gray-300 rotate-180" />
                    </button>

                    {/* Delete Account */}
                    <button className="w-full flex items-center gap-4 p-4 hover:bg-red-50 rounded-2xl transition group text-left">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                            <XCircle size={20} />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-red-500 text-[15px]">Delete Account</h3>
                            <p className="text-xs font-semibold text-gray-400 mt-0.5">Permanently remove all data</p>
                        </div>
                        <ArrowLeft size={16} className="text-gray-300 rotate-180" />
                    </button>

                </div>

                {/* ── REFRESH BUTTON ── */}
                <div className="flex justify-center">
                    <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-6 py-3 bg-white rounded-full text-[11px] font-black text-gray-500 uppercase tracking-widest shadow-sm border border-gray-100 hover:bg-gray-50 hover:text-[#1a2b4b] transition active:scale-95">
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Account Data
                    </button>
                </div>

            </div>
        </main>
    );
}