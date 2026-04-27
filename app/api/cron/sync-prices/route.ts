import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
    const s = supabaseAdmin();

    const res = await fetch("https://api.g2bulk.com/v1/products", {
        headers: {
            Authorization: process.env.G2BULK_API_KEY!,
        },
    });

    const data = await res.json();

    for (const item of data.products || []) {
        await s
            .from("products")
            .update({
                api_price: item.api_price,
                sell_price: Number(item.api_price) * 1.3, // auto profit 🔥
            })
            .eq("catalogue_id", item.catalogue_id);
    }

    return NextResponse.json({ success: true });
}