#!/bin/bash

echo "===== Starting Comprehensive Server Diagnostic ====="

echo "1. Checking if server is running..."
if pgrep -f "http-server" > /dev/null
then
    echo "Server is running."
else
    echo "Server is not running. Starting server..."
    http-server build -p 3000 --cors -a 0.0.0.0 > app.log 2>&1 &
    sleep 5
fi

echo "2. Checking local access..."
if curl -s http://localhost:3000 > /dev/null
then
    echo "Local access successful."
else
    echo "Local access failed. Check server logs."
fi

echo "3. Checking listening ports..."
sudo netstat -tulpn | grep :3000

echo "4. Checking firewall rules..."
sudo iptables -L | grep 3000

echo "5. Network interface information:"
ip addr show

echo "6. Attempting telnet connection..."
timeout 5 telnet localhost 3000 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "Telnet connection successful."
else
    echo "Telnet connection failed."
fi

echo "7. Curl test with full response:"
curl -i http://localhost:3000

echo "8. Last 10 lines of server log:"
tail -n 10 app.log

echo "===== Diagnostic Complete ====="
echo "If all checks passed but you still can't access from outside:"
echo "1. Confirm your EC2 public IP address in AWS console"
echo "2. Verify EC2 security group allows inbound traffic on port 3000"
echo "3. Try accessing http://[YOUR_EC2_PUBLIC_IP]:3000 from a browser"
