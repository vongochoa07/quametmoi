from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import os
from PIL import Image
import io
import numpy as np
import random
import time
from typing import Dict, Any
import logging
from monitoring import log_prediction, get_system_status

# Thiết lập logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Insect Pest Recognition API", version="1.0.0")

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

# Khởi tạo
insect_info = load_insect_info()

# Danh sách côn trùng phổ biến để mock
COMMON_INSECTS = [
    "IP001", "IP002", "IP003", "IP004", "IP005", "IP006", "IP007", "IP008", "IP009", "IP010",
    "IP011", "IP012", "IP013", "IP014", "IP015", "IP016", "IP017", "IP018", "IP019", "IP020"
]

def analyze_image_mock(image_array):
    """
    Mock AI analysis - trả về kết quả giả lập dựa trên đặc điểm ảnh
    """
    # Phân tích đặc điểm ảnh đơn giản
    height, width = image_array.shape[:2]
    
    # Tính toán các đặc điểm cơ bản
    gray = np.mean(image_array, axis=2)
    brightness = np.mean(gray)
    contrast = np.std(gray)
    
    # Tạo kết quả dựa trên đặc điểm ảnh
    predictions = []
    
    # Số lượng detections (1-3)
    num_detections = random.randint(1, 3)
    
    for i in range(num_detections):
        # Chọn côn trùng ngẫu nhiên
        insect_id = random.choice(COMMON_INSECTS)
        
        # Tính confidence dựa trên đặc điểm ảnh
        base_confidence = 0.6 + (brightness / 255) * 0.2 + (contrast / 100) * 0.1
        confidence = min(0.95, max(0.3, base_confidence + random.uniform(-0.1, 0.1)))
        
        # Tạo bounding box
        x1 = random.uniform(0.1, 0.7) * width
        y1 = random.uniform(0.1, 0.7) * height
        x2 = min(width, x1 + random.uniform(50, 200))
        y2 = min(height, y1 + random.uniform(50, 200))
        
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
            "confidence": confidence,
            "bounding_box": {
                "x1": float(x1),
                "y1": float(y1),
                "x2": float(x2),
                "y2": float(y2)
            },
            "insect_info": insect_data
        })
    
    # Sắp xếp theo confidence
    predictions.sort(key=lambda x: x["confidence"], reverse=True)
    
    return predictions

@app.get("/")
async def root():
    return {"message": "NhanDienSauHai API (Mock AI)", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": True, "ai_type": "mock"}

@app.get("/status")
async def system_status():
    """Lấy trạng thái hệ thống chi tiết"""
    return get_system_status()

@app.post("/predict")
async def predict_insect(file: UploadFile = File(...)):
    """
    Nhận diện côn trùng từ ảnh upload (Mock AI)
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
        
        # Resize ảnh
        image = image.resize((640, 640), Image.Resampling.LANCZOS)
        
        # Chuyển đổi sang numpy array
        image_array = np.array(image)
        
        # Đo thời gian xử lý
        start_time = time.time()
        predictions = analyze_image_mock(image_array)
        processing_time = time.time() - start_time
        
        # Log prediction
        for prediction in predictions:
            log_prediction(
                image_size=len(contents),
                processing_time=processing_time,
                confidence=prediction["confidence"],
                insect_id=prediction["insect_id"]
            )
        
        return {
            "success": True,
            "predictions": predictions,
            "total_detections": len(predictions),
            "model_info": {
                "model_name": "Mock AI (Demo)",
                "confidence_threshold": 0.3,
                "processing_time": processing_time,
                "note": "Đây là phiên bản demo. Model thật sẽ được train với dataset IP102."
            }
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
