ember build --environment cordova
cp -R dist/* cordova-app/www/
cd cordova-app
cordova prepare
cordova run android --device