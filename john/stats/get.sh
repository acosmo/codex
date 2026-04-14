#!/bin/bash

LOG_FILE="logs/edits.log"
IP="$1"

awk -F'|' -v ip="$IP" '
$2 ~ ip {
    file=$3
    verse=$4
    text=$5

    sub(/.*FILE:/, "", file)
    sub(/.*VERSE:/, "", verse)
    sub(/.*TEXT:/, "", text)

    gsub(/[^0-9]/, "", file)
    gsub(/[^0-9]/, "", verse)

    key=file ":" verse

    data[key]=file ":" verse " " text
}

END {
    for (k in data)
        print data[k]
}' "$LOG_FILE" | sort -t':' -k1,1n -k2,2n
