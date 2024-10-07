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


echo "Stopping existing processes..."
pkill -f "serve -s build"
pkill -f "http-server build"
pkill -f "node.*3000"
sleep 2



nohup serve -s build -l 3000 > app.log 2>&1 &
nohup http-server ./build -p 3000 -a 0.0.0.0 --cors -c-1 -P http://localhost:3000 > app.log 2>&1 &

echo $! > ./app.pid

# 의존성 설치
echo "Installing dependencies..."

yarn install --frozen-lockfile --cache-folder ~/.yarn-cache



cd /home/ec2-user/JAFAR || exit

pkill node 


# 현재 디렉토리 출력
echo "Current directory: $(pwd)"




# http-server 전역 설치
echo "Installing http-server globally..."
yarn global add http-server


# 3000 포트 확인 및 강제 종료
while netstat -tuln | grep :3000 > /dev/null; do
  echo "Port 3000 is in use. Forcefully terminating the process..."
  fuser -k 3000/tcp
  sleep 2
done


# 애플리케이션 시작
echo "Starting application with http-server..."
nohup http-server ./build -p 3000 --cors -c-1 -P http://localhost:3000 > app.log 2>&1 &
echo $! > ./app.pid

echo "Deploy FE:3000 시도 중..."

sleep 5

PORT=3000


sleep 5

if pgrep -f "http-server ./build" > /dev/null
then
    echo "애플리케이션이 성공적으로 시작되었습니다. 3000번 포트에서 작동 중"
    echo "서버 로그:"
    tail -n 20 app.log
else
    echo "애플리케이션 시작 실패. 로그를 확인하세요."
    cat app.log
fi

echo "http://$(curl -s ifconfig.me):$PORT 에서 애플리케이션에 접근할 수 있습니다."


echo "빌드 디렉토리 내용:"
ls -la build
echo "정적 파일 접근 테스트:"
curl -I http://localhost:3000/static/js/main.88445bed.js
