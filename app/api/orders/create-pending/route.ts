import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const s = supabaseAdmin();

        const { data: p, error } = await s
            .from("products")
            .select("*")
            .eq("id", body.product_id)
            .single();

        if (error || !p) {
            return NextResponse.json({ success: false, message: "Product lama helin" }, { status: 404 });
        }

        const profit = Number(p.sell_price || 0) - Number(p.api_price || 0);

        const { data: o, error: oe } = await s.from("orders").insert({
            customer_phone: body.phone,
            game_code: p.game_code,
            player_id: body.player_id,
            player_name: body.player_name,
            server_id: body.server_id || "",
            product_id: p.id,
            catalogue_id: p.catalogue_id,
            catalogue_name: p.catalogue_name || p.title,
            amount_paid: body.amount_paid || p.sell_price,
            api_price: p.api_price,
            sell_price: p.sell_price,
            profit,
            payment_status: "PENDING",
            delivery_status: "PENDING"
        }).select("*").single();

        if (oe) {
            return NextResponse.json({ success: false, message: oe.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, order: o });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
