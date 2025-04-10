#!/bin/bash
cd "$(dirname "$0")"
echo "Starting Mental Health RAG API server..."
python src/api_server.py
