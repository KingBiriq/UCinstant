import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function bufferToStream(buffer: Buffer) {
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
}

async function uploadToCloudinary(buffer: Buffer, folder = "biriq-store") {
    return new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                overwrite: true,
                transformation: [
                    { quality: "auto", fetch_format: "auto" },
                ],
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        bufferToStream(buffer).pipe(stream);
    });
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const folder = String(formData.get("folder") || "biriq-store");

        if (!file) {
            return NextResponse.json(
                { success: false, message: "File missing" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await uploadToCloudinary(buffer, folder);

        return NextResponse.json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message || "Upload failed" },
            { status: 500 }
        );
    }
}