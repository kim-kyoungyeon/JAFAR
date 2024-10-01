#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

if [ -z "$(command -v nvm)" ]; then
	echo "NVM is not loaded. 설치 확인"
	exit 1
fi


# node js 16
nvm use 16.20.2 

export PATH="$PATH:$(yarn global bin)"


cd /home/ec2-user/JAFAR || exit



pkill node 
 


nohup serve -s build -l 3000 > app.log 2>&1 &
nohup http-server ./build -p 3000 -a 0.0.0.0 --cors -c-1 -P http://localhost:3000 > app.log 2>&1 &

echo $! > ./app.pid

yarn install --frozen-lockfile --cache-folder ~/.yarn-cache

echo "Deploy FE:3000  성공"

sleep 5
if pgrep -f "serve -s build" > /dev/null
then
    echo "애플리케이션이 성공적으로 시작되었습니다."
else
    echo "애플리케이션 시작 실패. 로그를 확인하세요."
    cat app.log
fi
