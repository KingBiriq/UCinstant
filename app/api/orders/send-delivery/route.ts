import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { g2bulk } from "@/lib/g2bulk";

async function awardCashback(orderId: string) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    try {
        await fetch(`${siteUrl}/api/cashback/award`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: orderId }),
        });
    } catch (error) {
        console.error("Cashback award failed:", error);
    }
}

function getFinalDeliveryStatus(api: any) {
    const rawStatus = String(
        api?.status ||
        api?.order?.status ||
        api?.data?.status ||
        api?.message ||
        ""
    ).toUpperCase();

    if (
        rawStatus.includes("FAILED") ||
        rawStatus.includes("ERROR") ||
        rawStatus.includes("INSUFFICIENT") ||
        api?.success === false
    ) {
        return "FAILED";
    }

    return "COMPLETED";
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const orderId = body.order_id;

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: "order_id is required" },
                { status: 400 }
            );
        }

        const s = supabaseAdmin();

        const { data: order, error } = await s
            .from("orders")
            .select("*, products(*)")
            .eq("id", orderId)
            .single();

        if (error || !order) {
            return NextResponse.json(
                { success: false, message: "Order lama helin" },
                { status: 404 }
            );
        }

        if (order.payment_status !== "PAID") {
            return NextResponse.json(
                { success: false, message: "Order is not paid" },
                { status: 400 }
            );
        }

        const product = order.products;

        if (product?.product_type !== "api") {
            await s
                .from("orders")
                .update({ delivery_status: "MANUAL_REQUIRED" })
                .eq("id", order.id);

            return NextResponse.json({
                success: true,
                order_id: order.id,
                delivery_status: "MANUAL_REQUIRED",
                message: "Manual order requires admin delivery",
            });
        }

        const api = await g2bulk(`/games/${order.game_code}/order`, {
            method: "POST",
            headers: {
                "X-Idempotency-Key": randomUUID(),
            },
            body: JSON.stringify({
                catalogue_name: order.catalogue_name,
                player_id: order.player_id,
                server_id: order.server_id || "",
                remark: `Biriq Store Order ${order.id}`,
                callback_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
                    }/api/webhooks/g2bulk`,
            }),
        });

        const deliveryStatus = getFinalDeliveryStatus(api);

        await s
            .from("orders")
            .update({
                g2bulk_order_id: api?.order?.order_id || api?.order_id || null,
                delivery_status: deliveryStatus,
                raw_api_response: api,
            })
            .eq("id", order.id);

        if (deliveryStatus === "COMPLETED") {
            await awardCashback(order.id);
        }

        return NextResponse.json({
            success: deliveryStatus === "COMPLETED",
            order_id: order.id,
            delivery_status: deliveryStatus,
            api_response: api,
        });
    } catch (err: any) {
        return NextResponse.json(
            {
                success: false,
                message: err.message || "Send delivery failed",
            },
            { status: 500 }
        );
    }
}