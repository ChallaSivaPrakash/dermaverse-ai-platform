#!/usr/bin/env bash
# Run from the backend/ directory
set -e

echo "=== Agentic E-Commerce Backend ==="
echo "Installing dependencies..."
pip install -r requirements.txt

echo "Starting FastAPI server on port 8000..."
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
