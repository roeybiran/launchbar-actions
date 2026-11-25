#!/bin/bash

external=$(curl -s --max-time 5 ifconfig.me)
local=$(ipconfig getifaddr en0 2>/dev/null)

echo "[{\"title\": \"$external\", \"subtitle\": \"External\"}, {\"title\": \"$local\", \"subtitle\": \"Local\"}]"
