#!/bin/bash

awk -F'|' '
{
    ip_field = $2
    sub(/^[[:space:]]*IP:/, "", ip_field)
    sub(/[[:space:]]*$/, "", ip_field)
    count[ip_field]++
}
END {
    for (i in count)
        print i, count[i]
}' ./logs/edits.log | sort -k2 -nr
