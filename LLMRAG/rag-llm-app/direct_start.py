"""
Use this script as a direct entry point to test the API server.
It helps avoid module import issues.
"""

import sys
import os
from pathlib import Path

# Add src directory to Python path
current_path = Path(__file__).parent
src_path = current_path / "src"
sys.path.append(str(src_path))

# Import and run the server
try:
    print("Starting API server directly...")
    from src.api_server import app
    import uvicorn
    
    uvicorn.run(
        app, 
        host="127.0.0.1",
        port=6000,
        log_level="debug"
    )
except Exception as e:
    print(f"Error starting server: {e}")
    import traceback
    traceback.print_exc()
