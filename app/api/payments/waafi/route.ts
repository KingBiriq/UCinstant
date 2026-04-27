import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

function normalizePhone(phone: string) {
    let p = String(phone || "").trim().replace(/\s+/g, "");

    // 061xxxxxxx -> 25261xxxxxxx
    if (p.startsWith("0")) {
        p = "252" + p.slice(1);
    }

    // 61xxxxxxx -> 25261xxxxxxx
    if (p.startsWith("61") || p.startsWith("68") || p.startsWith("63")) {
        p = "252" + p;
    }

    return p;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const phone = normalizePhone(body.phone);
        const amount = Number(body.amount || 0);
        const orderId = body.order_id;
        const description = body.description || "Biriq Store Game Topup";

        if (!phone || !amount || !orderId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "phone, amount and order_id are required",
                },
                { status: 400 }
            );
        }

        const referenceId = `BRQ-${Date.now()}`;
        const requestId = randomUUID();

        const payload = {
            schemaVersion: "1.0",
            requestId,
            timestamp: new Date().toISOString(),
            channelName: "WEB",
            serviceName: "API_PURCHASE",
            serviceParams: {
                merchantUid: process.env.WAAFI_MERCHANT_UID,
                apiUserId: Number(process.env.WAAFI_API_USER_ID),
                apiKey: process.env.WAAFI_API_KEY,
                paymentMethod: "MWALLET_ACCOUNT",
                payerInfo: {
                    accountNo: phone,
                },
                transactionInfo: {
                    referenceId,
                    invoiceId: String(orderId),
                    amount: amount.toFixed(2),
                    currency: "USD",
                    description,
                },
            },
        };

        const res = await fetch(process.env.WAAFI_BASE_URL!, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
        });

        const waafi = await res.json();

        const responseCode = String(waafi?.responseCode || "");
        const state = String(waafi?.params?.state || "").toUpperCase();

        const paid =
            responseCode === "2001" &&
            (state === "APPROVED" || state === "COMPLETED" || state === "SUCCESS");

        if (!paid) {
            return NextResponse.json({
                success: false,
                paid: false,
                message:
                    waafi?.responseMsg ||
                    waafi?.params?.description ||
                    "Payment was not completed",
                referenceId,
                waafi,
            });
        }

        return NextResponse.json({
            success: true,
            paid: true,
            referenceId,
            transactionId: waafi?.params?.transactionId || null,
            phone,
            amount,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                paid: false,
                message: error.message || "Waafi payment error",
            },
            { status: 500 }
        );
    }
}