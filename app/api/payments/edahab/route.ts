import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function makeHash(body: any) {
    const bodyString = JSON.stringify(body);
    return crypto
        .createHash("sha256")
        .update(bodyString + process.env.EDAHAAB_API_SECRET, "utf8")
        .digest("hex");
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const phone = String(body.phone || "").trim();
        const amount = Number(body.amount || 0);
        const orderId = body.order_id;

        if (!phone || !amount || !orderId) {
            return NextResponse.json(
                { success: false, paid: false, message: "phone, amount and order_id are required" },
                { status: 400 }
            );
        }

        const requestBody = {
            apiKey: process.env.EDAHAAB_API_KEY,
            edahabNumber: phone,
            amount,
            agentCode: process.env.EDAHAAB_AGENT_CODE || "",
            currency: "USD",
        };

        const hash = makeHash(requestBody);

        const res = await fetch(`${process.env.EDAHAAB_BASE_URL}/IssueInvoice?hash=${hash}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        const edahab = await res.json();

        const statusCode = Number(edahab?.StatusCode);
        const status = String(edahab?.InvoiceStatus || "").toUpperCase();

        const paid = statusCode === 0 && (status === "PAID" || status === "APPROVED" || status === "SUCCESS");

        return NextResponse.json({
            success: paid,
            paid,
            referenceId: edahab?.TransactionId || edahab?.InvoiceId || null,
            message: paid ? "Payment success" : edahab?.StatusDescription || "Payment not completed",
            edahab,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, paid: false, message: error.message || "eDahab payment error" },
            { status: 500 }
        );
    }
}