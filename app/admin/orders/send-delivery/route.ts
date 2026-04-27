import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { g2bulk } from "@/lib/g2bulk";

function isSuccess(api: any) {
    const status = String(api?.status || api?.order?.status || "").toUpperCase();

    return (
        api?.success === true ||
        status.includes("SUCCESS") ||
        status.includes("COMPLETED")
    );
}

export async function POST(req: Request) {
    try {
        const { order_id } = await req.json();
        const s = supabaseAdmin();

        const { data: order } = await s
            .from("orders")
            .select("*, products(*)")
            .eq("id", order_id)
            .single();

        if (!order) {
            return NextResponse.json({ success: false });
        }

        const product = order.products;

        // Manual order
        if (product?.product_type !== "api") {
            await s.from("orders").update({
                delivery_status: "COMPLETED"
            }).eq("id", order.id);

            return NextResponse.json({ success: true });
        }

        // Call API
        const api = await g2bulk(`/games/${order.game_code}/order`, {
            method: "POST",
            headers: {
                "X-Idempotency-Key": randomUUID(),
            },
            body: JSON.stringify({
                catalogue_name: order.catalogue_name,
                player_id: order.player_id,
                server_id: order.server_id || "",
                remark: `Order ${order.id}`,
            }),
        });

        const success = isSuccess(api);

        await s.from("orders").update({
            delivery_status: success ? "COMPLETED" : "FAILED", // 🔥 muhiim
            g2bulk_order_id: api?.order?.order_id || null,
            raw_api_response: api,
        }).eq("id", order.id);

        return NextResponse.json({
            success,
        });

    } catch (e: any) {
        return NextResponse.json({ success: false, message: e.message });
    }
}