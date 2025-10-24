"""
Script tối ưu mô hình để đạt độ chính xác cao nhất
"""
import os
import torch
from ultralytics import YOLO
import yaml

def full_optimized_training():
    """
    Training tối ưu với tất cả dataset và parameters tốt nhất
    """
    print("🚀 Bắt đầu FULL OPTIMIZED training...")
    
    # Kiểm tra GPU
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"🖥️  Sử dụng device: {device}")
    
    # Load mô hình YOLOv8s (tốt hơn YOLOv8n)
    print("📦 Đang load mô hình YOLOv8s...")
    model = YOLO('yolov8s.pt')
    
    print("📊 Thông tin training tối ưu:")
    print("   - Model: YOLOv8s (small - tốt hơn nano)")
    print("   - Epochs: 100 (đầy đủ)")
    print("   - Image size: 640")
    print("   - Batch size: 16")
    print("   - Device:", device)
    print("   - Data fraction: 1.0 (100% dataset)")
    print("   - Advanced augmentation")
    
    try:
        # Training với parameters tối ưu nhất
        results = model.train(
            data='data.yaml',
            epochs=100,           # Nhiều epoch hơn
            imgsz=640,           # Kích thước ảnh
            batch=16,            # Batch size lớn hơn
            device=device,
            project='runs/train',
            name='ip102_optimized',
            save=True,
            save_period=10,      # Lưu checkpoint mỗi 10 epoch
            patience=20,         # Early stopping
            optimizer='AdamW',
            lr0=0.01,
            weight_decay=0.0005,
            warmup_epochs=5,
            cos_lr=True,
            close_mosaic=15,
            resume=False,
            amp=True,            # Automatic Mixed Precision
            fraction=1.0,       # Sử dụng 100% dataset
            profile=False,
            freeze=None,
            multi_scale=True,   # Multi-scale training
            overlap_mask=True,
            mask_ratio=4,
            copy_paste=0.3,     # Copy-paste augmentation
            auto_augment='randaugment',
            erasing=0.4,
            # Advanced augmentation
            hsv_h=0.015,
            hsv_s=0.7,
            hsv_v=0.4,
            degrees=10.0,
            translate=0.1,
            scale=0.5,
            shear=0.0,
            perspective=0.0,
            flipud=0.0,
            fliplr=0.5,
            mosaic=1.0,
            mixup=0.0
        )
        
        print("✅ OPTIMIZED training hoàn thành!")
        print(f"📁 Kết quả được lưu tại: {results.save_dir}")
        
        # Validate model
        print("🔍 Đang validate model tối ưu...")
        model_path = f"{results.save_dir}/weights/best.pt"
        
        if os.path.exists(model_path):
            # Load model đã train
            trained_model = YOLO(model_path)
            
            # Validate
            val_results = trained_model.val(
                data='data.yaml',
                split='test',
                save=True,
                save_txt=True,
                save_conf=True,
                save_json=True,
                project='runs/val',
                name='ip102_optimized_validation'
            )
            
            print("✅ Validation hoàn thành!")
            print(f"📊 Kết quả validation: {val_results.save_dir}")
            
            return True
        else:
            print(f"❌ Không tìm thấy model tại {model_path}")
            return False
            
    except Exception as e:
        print(f"❌ Lỗi trong quá trình training: {e}")
        return False

if __name__ == "__main__":
    print("🎯 IP102 Model Optimization Script")
    print("=" * 50)
    
    # Kiểm tra dependencies
    try:
        import ultralytics
        print(f"✅ Ultralytics version: {ultralytics.__version__}")
    except ImportError:
        print("❌ Ultralytics chưa được cài đặt")
        exit(1)
    
    # Kiểm tra PyTorch
    print(f"✅ PyTorch version: {torch.__version__}")
    print(f"✅ CUDA available: {torch.cuda.is_available()}")
    
    if torch.cuda.is_available():
        print(f"✅ GPU: {torch.cuda.get_device_name(0)}")
        print(f"✅ GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
    else:
        print("⚠️  Sử dụng CPU - training sẽ rất chậm")
        print("💡 Khuyến nghị: Sử dụng Google Colab với GPU")
    
    print("\n🚀 Bắt đầu OPTIMIZED training...")
    print("⏰ Thời gian dự kiến: 2-4 giờ (tùy thuộc vào hardware)")
    
    success = full_optimized_training()
    
    if success:
        print("\n🎉 OPTIMIZED Training hoàn thành thành công!")
        print("📁 Kiểm tra kết quả trong thư mục runs/")
        print("🤖 Model tối ưu đã sẵn sàng!")
        print("📈 Độ chính xác dự kiến: 85-95%")
    else:
        print("\n❌ Training thất bại. Vui lòng kiểm tra lại.")
