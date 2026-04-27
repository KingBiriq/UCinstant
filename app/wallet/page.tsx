"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export default function WalletPage() {
    const [profile, setProfile] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        async function load() {
            const s = supabaseBrowser();
            const { data: userData } = await s.auth.getUser();
            const userId = userData.user?.id;

            if (!userId) return;

            const { data: profileData } = await s
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            const { data: tx } = await s
                .from("cashback_transactions")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            setProfile(profileData);
            setTransactions(tx || []);
        }

        load();
    }, []);

    return (
        <main className="mx-auto max-w-5xl px-4 py-10">
            <h1 className="text-4xl font-black">My Wallet</h1>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="glass rounded-3xl p-6">
                    <p className="text-white/50">Cashback Balance</p>
                    <h2 className="mt-2 text-4xl font-black text-biriq-gold">
                        ${Number(profile?.cashback_balance || 0).toFixed(2)}
                    </h2>
                </div>

                <div className="glass rounded-3xl p-6">
                    <p className="text-white/50">Points Balance</p>
                    <h2 className="mt-2 text-4xl font-black text-biriq-gold">
                        {Number(profile?.points_balance || 0).toFixed(0)} pts
                    </h2>
                </div>
            </div>

            <div className="mt-8 flex gap-3">
                <a href="/rewards" className="btn">Use Cashback</a>
                <a href="/wallet/withdraw" className="btn-dark">Withdraw Request</a>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-white/5 text-white/60">
                        <tr>
                            <th className="p-4 text-left">Type</th>
                            <th className="text-left">Amount</th>
                            <th className="text-left">Points</th>
                            <th className="text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t) => (
                            <tr key={t.id} className="border-t border-white/10">
                                <td className="p-4">{t.type}</td>
                                <td>${Number(t.amount || 0).toFixed(2)}</td>
                                <td>{Number(t.points || 0).toFixed(0)}</td>
                                <td>{t.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}