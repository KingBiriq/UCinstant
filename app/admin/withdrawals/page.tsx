import { supabaseAdmin } from "@/lib/supabase";

export default async function AdminWithdrawalsPage() {
    const s = supabaseAdmin();

    const { data } = await s
        .from("withdrawal_requests")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <main className="mx-auto max-w-7xl px-4 py-10">
            <h1 className="text-4xl font-black">Withdrawal Requests</h1>

            <div className="mt-8 overflow-auto rounded-3xl border border-white/10">
                <table className="w-full min-w-[900px] text-sm">
                    <thead className="bg-white/5 text-white/60">
                        <tr>
                            <th className="p-4 text-left">Amount</th>
                            <th className="text-left">Phone</th>
                            <th className="text-left">Method</th>
                            <th className="text-left">Status</th>
                            <th className="text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data || []).map((w: any) => (
                            <tr key={w.id} className="border-t border-white/10">
                                <td className="p-4">${Number(w.amount).toFixed(2)}</td>
                                <td>{w.phone}</td>
                                <td>{w.method}</td>
                                <td>{w.status}</td>
                                <td>{new Date(w.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}