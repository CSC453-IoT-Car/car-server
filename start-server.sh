#!/bin/bash
screen -dmS car bash -c "cd /home/debian/car-server/; echo temppwd | sudo -S ./setup_pru.sh; echo temppwd | sudo -S node client.js; exec sh"