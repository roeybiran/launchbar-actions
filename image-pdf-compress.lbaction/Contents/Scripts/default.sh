#!/bin/bash
# Compresses images (to JPEG, 85%) with sips, and PDFs with PDFKit + the system "Reduce File Size" Quartz filter.
# Output goes next to the original as COMPRESSED_<name>; the last output path is copied to the clipboard.
# No dependencies.

compress_pdf() {
	/usr/bin/osascript - "$1" "$2" <<'EOF'
use AppleScript version "2.4"
use framework "Foundation"
use framework "Quartz"
use scripting additions

on run {inPath, outPath}
	set doc to current application's PDFDocument's alloc()'s initWithURL:(current application's NSURL's fileURLWithPath:inPath)
	if doc is missing value then error "Could not open " & inPath
	-- same filter as Preview's "Reduce File Size"
	set qf to current application's QuartzFilter's quartzFilterWithURL:(current application's NSURL's fileURLWithPath:"/System/Library/Filters/Reduce File Size.qfilter")
	set opts to current application's NSDictionary's dictionaryWithObject:qf forKey:"QuartzFilter"
	if not ((doc's writeToFile:outPath withOptions:opts) as boolean) then error "Could not write " & outPath
end run
EOF
}

last=""
for file in "$@"; do
	dir="$(dirname "$file")"
	name="$(basename "$file")"
	if [[ "$file" == *.[pP][dD][fF] ]]; then
		out="$dir/COMPRESSED_$name"
		compress_pdf "$file" "$out" || continue
	else
		out="$dir/COMPRESSED_${name%.*}.jpg"
		/usr/bin/sips -s format jpeg -s formatOptions 85 "$file" --out "$out" >/dev/null || continue
	fi
	last="$out"
done

[ -n "$last" ] && printf '%s' "$last" | pbcopy
