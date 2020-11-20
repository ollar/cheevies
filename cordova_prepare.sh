#!/bin/bash

ENV=$1

ember build --environment cordova
rm -rf cordova-app/www/*
cp -R dist/assets cordova-app/www/
cp -R dist/feather-icons cordova-app/www/
cp -R dist/images cordova-app/www/
cp -R dist/_demo-group.json cordova-app/www
cp dist/index.html cordova-app/www/
cd cordova-app
cordova prepare
if [ ENV = 'dev' ]; then
    cordova run android --device
else
    cordova build --release
fi