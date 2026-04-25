#!/bin/bash
# PrepAI - Automatic Installation Script

set -e

echo "======================================"
echo "🚀 PrepAI - Installation Assistant"
echo "======================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to print success
success() {
  echo -e "${GREEN}✅ $1${NC}"
}

# Function to print error
error() {
  echo -e "${RED}❌ $1${NC}"
  exit 1
}

# Function to print info
info() {
  echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check Node.js
info "Checking prerequisites..."
if ! command -v node &> /dev/null; then
  error "Node.js not found. Please install from https://nodejs.org (v16+)"
fi
success "Node.js found: $(node -v)"

if ! command -v npm &> /dev/null; then
  error "npm not found"
fi
success "npm found: $(npm -v)"

# Get API key
echo ""
info "IMPORTANT: You need an Anthropic API key"
info "Get it from: https://console.anthropic.com/"
echo ""
read -p "Paste your Anthropic API key (starts with sk-): " API_KEY

if [[ -z "$API_KEY" ]]; then
  error "API key cannot be empty"
fi

success "API key received"

# Create backend .env
echo ""
info "Setting up backend..."
cd backend 2>/dev/null || error "Backend folder not found"

if [ -f .env ]; then
  info ".env already exists"
else
  cat > .env << EOF
PORT=5000
ANTHROPIC_API_KEY=$API_KEY
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
EOF
  success "Created backend/.env"
fi

# Install backend dependencies
if [ -d "node_modules" ]; then
  success "Backend dependencies already installed"
else
  info "Installing backend dependencies... (this may take a minute)"
  npm install > /dev/null 2>&1
  success "Backend dependencies installed"
fi

# Create frontend .env
echo ""
info "Setting up frontend..."
cd ../frontend 2>/dev/null || error "Frontend folder not found"

if [ -f .env ]; then
  info ".env already exists"
else
  echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
  success "Created frontend/.env"
fi

# Install frontend dependencies
if [ -d "node_modules" ]; then
  success "Frontend dependencies already installed"
else
  info "Installing frontend dependencies... (this may take a minute)"
  npm install > /dev/null 2>&1
  success "Frontend dependencies installed"
fi

# Done
echo ""
echo "======================================"
echo "🎉 Installation Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo ""
echo "1️⃣  Start Backend (in new terminal):"
echo "   cd backend"
echo "   npm start"
echo "   ➜ Backend runs on http://localhost:5000"
echo ""
echo "2️⃣  Start Frontend (in another terminal):"
echo "   cd frontend"
echo "   npm start"
echo "   ➜ Frontend runs on http://localhost:3000"
echo ""
echo "3️⃣  Open browser:"
echo "   http://localhost:3000"
echo ""
echo "======================================"
echo "📚 Documentation:"
echo "   - GETTING_STARTED.md - Quick start guide"
echo "   - README.md - Full documentation"
echo ""
echo "🎯 Start practicing interviews now!"
echo "======================================"
