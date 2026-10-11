#!/usr/bin/env bash
set -euo pipefail
mkdir -p public/assets/audio
make_sfx(){
 local name=$1 freq=$2 dur=$3 wave=$4 gain=$5 to=$6
 local cfg="/tmp/facet-${name}.json"
 printf '{"sample_rate":44100,"channels":"stereo","max_duration_ms":1200,"seed":42,"actions":"/tmp/facet-%s-actions.json","preview":"/tmp/facet-%s-preview.png","wav":"/work/public/assets/audio/%s.wav"}' "$name" "$name" "$name" > "$cfg"
 sfx-synth --config "$cfg" init >/dev/null
 sfx-synth --config "$cfg" add-voice --name main --wave "$wave" --freq "$freq" --gain "$gain" --dur "$dur" >/dev/null
 sfx-synth --config "$cfg" set-pitch --voice main --slide-to "$to" --over "$dur" >/dev/null
 sfx-synth --config "$cfg" add-voice --name sparkle --wave sine --freq "$((freq*2))" --gain -25 --dur "$((dur/2))" >/dev/null
 sfx-synth --config "$cfg" render >/dev/null
}
make_sfx select 810 110 triangle -11 1160
make_sfx swap 420 185 triangle -9 690
make_sfx refuse 170 150 square -18 85
make_sfx land 130 210 sine -8 70
make_sfx flaw 490 145 saw -15 115
make_sfx cut 1010 350 triangle -14 1470
make_sfx levelup 660 550 triangle -14 1320
make_sfx gameover 390 650 triangle -13 120
make_sfx clear 690 190 triangle -15 900
for i in {1..8}; do make_sfx "chain${i}" "$((440+i*68))" 210 triangle -13 "$((530+i*72))"; done
