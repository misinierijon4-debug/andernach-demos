#!/usr/bin/env bash
# Rendert beide Videos und die Sprechertexte in den Ordner bio-erklaervideo-auge/.
#   bash scripts/build.sh            (im Ordner remotion/)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=..
# Vorhandenes Chromium nutzen, sonst lädt Remotion seine eigene Headless-Shell
BROWSER="${BROWSER:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}"
BROWSER_ARG=()
[ -x "$BROWSER" ] && BROWSER_ARG=(--browser-executable="$BROWSER")

node --experimental-strip-types --no-warnings scripts/build-texts.mjs "$OUT"

npx remotion render Erklaervideo "$OUT/erklaervideo_auge.mp4" \
  --codec=h264 --crf=18 --jpeg-quality=95 --enforce-audio-track "${BROWSER_ARG[@]}"

# Sprechhilfe-Version: gleicher Film mit eingeblendetem Sprechertext
npx remotion render Sprechhilfe "$OUT/erklaervideo_auge_sprechhilfe.mp4" \
  --codec=h264 --crf=20 --jpeg-quality=95 --enforce-audio-track "${BROWSER_ARG[@]}"

ls -lh "$OUT"/*.mp4
