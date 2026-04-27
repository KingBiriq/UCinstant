import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const s = supabaseAdmin();

        const { data: order, error } = await s
            .from("orders")
            .select("*, products(*)")
            .eq("id", id)
            .single();

        if (error || !order) {
            return NextResponse.json({ success: false, message: "Order lama helin" }, { status: 404 });
        }

        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
