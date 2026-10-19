#!/usr/bin/env bash
# Baut beide Videos + Sprechertexte. Aufruf: bash src/build.sh [anzahl_parallel]
set -euo pipefail
cd "$(dirname "$0")"
export NODE_PATH="${NODE_PATH:-/opt/node-tools/node_modules}"
JOBS="${1:-4}"
OUT=..
WORK="${WORK:-$(mktemp -d)}"
mkdir -p "$WORK"

node build-texts.js "$OUT" "$WORK/sprechhilfe.ass"

FRAMES=$(node -e "console.log(Math.ceil(require('./script.js').computeTiming().total*30))")
PER=$(( (FRAMES + JOBS - 1) / JOBS ))
echo "Frames: $FRAMES, $JOBS Teile à $PER"
: > "$WORK/list.txt"
for i in $(seq 0 $((JOBS - 1))); do
  S=$(( i * PER )); E=$(( S + PER )); (( E > FRAMES )) && E=$FRAMES
  node render.js chunk "$S" "$E" "$WORK/part$i.mp4" &
  echo "file '$WORK/part$i.mp4'" >> "$WORK/list.txt"
done
wait

# Zusammenfügen + stille Tonspur (damit Schnittprogramme eine Audiospur sehen)
DUR=$(awk "BEGIN{print $FRAMES/30}")
ffmpeg -y -loglevel error -f concat -safe 0 -i "$WORK/list.txt" -f lavfi -i anullsrc=r=48000:cl=stereo \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 64k -t "$DUR" -movflags +faststart "$OUT/erklaervideo_auge.mp4"

# Sprechhilfe-Version mit eingeblendetem Text
ffmpeg -y -loglevel error -i "$OUT/erklaervideo_auge.mp4" -vf "ass=$WORK/sprechhilfe.ass" \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a copy -movflags +faststart "$OUT/erklaervideo_auge_sprechhilfe.mp4"

echo "Fertig:"; ls -lh "$OUT"/*.mp4
