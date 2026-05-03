==
cd /mnt/c/Users/asus/git/codex
npm install express
nohup node lib/server.js > logs/nohup.log 2>&1 &
or
crontab -e
@reboot cd /mnt/c/Users/asus/git/codex && nohup node lib/server.js > logs/nohup.log 2>&1 &
==

cd /mnt/c/Users/asus/git/codex && jupyter-notebook --no-browser --ip=0.0.0.0 --port=8888 2>&1 &
or 
crontab -e
@reboot cd /mnt/c/Users/asus/git/codex && jupyter-notebook --no-browser --ip=0.0.0.0 --port=8888 2>&1 &


-- stats
cd codex/john/logs
./ip.sh
./get.sh IP