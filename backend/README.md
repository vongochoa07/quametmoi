# Backend API - Insect Pest Recognition

## Mô tả
Backend API sử dụng FastAPI để nhận diện côn trùng gây hại từ ảnh lá cây sử dụng mô hình YOLOv8.

## Cài đặt

### 1. Cài đặt dependencies
```bash
pip install -r requirements.txt
```

### 2. Chuẩn bị mô hình
- Chạy script training để train mô hình trên dataset IP102:
```bash
python train_model.py
```

### 3. Chạy API
```bash
python main.py
```

API sẽ chạy tại: http://localhost:8000

## API Endpoints

### 1. Health Check
- **GET** `/health`
- Kiểm tra trạng thái API và mô hình

### 2. Nhận diện côn trùng
- **POST** `/predict`
- Upload ảnh để nhận diện côn trùng
- **Input**: File ảnh (multipart/form-data)
- **Output**: JSON với thông tin côn trùng được nhận diện

### 3. Lấy danh sách côn trùng
- **GET** `/insects`
- Lấy danh sách tất cả 102 loài côn trùng

### 4. Lấy thông tin côn trùng
- **GET** `/insects/{insect_id}`
- Lấy thông tin chi tiết của một loài côn trùng

## Cấu trúc dữ liệu

### Response format cho `/predict`:
```json
{
  "success": true,
  "predictions": [
    {
      "insect_id": "IP001",
      "confidence": 0.95,
      "bounding_box": {
        "x1": 100,
        "y1": 100,
        "x2": 200,
        "y2": 200
      },
      "insect_info": {
        "vietnamese_name": "Rệp sáp bông",
        "scientific_name": "Phenacoccus solenopsis",
        "danger_level": "Cao",
        "affected_crops": "Bông, cà chua, ớt, cà tím",
        "habitat": "Lá cây, thân cây, quả",
        "prevention": "Vệ sinh đồng ruộng, loại bỏ cỏ dại, sử dụng thiên địch",
        "treatment": "Phun thuốc trừ sâu sinh học, dầu neem, xà phòng diệt côn trùng"
      }
    }
  ],
  "total_detections": 1
}
```

## Training Model

### Chuẩn bị dataset
1. Dataset IP102 đã được chuẩn bị sẵn trong thư mục gốc
2. Cấu trúc thư mục:
   ```
   train/
     images/
     labels/
   valid/
     images/
     labels/
   test/
     images/
     labels/
   data.yaml
   ```

### Training
```bash
python train_model.py
```

### Parameters training:
- Model: YOLOv8n (có thể thay đổi)
- Epochs: 100
- Image size: 640x640
- Batch size: 16
- Optimizer: AdamW
- Learning rate: 0.01

## Deployment

### Local development
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Docker (Optional)
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
