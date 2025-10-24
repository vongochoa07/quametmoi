"""
Script để chuẩn bị dataset IP102 cho training YOLOv8
"""
import os
import yaml
import shutil
from pathlib import Path

def create_data_yaml():
    """
    Tạo file data.yaml cho training YOLOv8
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
    
    with open('data.yaml', 'w', encoding='utf-8') as f:
        yaml.dump(data_config, f, default_flow_style=False, allow_unicode=True)
    
    print("✅ Đã tạo file data.yaml")
    return 'data.yaml'

def check_dataset_structure():
    """
    Kiểm tra cấu trúc dataset
    """
    base_path = Path('../')
    required_dirs = [
        'train/images',
        'train/labels', 
        'valid/images',
        'valid/labels',
        'test/images',
        'test/labels'
    ]
    
    missing_dirs = []
    for dir_path in required_dirs:
        full_path = base_path / dir_path
        if not full_path.exists():
            missing_dirs.append(dir_path)
    
    if missing_dirs:
        print("❌ Thiếu các thư mục sau:")
        for dir_path in missing_dirs:
            print(f"   - {dir_path}")
        return False
    
    print("✅ Cấu trúc dataset hợp lệ")
    return True

def count_files():
    """
    Đếm số lượng file trong dataset
    """
    base_path = Path('../')
    
    for split in ['train', 'valid', 'test']:
        images_dir = base_path / split / 'images'
        labels_dir = base_path / split / 'labels'
        
        if images_dir.exists() and labels_dir.exists():
            image_count = len(list(images_dir.glob('*.jpg'))) + len(list(images_dir.glob('*.png')))
            label_count = len(list(labels_dir.glob('*.txt')))
            
            print(f"📊 {split.upper()}:")
            print(f"   - Images: {image_count}")
            print(f"   - Labels: {label_count}")
        else:
            print(f"❌ Không tìm thấy thư mục {split}")

def create_sample_labels():
    """
    Tạo sample label files nếu chưa có
    """
    base_path = Path('../')
    
    for split in ['train', 'valid', 'test']:
        labels_dir = base_path / split / 'labels'
        images_dir = base_path / split / 'images'
        
        if labels_dir.exists() and images_dir.exists():
            # Kiểm tra xem có file label nào không
            label_files = list(labels_dir.glob('*.txt'))
            
            if len(label_files) == 0:
                print(f"⚠️  Không tìm thấy file label nào trong {split}/labels")
                print(f"   Dataset IP102 có thể cần được chuyển đổi sang format YOLO")
            else:
                print(f"✅ Tìm thấy {len(label_files)} file label trong {split}")

def main():
    """
    Hàm chính để setup dataset
    """
    print("🔧 Đang chuẩn bị dataset IP102...")
    print("=" * 50)
    
    # Kiểm tra cấu trúc dataset
    if not check_dataset_structure():
        print("\n❌ Dataset không đúng cấu trúc. Vui lòng kiểm tra lại.")
        return False
    
    # Đếm file
    print("\n📊 Thống kê dataset:")
    count_files()
    
    # Kiểm tra labels
    print("\n🏷️  Kiểm tra labels:")
    create_sample_labels()
    
    # Tạo data.yaml
    print("\n📝 Tạo file cấu hình:")
    data_yaml = create_data_yaml()
    
    print("\n✅ Dataset đã sẵn sàng cho training!")
    print(f"📄 File cấu hình: {data_yaml}")
    
    return True

if __name__ == "__main__":
    main()
