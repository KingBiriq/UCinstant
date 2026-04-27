import { supabaseAdmin } from "@/lib/supabase";
import ProductsClient from "./ProductsClient";

export default async function ProductsPage() {
    const s = supabaseAdmin();
    const [productsRes, categoriesRes] = await Promise.all([
        s.from("products").select("*").order("created_at", { ascending: false }),
        s.from("categories").select("*").order("created_at", { ascending: false })
    ]);

    const products = productsRes.data || [];
    const categories = categoriesRes.data || [];

    return <ProductsClient products={products} categories={categories} />;
}