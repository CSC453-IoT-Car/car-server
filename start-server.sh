#!/bin/bash
screen -dmS car bash -c "echo temppwd | sudo -S ./setup_pru.sh; echo temppwd | sudo -S node client.js; exec sh"