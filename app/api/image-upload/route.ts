import { NextResponse, NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server';


// Configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
    //     ' // Click 'View API Keys' above to copy your API secret
});


interface CloudinaryUploadResult {
    public_id: string;
    [key: string]: any
}


export async function POST(request: NextRequest) {
    const [userId] = auth()

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}