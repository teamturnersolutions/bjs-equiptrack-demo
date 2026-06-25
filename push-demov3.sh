#!/bin/bash
# Script to build, tag, and push demov3 image to Docker Hub
set -e

echo "🔄 Staging TeamFeud files..."
node copy-feud.js

echo "📦 Building Docker image: teamturnersolutions/equiptrack:demov3..."
docker build -t teamturnersolutions/equiptrack:demov3 .

echo "🚀 Pushing image to Docker Hub..."
docker push teamturnersolutions/equiptrack:demov3

echo "🧹 Cleaning up staged files..."
rm -rf team-feud-src

echo "✅ Successfully built and pushed teamturnersolutions/equiptrack:demov3 to Docker Hub!"
