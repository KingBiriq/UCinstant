import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const s = supabaseAdmin();

        const remark = String(body?.remark || body?.data?.remark || "");
        const orderId =
            remark.replace("Biriq Store Order ", "") ||
            body?.merchant_order_id ||
            body?.order_id ||
            body?.data?.merchant_order_id ||
            body?.data?.order_id;

        if (!orderId) {
            return NextResponse.json(
                { success: false, message: "order id not found" },
                { status: 400 }
            );
        }

        const rawStatus = String(
            body?.status || body?.data?.status || body?.order?.status || ""
        ).toUpperCase();

        let deliveryStatus = "COMPLETED";

        if (
            rawStatus.includes("FAILED") ||
            rawStatus.includes("ERROR") ||
            rawStatus.includes("INSUFFICIENT")
        ) {
            deliveryStatus = "FAILED";
        }

        await s
            .from("orders")
            .update({
                delivery_status: deliveryStatus,
                raw_webhook: body,
            })
            .eq("id", orderId);

        if (deliveryStatus === "COMPLETED") {
            await awardCashback(orderId);
        }

        return NextResponse.json({
            success: true,
            order_id: orderId,
            delivery_status: deliveryStatus,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Webhook failed",
            },
            { status: 500 }
        );
    }
}