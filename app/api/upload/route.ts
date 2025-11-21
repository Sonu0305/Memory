import { NextRequest, NextResponse } from 'next/server';
import { uploadToBlob } from '@/lib/blob';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Upload to Vercel Blob
        const result = await uploadToBlob(file);

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error('Upload API error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
