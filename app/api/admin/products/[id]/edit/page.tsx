import { supabaseAdmin } from "@/lib/supabase";

export default async function Page({ params }: any) {
    const s = supabaseAdmin();

    const { data: product } = await s
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

    async function updateProduct(formData: FormData) {
        "use server";

        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/products/${params.id}`, {
            method: "PUT",
            body: JSON.stringify({
                title: formData.get("title"),
                game_code: formData.get("game_code"),
                catalogue_id: formData.get("catalogue_id"),
                api_price: formData.get("api_price"),
                sell_price: formData.get("sell_price"),
                category_id: formData.get("category_id"),
            }),
        });
    }

    return (
        <main className="max-w-2xl mx-auto py-10">
            <h1 className="text-3xl font-bold">Edit Product</h1>

            <form action={updateProduct} className="space-y-4 mt-6">
                <input name="title" defaultValue={product?.title} className="input" />
                <input name="game_code" defaultValue={product?.game_code} className="input" />
                <input name="catalogue_id" defaultValue={product?.catalogue_id} className="input" />
                <input name="api_price" defaultValue={product?.api_price} className="input" />
                <input name="sell_price" defaultValue={product?.sell_price} className="input" />
                <input name="category_id" defaultValue={product?.category_id} className="input" />

                <button className="btn">Save Changes</button>
            </form>
        </main>
    );
}