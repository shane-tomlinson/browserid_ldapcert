#!/bin/bash

echo ''
echo '*** copying keys ***'
echo ''
cp /home/node/key* .

echo ''
echo '*** bundling crypto libs ***'
echo ''
cd lib/jwcrypto
./bundle.sh
cd ../..

node server.js
