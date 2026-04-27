import { NextResponse } from "next/server";
import { g2bulk, arr } from "@/lib/g2bulk";

export async function GET(_: Request, { params }: { params: Promise<{ gameCode: string }> }) {
    const { gameCode } = await params;
    const data = await g2bulk(`/games/${gameCode}/catalogue`);
    const products = arr(data).map((i: any) => ({
        product_id: i.id,
        catalogue_id: String(i.id),
        catalogue_name: i.name,
        api_price: Number(i.amount || i.price || 0),
        raw: i,
    }));
    return NextResponse.json({ success: true, game_code: gameCode, products, raw: data });
}
