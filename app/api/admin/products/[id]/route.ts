import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const WAAFI_PERCENT = 0.015; // 1.5%
const API_PERCENT = 0.01; // 1%

function calculateProfit(apiPrice: number, sellPrice: number) {
    const waafiFee = sellPrice * WAAFI_PERCENT;
    const apiFee = apiPrice * API_PERCENT;

    return sellPrice - apiPrice - waafiFee - apiFee;
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const s = supabaseAdmin();
        const { data, error } = await s
            .from("products")
            .select("*")
            .eq("id", params.id)
            .single();

        if (error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, product: data });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Fetch failed" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const s = supabaseAdmin();
        const body = await req.json();

        const api_price = Number(body.api_price || 0);
        const sell_price = Number(body.sell_price || 0);
        const profit = calculateProfit(api_price, sell_price);

        const { data, error } = await s
            .from("products")
            .update({
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
                active: body.active ?? true,
            })
            .eq("id", params.id)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            product: data,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Product update failed",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const s = supabaseAdmin();

        const { error } = await s
            .from("products")
            .delete()
            .eq("id", params.id);

        if (error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message || "Product delete failed",
            },
            { status: 500 }
        );
    }
}