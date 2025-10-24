#!/bin/bash

# 🚀 Auto Deploy Script - IP102 Insect Pest Recognition
# Tự động deploy toàn bộ hệ thống lên cloud

echo "🚀 IP102 Insect Pest Recognition - Auto Deploy"
echo "=============================================="

# Màu sắc
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Kiểm tra dependencies
check_dependencies() {
    print_info "Đang kiểm tra dependencies..."
    
    # Kiểm tra Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker chưa được cài đặt"
        print_info "Cài đặt: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    # Kiểm tra Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose chưa được cài đặt"
        exit 1
    fi
    
    # Kiểm tra Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js chưa được cài đặt"
        print_info "Cài đặt: https://nodejs.org/"
        exit 1
    fi
    
    # Kiểm tra Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python3 chưa được cài đặt"
        exit 1
    fi
    
    print_success "Tất cả dependencies đã sẵn sàng"
}

# Build và test backend
build_backend() {
    print_info "🔧 Đang build backend..."
    
    cd backend
    
    # Tạo virtual environment
    if [ ! -d "venv" ]; then
        print_info "Tạo virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Cài đặt dependencies
    print_info "Cài đặt Python dependencies..."
    pip install -r requirements.txt
    
    # Test backend
    print_info "Test backend API..."
    python -c "
import sys
sys.path.append('.')
from main import app
print('Backend API test passed')
"
    
    if [ $? -eq 0 ]; then
        print_success "Backend build thành công"
    else
        print_error "Backend build thất bại"
        exit 1
    fi
    
    cd ..
}

# Build và test frontend
build_frontend() {
    print_info "🎨 Đang build frontend..."
    
    cd frontend
    
    # Cài đặt dependencies
    print_info "Cài đặt Node.js dependencies..."
    npm install
    
    # Build production
    print_info "Build production..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Frontend build thành công"
    else
        print_error "Frontend build thất bại"
        exit 1
    fi
    
    cd ..
}

# Deploy với Docker
deploy_docker() {
    print_info "🐳 Đang deploy với Docker..."
    
    # Build Docker images
    print_info "Building Docker images..."
    docker-compose build --no-cache
    
    if [ $? -eq 0 ]; then
        print_success "Docker images built thành công"
    else
        print_error "Docker build thất bại"
        exit 1
    fi
    
    # Start services
    print_info "Starting services..."
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        print_success "Services started successfully"
    else
        print_error "Failed to start services"
        exit 1
    fi
    
    # Health check
    print_info "Đang kiểm tra health..."
    sleep 10
    
    # Check backend
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_warning "Backend health check failed"
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is healthy"
    else
        print_warning "Frontend health check failed"
    fi
}

# Deploy lên Vercel
deploy_vercel() {
    print_info "☁️  Đang deploy lên Vercel..."
    
    # Kiểm tra Vercel CLI
    if ! command -v vercel &> /dev/null; then
        print_info "Cài đặt Vercel CLI..."
        npm install -g vercel
    fi
    
    cd frontend
    
    # Deploy
    print_info "Deploying to Vercel..."
    vercel --prod --yes
    
    if [ $? -eq 0 ]; then
        print_success "Frontend deployed to Vercel successfully"
    else
        print_error "Vercel deployment failed"
        exit 1
    fi
    
    cd ..
}

# Deploy lên Railway
deploy_railway() {
    print_info "🚂 Đang deploy lên Railway..."
    
    # Kiểm tra Railway CLI
    if ! command -v railway &> /dev/null; then
        print_info "Cài đặt Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # Login Railway
    railway login
    
    # Deploy backend
    cd backend
    railway up --detach
    
    if [ $? -eq 0 ]; then
        print_success "Backend deployed to Railway successfully"
    else
        print_error "Railway backend deployment failed"
        exit 1
    fi
    
    cd ..
}

# Tạo production config
create_production_config() {
    print_info "📝 Tạo production configuration..."
    
    # Backend production config
    cat > backend/.env.production << EOF
ENVIRONMENT=production
DEBUG=False
LOG_LEVEL=INFO
CORS_ORIGINS=["https://your-frontend-domain.vercel.app"]
EOF
    
    # Frontend production config
    cat > frontend/.env.production << EOF
REACT_APP_API_URL=https://your-backend-domain.railway.app
REACT_APP_ENVIRONMENT=production
EOF
    
    print_success "Production config created"
}

# Tạo monitoring script
create_monitoring() {
    print_info "📊 Tạo monitoring script..."
    
    cat > monitor.sh << 'EOF'
#!/bin/bash

# Monitoring script for IP102 Insect Pest Recognition

echo "🔍 IP102 System Monitoring"
echo "========================="

# Check Docker containers
echo "🐳 Docker Containers:"
docker-compose ps

echo ""

# Check system resources
echo "💻 System Resources:"
echo "CPU Usage:"
top -l 1 | grep "CPU usage"

echo "Memory Usage:"
top -l 1 | grep "PhysMem"

echo ""

# Check API health
echo "🏥 API Health Check:"
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend API: Healthy"
else
    echo "❌ Backend API: Unhealthy"
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: Healthy"
else
    echo "❌ Frontend: Unhealthy"
fi

echo ""

# Check logs
echo "📋 Recent Logs:"
echo "Backend logs (last 10 lines):"
docker-compose logs --tail=10 backend

echo ""
echo "Frontend logs (last 10 lines):"
docker-compose logs --tail=10 frontend
EOF
    
    chmod +x monitor.sh
    print_success "Monitoring script created"
}

# Main deployment function
main() {
    echo "🎯 IP102 Insect Pest Recognition - Auto Deploy"
    echo "============================================="
    
    # Check dependencies
    check_dependencies
    
    # Build components
    build_backend
    build_frontend
    
    # Create production config
    create_production_config
    
    # Create monitoring
    create_monitoring
    
    echo ""
    echo "Chọn phương thức deploy:"
    echo "1. Local Docker (Recommended for development)"
    echo "2. Vercel + Railway (Production)"
    echo "3. Both"
    echo ""
    
    read -p "Nhập lựa chọn (1-3): " choice
    
    case $choice in
        1)
            deploy_docker
            ;;
        2)
            deploy_vercel
            deploy_railway
            ;;
        3)
            deploy_docker
            deploy_vercel
            deploy_railway
            ;;
        *)
            print_error "Lựa chọn không hợp lệ"
            exit 1
            ;;
    esac
    
    echo ""
    print_success "🎉 Deployment hoàn thành!"
    echo ""
    echo "📊 System Status:"
    echo "   - Backend: http://localhost:8000"
    echo "   - Frontend: http://localhost:3000"
    echo "   - API Docs: http://localhost:8000/docs"
    echo ""
    echo "🔧 Management Commands:"
    echo "   - Monitor: ./monitor.sh"
    echo "   - Stop: docker-compose down"
    echo "   - Restart: docker-compose restart"
    echo "   - Logs: docker-compose logs -f"
    echo ""
    print_info "Hệ thống đã sẵn sàng sử dụng! 🚀"
}

# Chạy main function
main
