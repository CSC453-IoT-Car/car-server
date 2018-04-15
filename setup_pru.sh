#!/bin/bash
config-pin p9.30 pruout
config-pin p8.39 pruin
config-pin p8.41 pruin
config-pin p8.43 pruin
config-pin p8.45 pruin
cd /var/lib/cloud9/pru_beacon
make run
cd /var/lib/cloud9/pru_detector
make run
