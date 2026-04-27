import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const WAAFI_PERCENT = 0.015; // 1.5%
const API_PERCENT = 0.01;   // 1%

export async function POST(req: NextRequest) {
    const s = supabaseAdmin();
    const body = await req.json();

    try {
        const api_price = Number(body.api_price || 0);
        const sell_price = Number(body.sell_price || 0);

        const waafi_fee = sell_price * WAAFI_PERCENT;
        const api_fee = api_price * API_PERCENT;
        const profit = sell_price - api_price - waafi_fee - api_fee;

        const { error } = await s.from("products").insert({
            category_id: body.category_id,
            product_type: body.product_type || "api",
            game_code: body.game_code,
            catalogue_id: body.catalogue_id,
            catalogue_name: body.catalogue_name,
            title: body.title,
            description: body.description,
            image: body.image,
            api_price,
            sell_price,
            profit,
            active: true,
        });

        if (error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json(
            { success: false, message: e.message || "Product save failed" },
            { status: 500 }
        );
    }
}