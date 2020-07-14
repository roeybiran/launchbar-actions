#!/bin/sh

for f in "${@}"; do
	/usr/bin/automator -i "${f}" -D "Path=${TMPDIR}" "./extract_text.workflow" 1>/dev/null 2>&1
done

/usr/bin/textutil -cat txt "${TMPDIR}/automator_extracted_text"* -output "${TMPDIR}/combined_texts.txt"
texts=$(sed -E '/^[[:space:]]*$/d' <"${TMPDIR}/combined_texts.txt" | uniq)
rm "${TMPDIR}/automator_extracted_text"* "${TMPDIR}/combined_texts.txt"

echo "${texts}"
