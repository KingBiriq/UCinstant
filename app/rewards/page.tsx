import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";

export default async function RewardsPage() {
    const s = supabaseAdmin();

    const { data } = await s
        .from("rewards_products")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

    return (
        <main className="mx-auto max-w-7xl px-4 py-10">
            <h1 className="text-4xl font-black">Cashback Market</h1>
            <p className="mt-2 text-white/50">Ku iibso cashback ama points.</p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {(data || []).map((p: any) => (
                    <div key={p.id} className="glass rounded-3xl p-5">
                        <div
                            className="h-40 rounded-2xl bg-cover bg-center"
                            style={{ backgroundImage: `url(${p.image || ""})` }}
                        />
                        <h2 className="mt-4 text-xl font-black">{p.title}</h2>
                        <p className="mt-2 text-sm text-white/50">{p.description}</p>
                        <div className="mt-4 flex justify-between">
                            <b>${Number(p.price_cashback || 0).toFixed(2)}</b>
                            <b>{Number(p.price_points || 0)} pts</b>
                        </div>
                        <Link href={`/rewards/${p.id}`} className="btn mt-5 block text-center">
                            Redeem
                        </Link>
                    </div>
                ))}
            </div>
        </main>
    );
}