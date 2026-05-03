#!/bin/bash
LOG_FILE="../logs/edits.log"
IP="$1"

awk -F'|' -v ip="$IP" '
$2 ~ ip {
    date=$1
    book=$3
    verse=$4
    text=$5

    sub(/.*BOOK:/, "", book)
    sub(/.*VERSE:/, "", verse)
    sub(/.*TEXT:/, "", text)

    gsub(/^ +| +$/, "", date)
    gsub(/^ +| +$/, "", book)
    gsub(/^ +| +$/, "", verse)
    gsub(/^ +| +$/, "", text)

    key=book ":" verse
    data[key]=date " | " book " " verse " | " text
}
END {
    for (k in data)
        print data[k]
}' "$LOG_FILE" | sort