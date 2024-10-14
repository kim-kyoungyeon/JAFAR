#!/bin/bash


# 디스크 정리
sudo yum clean all
sudo rm -rf /var/cache/yum

# 메모리 캐시 정리
sudo sh -c 'echo 3 > /proc/sys/vm/drop_caches'

# 백그라운드 프로세스 정리
sudo pkill -f unattended-upgrade

echo "EC2 리소스 최적화 완료"

# 로드
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"


# Node.js 16.20.2 설치 및 사용(설치 안되어있을때만)
if ! nvm ls | grep -q "v16.20.2"; then
     nvm install 16.20.2
fi
nvm use 16.20.2


if ! command -v yarn &> /dev/null; then
    npm install -g yarn
fi

cd /home/ec2-user/JAFAR || exit

# Toast UI 관련 패키지 설치
if [ ! -f package.json ]; then
   echo "Installing base packages"
   yarn add react react-dom react-scripts @toast-ui/editor @toast-ui/react-image-editor tui-image-editor ajv ajv-keywords web-vitals
else
   echo "Update existing packages"
   yarn install --frozen-locklife --production --network-timeout 300000
fi

# 메모리 사용량
free -m
