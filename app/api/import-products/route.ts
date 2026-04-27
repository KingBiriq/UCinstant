import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const MARKUP = 1.3;
const WAAFI = 0.015;
const API = 0.01;

export async function GET() {
    const s = supabaseAdmin();

    try {
        const res = await fetch("https://api.g2bulk.com/v1/products", {
            headers: {
                Authorization: process.env.G2BULK_API_KEY!,
            },
        });

        const data = await res.json();

        for (const item of data.products || []) {
            const api_price = Number(item.api_price);
            const sell_price = api_price * MARKUP;

            const profit =
                sell_price -
                api_price -
                sell_price * WAAFI -
                api_price * API;

            // 🔥 CATEGORY MATCH
            const { data: cat } = await s
                .from("categories")
                .select("id")
                .eq("game_code", item.game_code)
                .single();

            await s.from("products").upsert(
                {
                    title: item.catalogue_name,
                    catalogue_name: item.catalogue_name,
                    game_code: item.game_code,
                    catalogue_id: item.catalogue_id,

                    api_price,
                    sell_price,
                    profit,

                    category_id: cat?.id || null,
                    active: true,
                },
                { onConflict: "catalogue_id" }
            );
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message });
    }
}