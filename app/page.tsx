import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import BannerSlider from "@/components/BannerSlider";

export default async function Home() {
    const s = supabaseAdmin();

    const { data: items } = await s
        .from("categories")
        .select("*")
        .eq("active", true)
        .order("name");

    const isBanner = (c: any) => c.description?.includes('"is_banner":true') || c.type === 'banner';
    const categories = (items || []).filter((c: any) => !isBanner(c));
    const banners = (items || []).filter((c: any) => isBanner(c)).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

    return (
        <main className="mx-auto max-w-7xl px-4 py-8">

            {/* 🔥 Banners */}
            <BannerSlider banners={banners} />

            {/* 🎮 Categories */}
            <div className="flex items-center gap-3 mb-6 mt-8">
                <h2 className="text-lg md:text-2xl font-black text-slate-800 uppercase tracking-tight">ALL GAMES</h2>
                <div className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md shadow-blue-600/20">All Games</div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-5">
                {(categories || []).map((cat: any) => (
                    <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="flex flex-col items-center"
                    >
                        <div className="relative w-full aspect-square rounded-[1rem] md:rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-100 bg-white p-[5px]">
                            <div className="w-full h-full rounded-[0.8rem] md:rounded-[1.2rem] overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none" />
                                <img
                                    src={cat.image || "https://biriq.com/placeholder.png"}
                                    className="w-full h-full object-cover relative z-0"
                                    alt={cat.name}
                                />
                            </div>
                            
                            {/* EXTRA BONUS tag */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-pink-500 py-0.5 px-2 rounded-full shadow-lg z-20 whitespace-nowrap">
                                <span className="text-[7px] md:text-[9px] font-black text-white uppercase tracking-widest flex items-center justify-center gap-1">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5"><path d="M12 2c0 0-4 4-4 9s4 9 4 9 4-4 4-9-4-9-4-9zm0 13c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/></svg>
                                    EXTRA BONUS
                                </span>
                            </div>
                        </div>

                        <h3 className="mt-2.5 md:mt-3 text-[11px] md:text-sm font-black text-center text-slate-800 tracking-tight leading-tight px-1">
                            {cat.name}
                        </h3>
                    </Link>
                ))}
            </div>
        </main>
    );
}