import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const s = supabaseAdmin();

        const userId = body.user_id;
        const amount = Number(body.amount || 0);

        if (!userId || amount <= 0) {
            return NextResponse.json({ success: false, message: "Invalid request" });
        }

        const { data: profile } = await s
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (Number(profile?.cashback_balance || 0) < amount) {
            return NextResponse.json({
                success: false,
                message: "Cashback balance kuma filna",
            });
        }

        await s.from("withdrawal_requests").insert({
            user_id: userId,
            amount,
            phone: body.phone,
            method: body.method || "EVC",
            status: "PENDING",
            note: body.note || "",
        });

        await s.from("cashback_transactions").insert({
            user_id: userId,
            type: "WITHDRAW_REQUEST",
            amount: -amount,
            status: "PENDING",
            note: "Withdrawal request submitted",
        });

        await s
            .from("profiles")
            .update({
                cashback_balance: Number(profile.cashback_balance || 0) - amount,
            })
            .eq("id", userId);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message });
    }
}