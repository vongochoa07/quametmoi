#!/bin/bash

# Script deploy hệ thống lên cloud
echo "🚀 IP102 Insect Pest Recognition - Deploy Script"
echo "=" * 60

# Màu sắc cho output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Hàm in màu
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
        exit 1
    fi
    
    # Kiểm tra Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose chưa được cài đặt"
        exit 1
    fi
    
    print_success "Dependencies OK"
}

# Build và chạy với Docker Compose
deploy_local() {
    print_info "Đang deploy local với Docker Compose..."
    
    # Build images
    print_info "Building Docker images..."
    docker-compose build
    
    if [ $? -eq 0 ]; then
        print_success "Build thành công"
    else
        print_error "Build thất bại"
        exit 1
    fi
    
    # Start services
    print_info "Starting services..."
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        print_success "Services started successfully"
        print_info "Backend: http://localhost:8000"
        print_info "Frontend: http://localhost:3000"
        print_info "API Docs: http://localhost:8000/docs"
    else
        print_error "Failed to start services"
        exit 1
    fi
}

# Deploy lên Render
deploy_render() {
    print_info "Deploy lên Render..."
    
    # Kiểm tra Render CLI
    if ! command -v render &> /dev/null; then
        print_warning "Render CLI chưa được cài đặt"
        print_info "Cài đặt: npm install -g @render/cli"
        return 1
    fi
    
    # Deploy backend
    print_info "Deploying backend..."
    cd backend
    render deploy
    
    if [ $? -eq 0 ]; then
        print_success "Backend deployed successfully"
    else
        print_error "Backend deployment failed"
        return 1
    fi
    
    cd ..
    
    # Deploy frontend
    print_info "Deploying frontend..."
    cd frontend
    render deploy
    
    if [ $? -eq 0 ]; then
        print_success "Frontend deployed successfully"
    else
        print_error "Frontend deployment failed"
        return 1
    fi
    
    cd ..
}

# Deploy lên Railway
deploy_railway() {
    print_info "Deploy lên Railway..."
    
    # Kiểm tra Railway CLI
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI chưa được cài đặt"
        print_info "Cài đặt: npm install -g @railway/cli"
        return 1
    fi
    
    # Login Railway
    railway login
    
    # Deploy
    railway up
    
    if [ $? -eq 0 ]; then
        print_success "Deployed to Railway successfully"
    else
        print_error "Railway deployment failed"
        return 1
    fi
}

# Deploy lên Vercel
deploy_vercel() {
    print_info "Deploy frontend lên Vercel..."
    
    # Kiểm tra Vercel CLI
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI chưa được cài đặt"
        print_info "Cài đặt: npm install -g vercel"
        return 1
    fi
    
    cd frontend
    
    # Build
    npm run build
    
    # Deploy
    vercel --prod
    
    if [ $? -eq 0 ]; then
        print_success "Frontend deployed to Vercel successfully"
    else
        print_error "Vercel deployment failed"
        return 1
    fi
    
    cd ..
}

# Deploy lên Netlify
deploy_netlify() {
    print_info "Deploy frontend lên Netlify..."
    
    # Kiểm tra Netlify CLI
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI chưa được cài đặt"
        print_info "Cài đặt: npm install -g netlify-cli"
        return 1
    fi
    
    cd frontend
    
    # Build
    npm run build
    
    # Deploy
    netlify deploy --prod --dir=build
    
    if [ $? -eq 0 ]; then
        print_success "Frontend deployed to Netlify successfully"
    else
        print_error "Netlify deployment failed"
        return 1
    fi
    
    cd ..
}

# Health check
health_check() {
    print_info "Đang kiểm tra health..."
    
    # Check backend
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_error "Backend is not responding"
        return 1
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is healthy"
    else
        print_error "Frontend is not responding"
        return 1
    fi
}

# Stop services
stop_services() {
    print_info "Stopping services..."
    docker-compose down
    
    if [ $? -eq 0 ]; then
        print_success "Services stopped"
    else
        print_error "Failed to stop services"
    fi
}

# Clean up
cleanup() {
    print_info "Cleaning up..."
    docker-compose down -v
    docker system prune -f
    
    print_success "Cleanup completed"
}

# Main menu
show_menu() {
    echo ""
    echo "Chọn phương thức deploy:"
    echo "1. Local Docker Compose"
    echo "2. Render"
    echo "3. Railway"
    echo "4. Vercel (Frontend only)"
    echo "5. Netlify (Frontend only)"
    echo "6. Health Check"
    echo "7. Stop Services"
    echo "8. Cleanup"
    echo "9. Exit"
    echo ""
}

# Main function
main() {
    check_dependencies
    
    while true; do
        show_menu
        read -p "Nhập lựa chọn (1-9): " choice
        
        case $choice in
            1)
                deploy_local
                ;;
            2)
                deploy_render
                ;;
            3)
                deploy_railway
                ;;
            4)
                deploy_vercel
                ;;
            5)
                deploy_netlify
                ;;
            6)
                health_check
                ;;
            7)
                stop_services
                ;;
            8)
                cleanup
                ;;
            9)
                print_info "Goodbye!"
                exit 0
                ;;
            *)
                print_error "Lựa chọn không hợp lệ"
                ;;
        esac
        
        echo ""
        read -p "Nhấn Enter để tiếp tục..."
    done
}

# Chạy script
main
