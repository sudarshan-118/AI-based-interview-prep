#!/bin/bash
# PrepAI Installation Verification Script

echo "🔍 PrepAI Installation Verification"
echo "===================================="
echo ""

# Check Node.js
echo "1️⃣  Checking Node.js..."
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo "   ✅ Node.js installed: $NODE_VERSION"
else
  echo "   ❌ Node.js not found. Please install from https://nodejs.org"
  exit 1
fi

# Check npm
echo ""
echo "2️⃣  Checking npm..."
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm -v)
  echo "   ✅ npm installed: $NPM_VERSION"
else
  echo "   ❌ npm not found"
  exit 1
fi

# Check backend setup
echo ""
echo "3️⃣  Checking backend structure..."
if [ -f "backend/server.js" ]; then
  echo "   ✅ Backend server.js found"
else
  echo "   ❌ Backend not set up correctly"
  exit 1
fi

if [ -f "backend/package.json" ]; then
  echo "   ✅ Backend package.json found"
else
  echo "   ❌ Backend package.json not found"
  exit 1
fi

# Check frontend setup
echo ""
echo "4️⃣  Checking frontend structure..."
if [ -f "frontend/package.json" ]; then
  echo "   ✅ Frontend package.json found"
else
  echo "   ❌ Frontend package.json not found"
  exit 1
fi

if [ -f "frontend/src/App.js" ]; then
  echo "   ✅ Frontend App.js found"
else
  echo "   ❌ Frontend App.js not found"
  exit 1
fi

# Check API key
echo ""
echo "5️⃣  Checking API configuration..."
if [ -f "backend/.env" ]; then
  if grep -q "ANTHROPIC_API_KEY" backend/.env; then
    echo "   ✅ API key configured in backend/.env"
  else
    echo "   ⚠️  .env exists but ANTHROPIC_API_KEY not found"
  fi
else
  echo "   ⚠️  backend/.env not found - you'll need to create it"
fi

# Installation summary
echo ""
echo "===================================="
echo "✅ All checks passed!"
echo ""
echo "Next steps:"
echo "1. cd backend && npm install"
echo "2. Create backend/.env with your API key"
echo "3. npm start (in backend folder)"
echo ""
echo "In another terminal:"
echo "1. cd frontend && npm install"
echo "2. npm start (in frontend folder)"
echo ""
echo "🎉 Ready to start!"
