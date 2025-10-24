from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import os
from PIL import Image
import io
import numpy as np
from ultralytics import YOLO
import cv2
from typing import Dict, Any
import logging
import time
from monitoring import log_prediction, get_system_status

# Thiết lập logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Insect Pest Recognition API", version="1.0.0")

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production nên hạn chế domain cụ thể
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load thông tin côn trùng
def load_insect_info():
    try:
        with open("../insect_info.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        logger.error("Không tìm thấy file insect_info.json")
        return {"insects": {}}

# Load mô hình YOLO (sẽ được thay thế bằng mô hình đã train)
def load_model():
    try:
        # Thử load mô hình đã train trước, nếu không có thì dùng mô hình mặc định
        model_paths = [
            '../runs/train/ip102_auto_quick/weights/best.pt',
            'runs/train/ip102_quick_test/weights/best.pt',
            'runs/train/ip102_full_training/weights/best.pt', 
            'runs/train/ip102_insect_detection/weights/best.pt',
            'yolov8n.pt'  # Fallback
        ]
        
        for model_path in model_paths:
            if os.path.exists(model_path):
                logger.info(f"Loading model: {model_path}")
                model = YOLO(model_path)
                return model
        
        # Nếu không tìm thấy model nào
        logger.warning("Không tìm thấy model đã train, sử dụng YOLOv8n mặc định")
        model = YOLO('yolov8n.pt')
        return model
        
    except Exception as e:
        logger.error(f"Lỗi khi load mô hình: {e}")
        return None

# Khởi tạo
insect_info = load_insect_info()
model = load_model()

@app.get("/")
async def root():
    return {"message": "NhanDienSauHai API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.get("/status")
async def system_status():
    """Lấy trạng thái hệ thống chi tiết"""
    return get_system_status()

@app.post("/predict")
async def predict_insect(file: UploadFile = File(...)):
    """
    Nhận diện côn trùng từ ảnh upload
    """
    try:
        # Kiểm tra file
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File phải là ảnh")
        
        # Đọc ảnh
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Chuyển đổi sang RGB nếu cần
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Chuyển đổi sang numpy array
        image_array = np.array(image)
        
        # Dự đoán với YOLO
        if model is None:
            raise HTTPException(status_code=500, detail="Mô hình chưa được load")
        
        # Đo thời gian xử lý
        start_time = time.time()
        results = model(image_array)
        processing_time = time.time() - start_time
        
        # Xử lý kết quả
        predictions = []
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    # Lấy thông tin từ box
                    conf = float(box.conf[0])
                    cls = int(box.cls[0])
                    
                    # Tạo ID côn trùng (giả sử có 102 loài)
                    insect_id = f"IP{cls + 1:03d}"
                    
                    # Lấy thông tin côn trùng
                    insect_data = insect_info.get("insects", {}).get(insect_id, {
                        "vietnamese_name": f"Côn trùng {insect_id}",
                        "scientific_name": "Unknown",
                        "danger_level": "Không xác định",
                        "affected_crops": "Không xác định",
                        "habitat": "Không xác định",
                        "prevention": "Không xác định",
                        "treatment": "Không xác định"
                    })
                    
                    predictions.append({
                        "insect_id": insect_id,
                        "confidence": conf,
                        "bounding_box": {
                            "x1": float(box.xyxy[0][0]),
                            "y1": float(box.xyxy[0][1]),
                            "x2": float(box.xyxy[0][2]),
                            "y2": float(box.xyxy[0][3])
                        },
                        "insect_info": insect_data
                    })
                    
                    # Log prediction cho monitoring
                    log_prediction(
                        image_size=len(contents),
                        processing_time=processing_time,
                        confidence=conf,
                        insect_id=insect_id
                    )
        
        # Sắp xếp theo confidence
        predictions.sort(key=lambda x: x["confidence"], reverse=True)
        
        return {
            "success": True,
            "predictions": predictions,
            "total_detections": len(predictions)
        }
        
    except Exception as e:
        logger.error(f"Lỗi khi xử lý ảnh: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý ảnh: {str(e)}")

@app.get("/insects")
async def get_insects():
    """
    Lấy danh sách tất cả côn trùng
    """
    return {
        "success": True,
        "insects": insect_info.get("insects", {}),
        "total": len(insect_info.get("insects", {}))
    }

@app.get("/insects/{insect_id}")
async def get_insect_info(insect_id: str):
    """
    Lấy thông tin chi tiết của một loài côn trùng
    """
    insect_data = insect_info.get("insects", {}).get(insect_id)
    if not insect_data:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin côn trùng")
    
    return {
        "success": True,
        "insect_id": insect_id,
        "insect_info": insect_data
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
