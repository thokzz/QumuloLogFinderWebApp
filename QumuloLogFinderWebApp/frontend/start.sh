#!/bin/bash

echo "🔁 Killing any previous backend/frontend processes..."

# Kill old backend (port 5000)
pkill -f "python3 backend/app.py"

# Kill old frontend (port 3000)
pkill -f "node .*react-scripts/start.js"

sleep 2

echo "🚀 Starting backend..."
cd /scripts/log_finder
nohup bash -c 'PYTHONPATH=. python3 backend/app.py' > backend.log 2>&1 &

echo "🌐 Starting frontend..."
cd frontend
nohup npm start > frontend.log 2>&1 &

echo "🔄 Restarting Nginx..."
sudo systemctl restart nginx

echo "✅ All services started and running in background"

