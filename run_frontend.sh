#!/bin/bash

# Script để chạy frontend React
echo "🚀 Đang khởi động Frontend React..."

# Chuyển đến thư mục frontend
cd frontend

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js không được cài đặt. Vui lòng cài đặt Node.js 16+"
    exit 1
fi

# Kiểm tra npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm không được cài đặt. Vui lòng cài đặt npm"
    exit 1
fi

# Cài đặt dependencies
echo "📦 Đang cài đặt dependencies..."
npm install

# Tạo file .env nếu chưa có
if [ ! -f ".env" ]; then
    echo "📝 Đang tạo file .env..."
    echo "REACT_APP_API_URL=http://localhost:8000" > .env
fi

# Chạy development server
echo "🌐 Đang khởi động React development server..."
echo "📍 Frontend sẽ chạy tại: http://localhost:3000"
echo ""
echo "Nhấn Ctrl+C để dừng server"
echo ""

npm start
