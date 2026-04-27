import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const s = supabaseAdmin();
        const { data, error } = await s
            .from("categories")
            .select("*")
            .eq("id", params.id)
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
            { success: false, message: error.message || "Fetch failed" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const s = supabaseAdmin();
        const { error } = await s
            .from("categories")
            .delete()
            .eq("id", params.id);

        if (error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Delete failed" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json();
        const s = supabaseAdmin();

        const { data, error } = await s
            .from("categories")
            .update({
                name: body.name,
                slug: body.slug,
                game_code: body.game_code,
                image: body.image,
                description: body.description,
                type: body.type,
                active: body.active,
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

        return NextResponse.json({ success: true, category: data });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Update failed" },
            { status: 500 }
        );
    }
}
