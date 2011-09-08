#!/bin/bash

echo ''
echo '*** copying keys ***'
echo ''
cp ~/key* .

echo ''
echo '*** bundling crypto libs ***'
echo ''
cd lib/jwcrypto
./bundle.sh
cd ../..

node-service-disable
node server.js
