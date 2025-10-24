"""
Offline mode cho IP102 Insect Pest Recognition
Lưu trữ model và dữ liệu local để hoạt động offline
"""
import os
import json
import pickle
import torch
from ultralytics import YOLO
import numpy as np
from typing import Dict, Any, List

class OfflineMode:
    def __init__(self, model_path: str = "models/offline_model.pt"):
        self.model_path = model_path
        self.model = None
        self.insect_data = {}
        self.is_offline = False
        
    def setup_offline_mode(self):
        """Thiết lập offline mode"""
        print("🔧 Setting up offline mode...")
        
        # Tạo thư mục models nếu chưa có
        os.makedirs("models", exist_ok=True)
        os.makedirs("offline_data", exist_ok=True)
        
        # Load model
        if os.path.exists(self.model_path):
            self.model = YOLO(self.model_path)
            print("✅ Offline model loaded")
        else:
            print("⚠️  Offline model not found, using default model")
            self.model = YOLO('yolov8n.pt')
        
        # Load insect data
        self.load_insect_data()
        
        # Check internet connection
        self.check_connection()
        
        return True
    
    def check_connection(self):
        """Kiểm tra kết nối internet"""
        try:
            import requests
            response = requests.get("https://www.google.com", timeout=5)
            self.is_offline = False
            print("🌐 Online mode - Internet connection available")
        except:
            self.is_offline = True
            print("📱 Offline mode - No internet connection")
    
    def load_insect_data(self):
        """Load dữ liệu côn trùng offline"""
        try:
            # Load từ file local
            with open("../insect_info.json", "r", encoding="utf-8") as f:
                self.insect_data = json.load(f)
            
            # Save offline copy
            with open("offline_data/insect_info.json", "w", encoding="utf-8") as f:
                json.dump(self.insect_data, f, ensure_ascii=False, indent=2)
            
            print(f"✅ Loaded {len(self.insect_data.get('insects', {}))} insects offline")
            return True
        except Exception as e:
            print(f"❌ Error loading insect data: {e}")
            return False
    
    def predict_offline(self, image_array: np.ndarray) -> Dict[str, Any]:
        """Dự đoán offline"""
        if self.model is None:
            return {"error": "Model not loaded"}
        
        try:
            # Dự đoán
            results = self.model(image_array)
            
            predictions = []
            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for box in boxes:
                        conf = float(box.conf[0])
                        cls = int(box.cls[0])
                        
                        # Tạo ID côn trùng
                        insect_id = f"IP{cls + 1:03d}"
                        
                        # Lấy thông tin từ dữ liệu offline
                        insect_info = self.insect_data.get("insects", {}).get(insect_id, {
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
                            "insect_info": insect_info
                        })
            
            # Sắp xếp theo confidence
            predictions.sort(key=lambda x: x["confidence"], reverse=True)
            
            return {
                "success": True,
                "predictions": predictions,
                "total_detections": len(predictions),
                "offline_mode": True
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "offline_mode": True
            }
    
    def get_insects_offline(self) -> Dict[str, Any]:
        """Lấy danh sách côn trùng offline"""
        return {
            "success": True,
            "insects": self.insect_data.get("insects", {}),
            "total": len(self.insect_data.get("insects", {})),
            "offline_mode": True
        }
    
    def get_insect_info_offline(self, insect_id: str) -> Dict[str, Any]:
        """Lấy thông tin côn trùng offline"""
        insect_info = self.insect_data.get("insects", {}).get(insect_id)
        if not insect_info:
            return {
                "success": False,
                "error": "Insect not found",
                "offline_mode": True
            }
        
        return {
            "success": True,
            "insect_id": insect_id,
            "insect_info": insect_info,
            "offline_mode": True
        }
    
    def save_model_offline(self, model_path: str):
        """Lưu model để sử dụng offline"""
        try:
            # Copy model to offline location
            import shutil
            shutil.copy2(model_path, self.model_path)
            print(f"✅ Model saved offline: {self.model_path}")
            return True
        except Exception as e:
            print(f"❌ Error saving model: {e}")
            return False
    
    def get_offline_status(self) -> Dict[str, Any]:
        """Lấy trạng thái offline mode"""
        return {
            "is_offline": self.is_offline,
            "model_loaded": self.model is not None,
            "insect_data_loaded": len(self.insect_data.get("insects", {})) > 0,
            "model_path": self.model_path,
            "insect_count": len(self.insect_data.get("insects", {}))
        }

# Global offline instance
offline_mode = OfflineMode()

def setup_offline():
    """Setup offline mode"""
    return offline_mode.setup_offline_mode()

def predict_offline(image_array):
    """Predict offline"""
    return offline_mode.predict_offline(image_array)

def get_insects_offline():
    """Get insects offline"""
    return offline_mode.get_insects_offline()

def get_insect_info_offline(insect_id):
    """Get insect info offline"""
    return offline_mode.get_insect_info_offline(insect_id)

def get_offline_status():
    """Get offline status"""
    return offline_mode.get_offline_status()
