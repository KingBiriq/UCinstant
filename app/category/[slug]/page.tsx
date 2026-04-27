import { supabaseAdmin } from "@/lib/supabase";
import CategoryClient from "@/components/CategoryClient";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const s = supabaseAdmin();

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    const query = isUUID 
        ? `id.eq.${slug}` 
        : `slug.eq.${slug},game_code.eq.${slug}`;

    const { data: cat, error } = await s
        .from("categories")
        .select("*")
        .or(query)
        .single();

    if (error) {
        console.error("Supabase Error:", error.message);
    }

    if (!cat) {
        return <main className="p-10 text-red-400">Category lama helin.</main>;
    }

    const { data: products } = await s
        .from("products")
        .select("*")
        .eq("active", true)
        .eq("category_id", cat.id)
        .order("sell_price");

    return <CategoryClient cat={cat} products={products || []} />;
}