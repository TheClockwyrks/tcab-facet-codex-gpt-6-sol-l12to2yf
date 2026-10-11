#!/usr/bin/env bash
set -euo pipefail
for piece in title play; do
 cfg="/tmp/facet-music-${piece}.json"
 printf '{"sample_rate":44100,"channels":"stereo","max_duration_ms":30000,"seed":42,"instrument_bank":"gm-lite","actions":"/tmp/facet-music-%s-actions.json","preview":"/tmp/facet-music-%s-preview.png","wav":"/work/public/assets/audio/%s.wav","mid":"/work/public/assets/audio/%s.mid"}' "$piece" "$piece" "$piece" "$piece" > "$cfg"
 music --config "$cfg" init >/dev/null
 if [ "$piece" = title ]; then tempo=104; else tempo=78; fi
 music --config "$cfg" set-tempo --bpm "$tempo" >/dev/null
 music --config "$cfg" define-track --name melody --instrument music_box >/dev/null
 music --config "$cfg" define-track --name glass --instrument vibraphone >/dev/null
 music --config "$cfg" define-track --name low --instrument marimba >/dev/null
 if [ "$piece" = title ]; then notes=(E5 G5 B5 G5 A5 G5 E5 D5 C5 E5 G5 E5 D5 B4 C5 E5); else notes=(C5 E5 G5 E5 B4 D5 G5 D5 A4 C5 E5 C5 G4 B4 D5 B4); fi
 roots=(C3 C3 A2 A2 F3 F3 G2 G2)
 for i in "${!notes[@]}"; do
  music --config "$cfg" add-note --track melody --pitch "${notes[$i]}" --t "$i" --dur 0.8 --velocity 75 >/dev/null
  if (( i % 2 == 0 )); then music --config "$cfg" add-note --track glass --pitch "${notes[$i]}" --t "$i" --dur 1.5 --velocity 42 >/dev/null; fi
  if (( i % 2 == 0 )); then j=$((i/2)); music --config "$cfg" add-note --track low --pitch "${roots[$j]}" --t "$i" --dur 1.8 --velocity 54 >/dev/null; fi
 done
 music --config "$cfg" render >/dev/null
done
