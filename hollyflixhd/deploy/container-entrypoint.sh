#!/bin/sh
set -eu

mkdir -p /app/data/editorials
for editorial in /app/editorials-seed/*.json; do
  [ -f "$editorial" ] || continue
  cp "$editorial" /app/data/editorials/
done

exec node server.js
