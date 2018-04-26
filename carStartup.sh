#!/bin/bash
cd /home/debian/car-server/
su bash ./setup_pru.sh
screen -S car-server ./start-server.sh