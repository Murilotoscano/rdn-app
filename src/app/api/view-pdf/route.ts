import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
    try {
        const file = req.nextUrl.searchParams.get('file');
        if (!file) {
            return NextResponse.json({ error: 'File query parameter is required' }, { status: 400 });
        }

        // Prevent directory traversal
        const safeFilename = path.basename(file);
        const pdfPath = path.join(process.cwd(), 'docs', safeFilename);

        if (!fs.existsSync(pdfPath)) {
            return NextResponse.json({ error: `File not found: ${safeFilename}` }, { status: 404 });
        }

        const fileBuffer = fs.readFileSync(pdfPath);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${safeFilename}"`
            }
        });
    } catch (error: any) {
        console.error('Error serving PDF:', error);
        return NextResponse.json({ error: 'Failed to retrieve PDF' }, { status: 500 });
    }
}
