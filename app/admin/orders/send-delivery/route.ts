await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cashback/award`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: orderId }),
});