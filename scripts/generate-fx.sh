#!/usr/bin/env bash
set -euo pipefail
for fx in flawed cut aura; do
 cfg="/tmp/facet-fx-${fx}.json"
 if [ "$fx" = aura ]; then duration=1500; else duration=800; fi
 printf '{"width":128,"height":128,"duration_ms":%s,"fps":30,"seed":43,"actions":"/tmp/facet-fx-%s-actions.json","preview":"/tmp/facet-fx-%s-preview.gif","system":"/work/public/assets/fx/%s.json"}' "$duration" "$fx" "$fx" "$fx" > "$cfg"
 particle-2d --config "$cfg" init >/dev/null
 case $fx in flawed) particle-2d --config "$cfg" add-emitter --name shards --shape point --x 64 --y 64 --burst 48 --lifetime 520 --speed 125 --speed-spread 42 --cone-angle 180 >/dev/null; color='#ff8c91@0,#f2d59b@0.5,#70e3e7@1';;
 cut) particle-2d --config "$cfg" add-emitter --name glints --shape disc --x 64 --y 64 --radius 12 --burst 29 --lifetime 500 --speed 65 --cone-angle 180 >/dev/null; color='#ffffff@0,#f7d889@0.55,#91cce5@1';;
 aura) particle-2d --config "$cfg" add-emitter --name dust --shape disc --x 64 --y 64 --radius 24 --rate 9 --lifetime 650 --speed 15 --cone-angle 180 >/dev/null; color='#fae8b9@0,#b6dcf0@0.5,#ffffff@1'; particle-2d --config "$cfg" set-timeline --loop true >/dev/null;; esac
 particle-2d --config "$cfg" set-particle --emitter "$( [ "$fx" = flawed ] && echo shards || { [ "$fx" = cut ] && echo glints || echo dust; } )" --size-from 2 --size-to 0 --opacity-from 0.9 --opacity-to 0 --color-gradient "$color" >/dev/null
 particle-2d --config "$cfg" render >/dev/null
done
