"""
Script để cải thiện model nhanh chóng
"""
import os
import yaml
from ultralytics import YOLO
import torch

def create_improved_model():
    """
    Tạo model cải thiện với cấu hình tối ưu
    """
    print("🚀 Tạo model cải thiện...")
    
    # Kiểm tra GPU
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"Sử dụng device: {device}")
    
    # Tạo data.yaml
    class_names = [f"IP{i:03d}" for i in range(1, 103)]
    data_config = {
        'path': '../',
        'train': 'train/images',
        'val': 'valid/images', 
        'test': 'test/images',
        'nc': 102,
        'names': class_names
    }
    
    with open('data.yaml', 'w') as f:
        yaml.dump(data_config, f, default_flow_style=False)
    
    # Load YOLOv8s (tốt hơn YOLOv8n)
    model = YOLO('yolov8s.pt')
    
    # Training với cấu hình tối ưu
    results = model.train(
        data='data.yaml',
        epochs=20,  # Tăng epochs
        imgsz=640,
        batch=8,    # Giảm batch size để tránh OOM
        device=device,
        workers=2,
        project='runs/train',
        name='ip102_quick_improved',
        exist_ok=True,
        pretrained=True,
        optimizer='AdamW',
        lr0=0.01,
        lrf=0.1,
        momentum=0.937,
        weight_decay=0.0005,
        warmup_epochs=3,
        warmup_momentum=0.8,
        warmup_bias_lr=0.1,
        box=7.5,
        cls=0.5,
        dfl=1.5,
        plots=True,
        val=True,
        save=True,
        save_period=5,
        cache=False,
        rect=False,
        cos_lr=True,
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
        workers=4,
        exist_ok=True,
        patience=20,
        save_dir='runs/train/ip102_quick_improved'
    )
    
    print("✅ Training hoàn thành!")
    
    # Test model
    model = YOLO('runs/train/ip102_quick_improved/weights/best.pt')
    metrics = model.val()
    print(f"📊 Validation metrics: {metrics}")
    
    return model

if __name__ == "__main__":
    model = create_improved_model()
    print("🎉 Model đã được cải thiện!")
