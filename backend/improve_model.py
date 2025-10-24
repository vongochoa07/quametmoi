"""
Script để cải thiện model AI với training tốt hơn
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

def train_improved_model():
    """
    Train model YOLOv8 với cấu hình tốt hơn
    """
    # Kiểm tra GPU
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Sử dụng device: {device}")
    
    # Load mô hình YOLOv8s (tốt hơn YOLOv8n)
    model = YOLO('yolov8s.pt')
    
    # Chuẩn bị data.yaml
    data_yaml = prepare_data_yaml()
    
    # Train mô hình với cấu hình tốt hơn
    results = model.train(
        data=data_yaml,
        epochs=50,  # Tăng số epoch
        imgsz=640,
        batch=16,
        device=device,
        workers=4,
        project='runs/train',
        name='ip102_improved',
        exist_ok=True,
        pretrained=True,
        optimizer='AdamW',
        lr0=0.01,
        lrf=0.01,
        momentum=0.937,
        weight_decay=0.0005,
        warmup_epochs=3,
        warmup_momentum=0.8,
        warmup_bias_lr=0.1,
        box=7.5,
        cls=0.5,
        dfl=1.5,
        pose=12.0,
        kobj=1.0,
        label_smoothing=0.0,
        nbs=64,
        overlap_mask=True,
        mask_ratio=4,
        drop_path=0.0,
        plots=True,
        val=True,
        save=True,
        save_period=10,
        cache=False,
        rect=False,
        cos_lr=False,
        close_mosaic=10,
        resume=False,
        amp=True,
        fraction=1.0,
        profile=False,
        freeze=None,
        multi_scale=False,
        single_cls=False,
        augment=True,
        verbose=True,
        seed=0,
        deterministic=True,
        workers=8,
        exist_ok=True,
        patience=50,
        save_dir='runs/train/ip102_improved'
    )
    
    print("Training hoàn thành!")
    print(f"Kết quả: {results}")
    
    # Test model
    model = YOLO('runs/train/ip102_improved/weights/best.pt')
    metrics = model.val()
    print(f"Validation metrics: {metrics}")
    
    return model

if __name__ == "__main__":
    print("🚀 Bắt đầu training model cải thiện...")
    model = train_improved_model()
    print("✅ Hoàn thành!")
