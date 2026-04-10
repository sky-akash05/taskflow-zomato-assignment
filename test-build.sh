#!/bin/bash

echo "🚀 Building TaskFlow Application..."
echo ""
echo "This will take 2-3 minutes on first run..."
echo "Subsequent builds will be much faster."
echo ""

# Build the images
docker compose build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "Now run: docker compose up"
    echo ""
    echo "Then open: http://localhost:3000"
    echo "Login with: test@example.com / password123"
else
    echo ""
    echo "❌ Build failed. Check the error messages above."
    exit 1
fi
