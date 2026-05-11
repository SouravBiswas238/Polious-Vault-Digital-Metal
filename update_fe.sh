#!/bin/bash
cd ~/Polyus_Vault/emerald-elegance
git pull
npm install
npm run build
# No need to restart Nginx; it will see the new files in the dist folder automatically!
