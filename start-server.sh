#!/bin/bash
screen -dm bash -c "echo temppwd | sudo -S node client.js; exec sh"