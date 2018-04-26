#!/bin/bash
cd /home/debian/car-server/
sudo su
./setup_pru.sh
screen -S car-server ./start-server.sh