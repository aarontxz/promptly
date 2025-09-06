#!/usr/bin/env python3
"""
Development server runner for the FastAPI backend
"""
import subprocess
import sys
import os
from pathlib import Path

def check_venv():
    """Check if virtual environment exists and is activated"""
    venv_path = Path("venv")
    if not venv_path.exists():
        print("❌ Virtual environment not found. Please run setup first:")
        print("   ./setup.sh")
        return False
    
    # Check if we're in a virtual environment
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("⚠️  Virtual environment not activated. Attempting to activate...")
        return False
    
    return True

def install_deps():
    """Install Python dependencies"""
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], check=True)
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies")
        return False

def main():
    """Main function to run the development server"""
    print("🚀 Starting Promptly API development server...")
    
    # Change to the API directory
    api_dir = Path(__file__).parent
    os.chdir(api_dir)
    
    # Install dependencies if needed
    try:
        import fastapi
        import uvicorn
    except ImportError:
        print("📦 Installing dependencies...")
        if not install_deps():
            sys.exit(1)
    
    # Start the server
    try:
        import uvicorn
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
