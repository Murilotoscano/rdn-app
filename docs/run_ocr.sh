#!/bin/bash
DOCS="/Users/murilotoscano/Desktop/SIMULADO RDN MURILO - ABACUS/rdn-app/docs"
OUT="$DOCS/extracted"
PDFTOPPM="/opt/homebrew/bin/pdftoppm"
TESSERACT="/opt/homebrew/bin/tesseract"
LOG="$OUT/ocr_log.txt"

> "$LOG"
echo "OCR started at $(date)" | tee -a "$LOG"

for pdf in "$DOCS"/*.pdf; do
    name=$(basename "$pdf" .pdf)

    # Skip the already-OCR'd file
    if [[ "$name" == *"OCR"* ]]; then
        echo "Skipping (already has text layer): $name" | tee -a "$LOG"
        # Just extract text directly
        /opt/homebrew/bin/pdftotext "$pdf" "$OUT/$name.txt"
        echo "  -> extracted with pdftotext" | tee -a "$LOG"
        continue
    fi

    outfile="$OUT/$name.txt"
    echo "Processing: $name" | tee -a "$LOG"

    tmpdir=$(mktemp -d)
    "$PDFTOPPM" -r 300 "$pdf" "$tmpdir/page" 2>>"$LOG"

    > "$outfile"
    count=0
    for img in "$tmpdir"/page-*.ppm; do
        [ -f "$img" ] || continue
        "$TESSERACT" "$img" stdout -l eng 2>/dev/null >> "$outfile"
        count=$((count + 1))
    done

    rm -rf "$tmpdir"
    echo "  -> $count pages OCR'd -> $outfile" | tee -a "$LOG"
done

echo "OCR completed at $(date)" | tee -a "$LOG"
