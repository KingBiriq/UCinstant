import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const s = supabaseAdmin();

        const { data, error } = await s
            .from("categories")
            .insert({
                name: body.name,
                slug: body.slug,
                game_code: body.game_code,
                image: body.image,
                description: body.description,
                type: body.type || "api",
                active: true,
            })
            .select("*")
            .single();

        if (error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, category: data });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Category save failed" },
            { status: 500 }
        );
    }
}
