#!/bin/bash
if ! screen -list | grep -q "car"; then
    screen -dmS car bash -c "export NODE_PATH=/usr/local/lib/node_modules; cd /home/debian/car-server/; echo temppwd | sudo -S ./setup_pru.sh; echo temppwd | sudo -S node car-client.js; exec sh"
fi