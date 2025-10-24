#!/bin/bash

# Script để chạy backend API với model cải thiện
echo "🚀 Đang khởi động Backend API với model cải thiện..."

# Chuyển đến thư mục backend
cd backend

# Kiểm tra Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 không được cài đặt. Vui lòng cài đặt Python 3.8+"
    exit 1
fi

# Kiểm tra pip
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 không được cài đặt. Vui lòng cài đặt pip"
    exit 1
fi

# Kích hoạt virtual environment và cài đặt dependencies
echo "📦 Đang kích hoạt virtual environment..."
source venv/bin/activate

echo "📦 Đang cài đặt dependencies..."
pip install -r requirements.txt

# Kiểm tra file insect_info.json
if [ ! -f "../insect_info.json" ]; then
    echo "❌ Không tìm thấy file insect_info.json"
    exit 1
fi

# Chạy API với model cải thiện
echo "🌐 Đang khởi động API server với model cải thiện..."
echo "📍 API sẽ chạy tại: http://localhost:8000"
echo "📖 API Documentation: http://localhost:8000/docs"
echo ""
echo "Nhấn Ctrl+C để dừng server"
echo ""

source venv/bin/activate && python improved_main.py
