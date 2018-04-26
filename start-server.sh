#!/bin/bash
screen -dmS car bash -c "echo temppwd | sudo -S su; ./setup_pru.sh; node client.js; exec sh"