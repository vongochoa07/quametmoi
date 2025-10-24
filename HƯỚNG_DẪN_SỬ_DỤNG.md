# 🐛 Hướng Dẫn Sử Dụng - Ứng Dụng Nhận Diện Sâu Bệnh AI

## 📋 Tổng Quan

Ứng dụng web thông minh sử dụng công nghệ AI để nhận diện và cung cấp thông tin chi tiết về các loài côn trùng gây hại, giúp nông dân bảo vệ mùa màng hiệu quả.

## 🚀 Cài Đặt Nhanh

### 1. Chạy Backend API
```bash
# Cấp quyền thực thi
chmod +x run_backend.sh

# Chạy backend
./run_backend.sh
```
Backend sẽ chạy tại: http://localhost:8000

### 2. Chạy Frontend (Terminal mới)
```bash
# Cấp quyền thực thi
chmod +x run_frontend.sh

# Chạy frontend
./run_frontend.sh
```
Frontend sẽ chạy tại: http://localhost:3000

## 🎯 Hướng Dẫn Sử Dụng

### 📱 Giao Diện Chính

#### 1. Trang Chủ (Home)
- **Upload ảnh**: Kéo thả ảnh hoặc click để chọn file
- **Chụp ảnh**: Sử dụng camera (sắp có)
- **Phân tích**: Click "Phân Tích Ảnh" để AI nhận diện

#### 2. Kết Quả Nhận Diện
- **Tên côn trùng**: Tên tiếng Việt và khoa học
- **Độ tin cậy**: Phần trăm chính xác
- **Mức độ nguy hiểm**: Rất cao, Cao, Trung bình, Thấp
- **Thông tin chi tiết**: Cây trồng, môi trường, cách phòng chống

#### 3. Danh Sách Côn Trùng
- **Tìm kiếm**: Theo tên, tên khoa học, cây trồng
- **Lọc**: Theo mức độ nguy hiểm
- **Xem chi tiết**: Click vào từng loài

#### 4. Giới Thiệu
- **Tính năng**: AI thông minh, thông tin chi tiết
- **Công nghệ**: YOLOv8, FastAPI, React
- **Liên hệ**: Email, điện thoại, địa chỉ

### 📸 Cách Upload Ảnh

#### Phương pháp 1: Kéo thả
1. Mở thư mục chứa ảnh
2. Kéo ảnh vào vùng upload
3. Thả ảnh vào vùng upload

#### Phương pháp 2: Chọn file
1. Click "Chọn ảnh"
2. Chọn file từ máy tính
3. Click "Open"

#### Yêu cầu ảnh:
- **Định dạng**: JPG, PNG, GIF, BMP, WEBP
- **Kích thước**: Tối đa 10MB
- **Chất lượng**: Ảnh rõ nét, côn trùng dễ nhìn

### 🔍 Đọc Kết Quả

#### Thông tin hiển thị:
1. **Tên côn trùng**: Tên tiếng Việt
2. **Tên khoa học**: Tên Latin
3. **Độ tin cậy**: Phần trăm chính xác (0-100%)
4. **Mức độ nguy hiểm**: 
   - 🔴 Rất cao (đỏ)
   - 🟠 Cao (cam)
   - 🟡 Trung bình (vàng)
   - 🟢 Thấp (xanh)
5. **Cây trồng bị hại**: Danh sách cây trồng
6. **Môi trường sống**: Nơi côn trùng thường xuất hiện
7. **Cách phòng ngừa**: Biện pháp phòng chống
8. **Cách chữa trị**: Phương pháp điều trị

### 📊 Tìm Kiếm Côn Trùng

#### Trong trang "Danh sách côn trùng":
1. **Tìm kiếm**: Nhập tên côn trùng, tên khoa học, hoặc cây trồng
2. **Lọc theo mức độ**: Chọn mức độ nguy hiểm
3. **Xem chi tiết**: Click vào card côn trùng

#### Ví dụ tìm kiếm:
- "rệp" → Tìm tất cả loài rệp
- "lúa" → Tìm côn trùng hại lúa
- "Cao" → Tìm côn trùng mức độ nguy hiểm cao

## 🛠️ Training Mô Hình

