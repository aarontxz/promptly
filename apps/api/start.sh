#!/bin/bash

# Deployment script that works both locally and in cloud environments

echo "🐍 Setting up Python environment..."

# Check if we're in a local development environment
if [ -f "/Users/tengxinzhuan/promptly/.venv/bin/python" ]; then
    echo "📍 Using local virtual environment"
    PYTHON_PATH="/Users/tengxinzhuan/promptly/.venv/bin/python"
    PIP_PATH="/Users/tengxinzhuan/promptly/.venv/bin/pip"
else
    echo "☁️ Using system Python (deployment environment)"
    PYTHON_PATH="python"
    PIP_PATH="pip"
fi

# Install dependencies
echo "📦 Installing dependencies..."
$PIP_PATH install -r requirements.txt

# Start the application
echo "🚀 Starting FastAPI server..."
$PYTHON_PATH main.py
