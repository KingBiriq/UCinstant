import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import BannerSlider from "@/components/BannerSlider";
import HowItWorks from "@/components/HowItWorks";
import WhyChoose from "@/components/WhyChoose";
import PaymentPartners from "@/components/PaymentPartners";

export default async function Home() {
    const s = supabaseAdmin();

    const { data: items } = await s
        .from("categories")
        .select("*")
        .eq("active", true)
        .order("name");

    const isBanner = (c: any) => c.description?.includes('"is_banner":true') || c.type === 'banner';
    const isPartner = (c: any) => c.description?.includes('"is_partner":true') || c.type === 'partner';

    const categories = (items || []).filter((c: any) => !isBanner(c) && !isPartner(c));
    const banners = (items || []).filter((c: any) => isBanner(c)).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
    const partners = (items || []).filter((c: any) => isPartner(c));

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 bg-[#f4f7fa]">

            {/* 🔥 Banners */}
            <BannerSlider banners={banners} />

            {/* 🎮 Categories */}
            <div id="categories" className="flex items-center gap-3 mb-6 mt-10 px-1">
                <h2 className="text-lg md:text-2xl font-black text-[#1a2b4b] uppercase tracking-tight">ALL GAMES</h2>
                <div className="bg-blue-500 px-3 py-1 rounded-full text-[10px] font-black text-white shadow-lg shadow-blue-500/20 uppercase tracking-widest">Premium Selection</div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-6 px-1">
                {(categories || []).map((cat: any) => (
                    <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="flex flex-col items-center group"
                    >
                        <div className="relative w-full aspect-square rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-200 bg-white p-[5px]">
                            <div className="w-full h-full rounded-[1.2rem] md:rounded-[1.6rem] overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a2b4b]/20 to-transparent z-10 pointer-events-none" />
                                <img
                                    src={cat.image || "https://biriq.com/placeholder.png"}
                                    className="w-full h-full object-cover relative z-0 group-hover:scale-110 transition-transform duration-500"
                                    alt={cat.name}
                                />
                            </div>

                            {/* EXTRA BONUS tag */}
                            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md py-0.5 px-2.5 rounded-full shadow-sm z-20 whitespace-nowrap border border-slate-100">
                                <span className="text-[7px] md:text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center justify-center gap-1">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5"><path d="M12 2c0 0-4 4-4 9s4 9 4 9 4-4 4-9-4-9-4-9zm0 13c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" /></svg>
                                    OFFICIAL
                                </span>
                            </div>
                        </div>

                        <h3 className="mt-3 md:mt-4 text-[11px] md:text-sm font-black text-center text-[#1a2b4b] tracking-tight leading-tight px-1 group-hover:text-blue-500 transition-colors">
                            {cat.name}
                        </h3>
                    </Link>
                ))}
            </div>

            <div className="mt-24">
                <WhyChoose />
            </div>

            {/* ── SPACING & HOW IT WORKS ── */}
            <div className="mt-12 md:mt-16">
                <HowItWorks />
            </div>

            {/* 💳 Payment Partners (Continuous Scrolling at the Bottom) */}
            <PaymentPartners partners={partners} />
        </main>
    );
}
