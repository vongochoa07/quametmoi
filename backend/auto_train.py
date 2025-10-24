"""
Script tự động training mô hình YOLOv8
"""
import os
import torch
from ultralytics import YOLO
import yaml

def auto_quick_train():
    """
    Tự động training nhanh
    """
    print("🚀 Bắt đầu auto quick training...")
    
    # Kiểm tra GPU
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"🖥️  Sử dụng device: {device}")
    
    # Load mô hình YOLOv8n
    print("📦 Đang load mô hình YOLOv8n...")
    model = YOLO('yolov8n.pt')
    
    # Kiểm tra data.yaml
    if not os.path.exists('data.yaml'):
        print("❌ Không tìm thấy data.yaml. Chạy setup_dataset.py trước.")
        return False
    
    print("📊 Thông tin training:")
    print("   - Model: YOLOv8n (nano)")
    print("   - Epochs: 5 (rất nhanh)")
    print("   - Image size: 640")
    print("   - Batch size: 4")
    print("   - Device:", device)
    print("   - Data fraction: 0.05 (5% dataset)")
    
    try:
        # Training với parameters tối ưu cho speed
        results = model.train(
            data='data.yaml',
            epochs=5,            # Rất ít epoch để nhanh
            imgsz=640,          # Kích thước ảnh
            batch=4,            # Batch size nhỏ
            device=device,
            project='runs/train',
            name='ip102_auto_quick',
            save=True,
            save_period=2,      # Lưu checkpoint mỗi 2 epoch
            patience=3,         # Early stopping
            optimizer='AdamW',
            lr0=0.01,
            weight_decay=0.0005,
            warmup_epochs=1,
            cos_lr=True,
            close_mosaic=2,
            resume=False,
            amp=True,           # Automatic Mixed Precision
            fraction=0.05,      # Chỉ sử dụng 5% dataset để rất nhanh
            profile=False,
            freeze=None,
            multi_scale=False,
            overlap_mask=True,
            mask_ratio=4,
            copy_paste=0.0,
            auto_augment='randaugment',
            erasing=0.4
        )
        
        print("✅ Auto quick training hoàn thành!")
        print(f"📁 Kết quả được lưu tại: {results.save_dir}")
        
        # Validate model
        print("🔍 Đang validate model...")
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
                name='ip102_auto_validation'
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
    print("🐛 IP102 Auto Training Script")
    print("=" * 40)
    
    # Kiểm tra dependencies
    try:
        import ultralytics
        print(f"✅ Ultralytics version: {ultralytics.__version__}")
    except ImportError:
        print("❌ Ultralytics chưa được cài đặt. Chạy: pip install ultralytics")
        exit(1)
    
    # Kiểm tra PyTorch
    print(f"✅ PyTorch version: {torch.__version__}")
    print(f"✅ CUDA available: {torch.cuda.is_available()}")
    
    if torch.cuda.is_available():
        print(f"✅ GPU: {torch.cuda.get_device_name(0)}")
        print(f"✅ GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
    else:
        print("⚠️  Sử dụng CPU - training sẽ chậm hơn")
    
    print("\n🚀 Bắt đầu auto quick training...")
    success = auto_quick_train()
    
    if success:
        print("\n🎉 Training hoàn thành thành công!")
        print("📁 Kiểm tra kết quả trong thư mục runs/")
        print("🤖 Model đã sẵn sàng để sử dụng!")
    else:
        print("\n❌ Training thất bại. Vui lòng kiểm tra lại dataset và cấu hình.")
