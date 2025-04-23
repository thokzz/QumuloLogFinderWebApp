#!/bin/bash

echo "🛑 Stopping backend and frontend..."

# Kill backend (Flask on port 5000)
pkill -f "python3 backend/app.py"

# Kill frontend (React dev server on port 3000)
pkill -f "react-scripts start"
pkill -f "node .*start\.js"

echo "✅ All services stopped"
