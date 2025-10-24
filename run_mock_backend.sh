#!/bin/bash

# Script để chạy backend API với Mock AI
echo "🚀 Đang khởi động Backend API với Mock AI..."

# Chuyển đến thư mục backend
cd backend

# Kiểm tra Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 không được cài đặt. Vui lòng cài đặt Python 3.8+"
    exit 1
fi

# Kích hoạt virtual environment
echo "📦 Đang kích hoạt virtual environment..."
source venv/bin/activate

# Kiểm tra file insect_info.json
if [ ! -f "../insect_info.json" ]; then
    echo "❌ Không tìm thấy file insect_info.json"
    exit 1
fi

# Chạy API với Mock AI
echo "🌐 Đang khởi động API server với Mock AI..."
echo "📍 API sẽ chạy tại: http://localhost:8000"
echo "📖 API Documentation: http://localhost:8000/docs"
echo "🤖 AI Type: Mock AI (Demo)"
echo ""
echo "Nhấn Ctrl+C để dừng server"
echo ""

source venv/bin/activate && python mock_ai_main.py
