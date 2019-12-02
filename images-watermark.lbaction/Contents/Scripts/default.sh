#!/bin/bash

stamp_fgnd="$TMPDIR/stamp_fgnd.png"
stamp_mask="$TMPDIR/stamp_mask.png"
stamp="$TMPDIR/stamp.png"

# watermark=$(/usr/bin/osascript <<-EOF
# 	set theDialog to display dialog "Enter watermark text" default answer "© "
# 	return text returned of theDialog
# EOF
# )

watermark="(c) Tal Brushel"

if [[ $? -ne 0 ]]
then
	exit 0
fi

for f in "/Users/roey/Desktop/maxresdefault2.jpg" "/Users/roey/Desktop/TAL_6169-2.jpg"
# for f in "${@}"
do
	filename="$(basename "${f}")"
	dirname="$(dirname "${f}")"
	# /usr/local/bin/convert -size 300x50 xc:grey30 -pointsize 20 -gravity center -draw "fill grey70 text 0,0 \"${watermark}\"" "${stamp_fgnd}"
	/usr/local/bin/convert -size 300x50 xc:black -pointsize 20 -gravity center -draw "fill white text 1,1 \"${watermark}\" text 0,0 \"${watermark}\" fill black text -1,-1 \"${watermark}\"" +matte "${stamp_mask}"
	/usr/local/bin/composite -compose CopyOpacity "${stamp_mask}" "${stamp_fgnd}" "${stamp}"
	/usr/local/bin/mogrify -trim +repage "${stamp}"
	composite -gravity southwest -geometry +10+10 "${stamp}" "${f}" "${dirname}/_WATERMARKED_${filename}"
done
