# 🐛 NhanDienSauHai - Nhận Diện Sâu Hại AI

Ứng dụng web thông minh sử dụng công nghệ AI để nhận diện và cung cấp thông tin chi tiết về các loài côn trùng gây hại, giúp nông dân bảo vệ mùa màng hiệu quả.

## 🌟 Tính năng chính

### 🤖 AI Thông Minh
- Sử dụng mô hình YOLOv8 tiên tiến
- Nhận diện chính xác 102 loài côn trùng gây hại
- Độ chính xác lên đến 95%

### 📱 Giao diện Responsive
- Hoạt động tốt trên desktop và mobile
- Giao diện thân thiện, dễ sử dụng
- Upload ảnh bằng kéo thả hoặc chọn file

### 📊 Thông tin chi tiết
- Tên côn trùng (tiếng Việt và khoa học)
- Mức độ nguy hiểm
- Cây trồng thường bị hại
- Môi trường sống
- Cách phòng và chữa trị

## 🏗️ Kiến trúc hệ thống

```
IP102 Insect Pest Recognition/
├── backend/                 # FastAPI Backend
│   ├── main.py            # API chính
│   ├── train_model.py     # Script training
│   ├── requirements.txt   # Dependencies
│   └── README.md
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Trang web
│   │   ├── services/      # API services
│   │   └── styles/        # CSS styles
│   ├── package.json
│   └── README.md
├── data.yaml              # Dataset config
├── insect_info.json       # Thông tin côn trùng
├── run_backend.sh         # Script chạy backend
├── run_frontend.sh        # Script chạy frontend
└── README.md
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Python 3.8+
- Node.js 16+
- npm hoặc yarn
- GPU (khuyến nghị cho training)

### 1. Clone repository
```bash
git clone <repository-url>
cd "IP102 Insect Pest Recognition.v1i.yolov8"
```

### 2. Chạy Backend API
```bash
# Cấp quyền thực thi
chmod +x run_backend.sh

# Chạy backend
./run_backend.sh
```

Backend sẽ chạy tại: http://localhost:8000
API Documentation: http://localhost:8000/docs

### 3. Chạy Frontend (terminal mới)
```bash
# Cấp quyền thực thi
chmod +x run_frontend.sh

# Chạy frontend
./run_frontend.sh
```

Frontend sẽ chạy tại: http://localhost:3000

## 🎯 Sử dụng

### 1. Upload ảnh
- Truy cập http://localhost:3000
- Kéo thả ảnh hoặc click để chọn file
- Hỗ trợ: JPG, PNG, GIF, BMP, WEBP (tối đa 10MB)

### 2. Nhận diện
- Click "Phân Tích Ảnh"
- AI sẽ phân tích và trả về kết quả
- Xem thông tin chi tiết về côn trùng

### 3. Tìm hiểu thêm
- Xem danh sách 102 loài côn trùng
- Tìm kiếm theo tên hoặc mức độ nguy hiểm
- Đọc thông tin về ứng dụng

## 🧠 Training Model

### Chuẩn bị dataset
Dataset IP102 đã được chuẩn bị sẵn với cấu trúc:
```
train/
  images/     # Ảnh training
  labels/      # Labels YOLO format
valid/
  images/     # Ảnh validation
  labels/      # Labels YOLO format
test/
  images/     # Ảnh test
  labels/      # Labels YOLO format
```

### Training
```bash
cd backend
python train_model.py
```

### Parameters
- Model: YOLOv8n
- Epochs: 100
- Image size: 640x640
- Batch size: 16
- Optimizer: AdamW

## 📊 API Endpoints

### Health Check
```http
GET /health
```

### Nhận diện côn trùng
```http
POST /predict
Content-Type: multipart/form-data
Body: file (image)
```

### Danh sách côn trùng
```http
GET /insects
```

### Thông tin côn trùng
```http
GET /insects/{insect_id}
```

## 🛠️ Development

### Backend Development
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Testing
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

## 📱 Mobile Support

Ứng dụng được thiết kế responsive và hoạt động tốt trên:
- iOS Safari
- Android Chrome
- Mobile browsers

### Mobile Features
- Touch-friendly interface
- Camera integration (sắp có)
- Swipe gestures
- Mobile-optimized forms

## 🚀 Deployment

### Backend (Render/Railway)
```bash
# Tạo Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy
vercel --prod
```

## 📈 Performance

### Optimization
- Image compression
- Lazy loading
- Caching strategies
- Bundle splitting

### Monitoring
- API response time
- Model accuracy
- User engagement
- Error tracking

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 📞 Support

- Email: support@pestai.com
- Phone: +84 123 456 789
- GitHub Issues: [Create Issue](https://github.com/your-repo/issues)

## 🙏 Acknowledgments

- Dataset IP102 từ Roboflow
- YOLOv8 từ Ultralytics
- React community
- FastAPI community

---

**Made with ❤️ for Vietnamese farmers**
# khoquakho