### Chuẩn bị dataset
```bash
cd backend
python setup_dataset.py
```

### Training nhanh (test)
```bash
python quick_train.py
# Chọn option 1: Quick training
```

### Training đầy đủ
```bash
python train_model.py
# Hoặc
python quick_train.py
# Chọn option 2: Full training
```

### Test mô hình
```bash
python test_model.py
```

## 🐳 Deploy với Docker

### Chạy local
```bash
# Build và chạy tất cả services
docker-compose up -d

# Kiểm tra status
docker-compose ps

# Xem logs
docker-compose logs -f
```

### Dừng services
```bash
docker-compose down
```

## ☁️ Deploy lên Cloud

### Sử dụng script deploy
```bash
chmod +x deploy.sh
./deploy.sh
```

### Các tùy chọn deploy:
1. **Local Docker Compose**: Chạy trên máy local
2. **Render**: Deploy backend và frontend
3. **Railway**: Deploy full-stack
4. **Vercel**: Deploy frontend
5. **Netlify**: Deploy frontend

## 🔧 Troubleshooting

### Lỗi thường gặp:

#### 1. Backend không chạy được
```bash
# Kiểm tra Python
python3 --version

# Cài đặt dependencies
cd backend
pip3 install -r requirements.txt

# Chạy lại
python3 main.py
```

#### 2. Frontend không chạy được
```bash
# Kiểm tra Node.js
node --version
npm --version

# Cài đặt dependencies
cd frontend
npm install

# Chạy lại
npm start
```

#### 3. API không kết nối được
- Kiểm tra backend đang chạy tại http://localhost:8000
- Kiểm tra CORS configuration
- Kiểm tra file .env trong frontend

#### 4. Model không load được
- Kiểm tra file model tồn tại
- Chạy training trước khi sử dụng
- Kiểm tra đường dẫn model trong main.py

### Logs và Debug:

#### Backend logs:
```bash
# Xem logs backend
tail -f backend.log

# Hoặc khi chạy với Docker
docker-compose logs backend
```

#### Frontend logs:
```bash
# Xem logs trong browser console
# Hoặc khi chạy với Docker
docker-compose logs frontend
```

## 📱 Mobile Usage

### Trên điện thoại:
1. Mở trình duyệt (Chrome, Safari)
2. Truy cập địa chỉ web app
3. Upload ảnh từ thư viện ảnh
4. Chụp ảnh trực tiếp (sắp có)

### Tối ưu cho mobile:
- Giao diện responsive
- Touch-friendly
- Tải nhanh
- Hoạt động offline (sắp có)

## 🔒 Bảo Mật

### Dữ liệu:
- Ảnh không được lưu trữ
- Chỉ xử lý tạm thời
- Không chia sẻ với bên thứ 3

### API:
- CORS được cấu hình
- Rate limiting (sắp có)
- Authentication (sắp có)

## 📈 Performance

### Tối ưu:
- Model được cache
- Ảnh được nén
- CDN cho static files
- Database indexing

### Monitoring:
- Health check endpoints
- Error tracking
- Performance metrics
- User analytics

## 🤝 Support

### Liên hệ:
- **Email**: support@pestai.com
- **Phone**: +84 123 456 789
- **GitHub**: [Issues](https://github.com/your-repo/issues)

### FAQ:
- **Q**: Tại sao kết quả không chính xác?
- **A**: Đảm bảo ảnh rõ nét, côn trùng dễ nhìn, thử ảnh khác

- **Q**: App chạy chậm?
- **A**: Kiểm tra kết nối internet, thử ảnh nhỏ hơn

- **Q**: Không tìm thấy côn trùng?
- **A**: App chỉ nhận diện 102 loài trong dataset IP102

## 🔄 Updates

### Version 1.0.0:
- ✅ Nhận diện 102 loài côn trùng
- ✅ Giao diện responsive
- ✅ API FastAPI
- ✅ Frontend React

### Sắp có:
- 📷 Camera integration
- 🔍 Tìm kiếm nâng cao
- 📊 Analytics dashboard
- 🌐 Multi-language support
- 📱 Mobile app

---

**Made with ❤️ for Vietnamese farmers**
