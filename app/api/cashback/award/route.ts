import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const s = supabaseAdmin();

        const orderId = body.order_id;

        const { data: order, error: orderError } = await s
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ success: false, message: "Order lama helin" });
        }

        if (order.payment_status !== "PAID") {
            return NextResponse.json({ success: false, message: "Order paid ma aha" });
        }

        const amountPaid = Number(order.amount_paid || 0);
        const cashback = amountPaid * 0.01;
        const points = amountPaid;

        await s.from("cashback_transactions").insert({
            user_id: order.user_id,
            order_id: order.id,
            type: "EARN",
            amount: cashback,
            points,
            status: "COMPLETED",
            note: "1% cashback from successful order",
        });

        await s.rpc("increment_cashback", {
            user_id_input: order.user_id,
            cashback_input: cashback,
            points_input: points,
        });

        return NextResponse.json({
            success: true,
            cashback,
            points,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}