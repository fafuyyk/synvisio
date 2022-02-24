#!/bin/sh
# Script to update server
# clear old assets
sudo systemctl stop nginx
rm -rf /var/www/linkage/synvisio/
# copy new assets
cp -a build/. /var/www/linkage/synvisio/
# restart apache server
sudo systemctl start nginx
echo "Deploy complete successfully"
