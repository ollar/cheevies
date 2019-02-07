ember build --environment cordova
cp -R dist/assets cordova-app/www/
cp -R dist/feather-icons cordova-app/www/
cp -R dist/images cordova-app/www/
cp dist/index.html cordova-app/www/
cd cordova-app
cordova prepare
cordova run android --device
# cordova build --release