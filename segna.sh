#!/bin/bash
# Segna un regalo come "già regalato" (o lo ripristina) e pubblica online.
# Uso:   ./segna.sh espresso           → segna come regalato
#        ./segna.sh espresso libero    → lo rimette disponibile
#        ./segna.sh                    → elenca gli id disponibili
set -e
cd "$(dirname "$0")"

if [ -z "$1" ]; then
  echo "Regali:"
  python3 -c '
import json
d = json.load(open("items.json"))
voci = d["regali"] + d["corredo_letto"] + d["corredo_bagno"] + [d["viaggio"]]
for v in voci:
    stato = "❤ REGALATO" if v["regalato"] else "  disponibile"
    print(f"  {v[\"id\"]:22s} {stato}")
'
  exit 0
fi

ID="$1"
STATO=$([ "$2" = "libero" ] && echo False || echo True)

python3 -c "
import json, sys
d = json.load(open('items.json'))
voci = d['regali'] + d['corredo_letto'] + d['corredo_bagno'] + [d['viaggio']]
trovato = False
for v in voci:
    if v['id'] == '$ID':
        v['regalato'] = $STATO
        trovato = True
if not trovato:
    sys.exit('Id \"$ID\" non trovato. Lancia ./segna.sh senza argomenti per l\'elenco.')
json.dump(d, open('items.json', 'w'), ensure_ascii=False, indent=2)
print('OK:', '$ID', '→', 'regalato' if $STATO else 'disponibile')
"

git add items.json
git commit -m "Aggiorna stato regalo: $ID"
git push
echo "Pubblicato. Il sito si aggiorna entro ~1 minuto."
