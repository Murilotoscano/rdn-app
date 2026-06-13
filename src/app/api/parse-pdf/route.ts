import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';

export async function POST(req: NextRequest) {
    try {
        const { filename } = await req.json();
        if (!filename) {
            return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
        }

        // Clean filename to prevent directory traversal
        const safeFilename = path.basename(filename);
        const docsDir = path.join(process.cwd(), 'docs');
        const pdfPath = path.join(docsDir, safeFilename);

        if (!fs.existsSync(pdfPath)) {
            return NextResponse.json({ error: `File not found: ${safeFilename}` }, { status: 404 });
        }

        const dataBuffer = fs.readFileSync(pdfPath);
        const parsedData = await pdf(dataBuffer);

        return NextResponse.json({
            filename: safeFilename,
            pageCount: parsedData.numpages,
            text: parsedData.text,
            characterCount: parsedData.text.length
        });
    } catch (error: any) {
        console.error('Error parsing PDF:', error);
        return NextResponse.json({ error: error.message || 'Failed to parse PDF' }, { status: 500 });
    }
}
