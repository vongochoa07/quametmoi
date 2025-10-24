"""
Script để train mô hình YOLOv8 trên dataset IP102
"""
import os
import yaml
from ultralytics import YOLO
import torch

def prepare_data_yaml():
    """
    Tạo file data.yaml cho training
    """
    # Tạo danh sách 102 loài côn trùng
    class_names = []
    for i in range(1, 103):
        class_names.append(f"IP{i:03d}")
    
    data_config = {
        'path': '../',  # Đường dẫn đến thư mục chứa dataset
        'train': 'train/images',
        'val': 'valid/images', 
        'test': 'test/images',
        'nc': 102,  # Số lượng classes
        'names': class_names
    }
    
    with open('data.yaml', 'w') as f:
        yaml.dump(data_config, f, default_flow_style=False)
    
    print("Đã tạo file data.yaml")
    return 'data.yaml'

def train_model():
    """
    Train mô hình YOLOv8
    """
    # Kiểm tra GPU
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Sử dụng device: {device}")
    
    # Load mô hình YOLOv8
    model = YOLO('yolov8n.pt')  # Có thể thay bằng yolov8s.pt, yolov8m.pt, yolov8l.pt, yolov8x.pt
    
    # Chuẩn bị data.yaml
    data_yaml = prepare_data_yaml()
    
    # Train mô hình
    results = model.train(
        data=data_yaml,
        epochs=100,  # Số epoch
        imgsz=640,  # Kích thước ảnh
        batch=16,   # Batch size
        device=device,
        project='runs/train',
        name='ip102_insect_detection',
        save=True,
        save_period=10,  # Lưu checkpoint mỗi 10 epoch
        patience=20,     # Early stopping
        optimizer='AdamW',
        lr0=0.01,
        weight_decay=0.0005,
        warmup_epochs=3,
        cos_lr=True,
        close_mosaic=10,
        resume=False,
        amp=True,  # Automatic Mixed Precision
        fraction=1.0,
        profile=False,
        freeze=None,
        multi_scale=False,
        overlap_mask=True,
        mask_ratio=4,
        drop_path=0.0,
        copy_paste=0.0,
        auto_augment='randaugment',
        erasing=0.4,
        crop_fraction=1.0
    )
    
    print("Training hoàn thành!")
    print(f"Kết quả được lưu tại: {results.save_dir}")
    
    return results

def validate_model(model_path):
    """
    Validate mô hình đã train
    """
    model = YOLO(model_path)
    
    # Validate trên test set
    results = model.val(
        data='data.yaml',
        split='test',
        save=True,
        save_txt=True,
        save_conf=True,
        save_json=True,
        project='runs/val',
        name='ip102_validation'
    )
    
    print("Validation hoàn thành!")
    return results

if __name__ == "__main__":
    # Train mô hình
    print("Bắt đầu training mô hình...")
    results = train_model()
    
    # Validate mô hình
    print("Bắt đầu validation...")
    model_path = "runs/train/ip102_insect_detection/weights/best.pt"
    if os.path.exists(model_path):
        validate_model(model_path)
    else:
        print(f"Không tìm thấy mô hình tại {model_path}")
