#!/usr/bin/env python3
"""
Simple development runner for the FastAPI backend
Run this script from the api directory to start the development server
"""
import subprocess
import sys
import os
from pathlib import Path

def main():
    """Start the development server"""
    # Change to the API directory if not already there
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Start the server using the current Python interpreter
    python_path = sys.executable
    
    print("🚀 Starting Promptly FastAPI development server...")
    print(f"📍 API will be available at: http://localhost:8000")
    print(f"📖 API docs will be available at: http://localhost:8000/docs")
    print(f"🔄 Auto-reload is enabled for development")
    print("=" * 50)
    
    try:
        subprocess.run([python_path, "main.py"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
