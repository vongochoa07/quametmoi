"""
Script training nhanh mô hình YOLOv8 trên dataset IP102
Sử dụng cho testing và development
"""
import os
import torch
from ultralytics import YOLO
import yaml

def quick_train():
    """
    Training nhanh với ít epoch để test
    """
    print("🚀 Bắt đầu quick training...")
    
    # Kiểm tra GPU
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"🖥️  Sử dụng device: {device}")
    
    # Load mô hình YOLOv8n (nhỏ nhất, nhanh nhất)
    print("📦 Đang load mô hình YOLOv8n...")
    model = YOLO('yolov8n.pt')
    
    # Kiểm tra data.yaml
    if not os.path.exists('data.yaml'):
        print("❌ Không tìm thấy data.yaml. Chạy setup_dataset.py trước.")
        return False
    
    print("📊 Thông tin training:")
    print("   - Model: YOLOv8n (nano)")
    print("   - Epochs: 10 (quick test)")
    print("   - Image size: 640")
    print("   - Batch size: 8")
    print("   - Device:", device)
    
    try:
        # Training với parameters tối ưu cho quick test
        results = model.train(
            data='data.yaml',
            epochs=10,           # Ít epoch để test nhanh
            imgsz=640,           # Kích thước ảnh
            batch=8,             # Batch size nhỏ
            device=device,
            project='runs/train',
            name='ip102_quick_test',
            save=True,
            save_period=5,       # Lưu checkpoint mỗi 5 epoch
            patience=5,          # Early stopping
            optimizer='AdamW',
            lr0=0.01,
            weight_decay=0.0005,
            warmup_epochs=2,
            cos_lr=True,
            close_mosaic=5,
            resume=False,
            amp=True,            # Automatic Mixed Precision
            fraction=0.1,        # Chỉ sử dụng 10% dataset để test nhanh
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
        
        print("✅ Quick training hoàn thành!")
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
                name='ip102_quick_validation'
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

def full_train():
    """
    Training đầy đủ với tất cả dataset
    """
    print("🚀 Bắt đầu full training...")
    
    # Kiểm tra GPU
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"🖥️  Sử dụng device: {device}")
    
    # Load mô hình YOLOv8s (small, cân bằng giữa tốc độ và độ chính xác)
    print("📦 Đang load mô hình YOLOv8s...")
    model = YOLO('yolov8s.pt')
    
    # Kiểm tra data.yaml
    if not os.path.exists('data.yaml'):
        print("❌ Không tìm thấy data.yaml. Chạy setup_dataset.py trước.")
        return False
    
    print("📊 Thông tin training:")
    print("   - Model: YOLOv8s (small)")
    print("   - Epochs: 50")
    print("   - Image size: 640")
    print("   - Batch size: 16")
    print("   - Device:", device)
    
    try:
        # Training với parameters đầy đủ
        results = model.train(
            data='data.yaml',
            epochs=50,           # Nhiều epoch hơn
            imgsz=640,
            batch=16,            # Batch size lớn hơn
            device=device,
            project='runs/train',
            name='ip102_full_training',
            save=True,
            save_period=10,      # Lưu checkpoint mỗi 10 epoch
            patience=15,         # Early stopping
            optimizer='AdamW',
            lr0=0.01,
            weight_decay=0.0005,
            warmup_epochs=3,
            cos_lr=True,
            close_mosaic=10,
            resume=False,
            amp=True,
            fraction=1.0,       # Sử dụng toàn bộ dataset
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
        
        print("✅ Full training hoàn thành!")
        print(f"📁 Kết quả được lưu tại: {results.save_dir}")
        
        return True
        
    except Exception as e:
        print(f"❌ Lỗi trong quá trình training: {e}")
        return False

def main():
    """
    Hàm chính
    """
    print("🐛 IP102 Insect Pest Recognition - Training Script")
    print("=" * 60)
    
    # Kiểm tra dependencies
    try:
        import ultralytics
        print(f"✅ Ultralytics version: {ultralytics.__version__}")
    except ImportError:
        print("❌ Ultralytics chưa được cài đặt. Chạy: pip install ultralytics")
        return
    
    # Kiểm tra PyTorch
    print(f"✅ PyTorch version: {torch.__version__}")
    print(f"✅ CUDA available: {torch.cuda.is_available()}")
    
    if torch.cuda.is_available():
        print(f"✅ GPU: {torch.cuda.get_device_name(0)}")
        print(f"✅ GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
    
    print("\nChọn loại training:")
    print("1. Quick training (10 epochs, 10% data) - Nhanh để test")
    print("2. Full training (50 epochs, 100% data) - Đầy đủ")
    
    choice = input("\nNhập lựa chọn (1 hoặc 2): ").strip()
    
    if choice == "1":
        success = quick_train()
    elif choice == "2":
        success = full_train()
    else:
        print("❌ Lựa chọn không hợp lệ")
        return
    
    if success:
        print("\n🎉 Training hoàn thành thành công!")
        print("📁 Kiểm tra kết quả trong thư mục runs/")
    else:
        print("\n❌ Training thất bại. Vui lòng kiểm tra lại dataset và cấu hình.")

if __name__ == "__main__":
    main()
