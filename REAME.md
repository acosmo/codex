cd /mnt/c/Users/asus/git/codex
nohup python3 -m http.server 8000 --directory john &

==
cd /mnt/c/Users/asus/git/codex/john
npm install express
nohup node lib/server.js > logs/nohup.log 2>&1 &
==

cd /mnt/c/Users/asus/git/codex
jupyter-notebook --no-browser --ip=0.0.0.0 --port=8888


-- stats
cd codex/john/logs
./ip.sh
./get.sh IP
