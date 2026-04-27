"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export default function WithdrawPage() {
    const [amount, setAmount] = useState("");
    const [phone, setPhone] = useState("");
    const [method, setMethod] = useState("EVC");

    async function requestWithdraw() {
        const s = supabaseBrowser();
        const { data } = await s.auth.getUser();
        const userId = data.user?.id;

        if (!userId) return alert("Login required");

        const res = await fetch("/api/wallet/withdraw", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, amount, phone, method }),
        });

        const result = await res.json();

        if (!result.success) {
            alert(result.message || "Withdraw failed");
            return;
        }

        alert("Withdrawal request sent!");
        window.location.href = "/wallet";
    }

    return (
        <main className="mx-auto max-w-md px-4 py-10">
            <h1 className="text-4xl font-black">Withdraw Cashback</h1>

            <div className="glass mt-8 space-y-4 rounded-3xl p-6">
                <input
                    className="input"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <input
                    className="input"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <select
                    className="input"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                >
                    <option value="EVC">EVC</option>
                    <option value="ZAAD">ZAAD</option>
                    <option value="SAHAL">SAHAL</option>
                    <option value="EDAHAB">eDahab</option>
                </select>

                <button onClick={requestWithdraw} className="btn w-full">
                    Submit Withdrawal
                </button>
            </div>
        </main>
    );
}