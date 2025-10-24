"""
Script để test mô hình đã train
"""
import os
import cv2
import numpy as np
from ultralytics import YOLO
from PIL import Image
import matplotlib.pyplot as plt

def test_single_image(model_path, image_path, save_result=True):
    """
    Test mô hình trên một ảnh
    """
    print(f"🔍 Đang test ảnh: {image_path}")
    
    # Load model
    model = YOLO(model_path)
    
    # Đọc ảnh
    image = cv2.imread(image_path)
    if image is None:
        print(f"❌ Không thể đọc ảnh: {image_path}")
        return None
    
    # Dự đoán
    results = model(image)
    
    # Vẽ kết quả
    annotated_image = results[0].plot()
    
    if save_result:
        # Lưu ảnh kết quả
        output_path = f"test_result_{os.path.basename(image_path)}"
        cv2.imwrite(output_path, annotated_image)
        print(f"✅ Đã lưu kết quả tại: {output_path}")
    
    # In thông tin detection
    for result in results:
        boxes = result.boxes
        if boxes is not None:
            print(f"📊 Tìm thấy {len(boxes)} đối tượng:")
            for i, box in enumerate(boxes):
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                print(f"   {i+1}. Class: {cls}, Confidence: {conf:.3f}")
        else:
            print("❌ Không tìm thấy đối tượng nào")
    
    return results

def test_model_accuracy(model_path, test_data_path):
    """
    Test độ chính xác của mô hình trên test set
    """
    print(f"📊 Đang test độ chính xác trên test set...")
    
    # Load model
    model = YOLO(model_path)
    
    # Validate model
    results = model.val(
        data='data.yaml',
        split='test',
        save=True,
        save_txt=True,
        save_conf=True,
        save_json=True,
        project='runs/test',
        name='ip102_accuracy_test'
    )
    
    print("✅ Test độ chính xác hoàn thành!")
    print(f"📁 Kết quả được lưu tại: runs/test/ip102_accuracy_test")
    
    return results

def test_on_sample_images():
    """
    Test mô hình trên một số ảnh mẫu
    """
    print("🖼️  Đang test trên ảnh mẫu...")
    
    # Tìm ảnh test
    test_images_dir = "../test/images"
    if not os.path.exists(test_images_dir):
        print(f"❌ Không tìm thấy thư mục test: {test_images_dir}")
        return
    
    # Lấy một số ảnh test
    image_files = []
    for ext in ['*.jpg', '*.png', '*.jpeg']:
        image_files.extend([f for f in os.listdir(test_images_dir) if f.lower().endswith(ext.lower())])
    
    if not image_files:
        print("❌ Không tìm thấy ảnh test nào")
        return
    
    # Chọn 5 ảnh đầu tiên để test
    sample_images = image_files[:5]
    
    # Tìm model đã train
    model_paths = [
        "runs/train/ip102_quick_test/weights/best.pt",
        "runs/train/ip102_full_training/weights/best.pt",
        "runs/train/ip102_insect_detection/weights/best.pt"
    ]
    
    model_path = None
    for path in model_paths:
        if os.path.exists(path):
            model_path = path
            break
    
    if not model_path:
        print("❌ Không tìm thấy model đã train. Chạy training trước.")
        return
    
    print(f"🤖 Sử dụng model: {model_path}")
    
    # Test trên từng ảnh
    for image_file in sample_images:
        image_path = os.path.join(test_images_dir, image_file)
        print(f"\n📸 Test ảnh: {image_file}")
        test_single_image(model_path, image_path)

def benchmark_model(model_path):
    """
    Benchmark hiệu suất của mô hình
    """
    print("⚡ Đang benchmark hiệu suất...")
    
    # Load model
    model = YOLO(model_path)
    
    # Tạo ảnh test
    test_image = np.random.randint(0, 255, (640, 640, 3), dtype=np.uint8)
    
    import time
    
    # Warm up
    for _ in range(5):
        _ = model(test_image)
    
    # Benchmark
    times = []
    for _ in range(20):
        start_time = time.time()
        _ = model(test_image)
        end_time = time.time()
        times.append(end_time - start_time)
    
    avg_time = np.mean(times)
    fps = 1.0 / avg_time
    
    print(f"📊 Kết quả benchmark:")
    print(f"   - Thời gian trung bình: {avg_time:.3f}s")
    print(f"   - FPS: {fps:.1f}")
    print(f"   - Thời gian min: {min(times):.3f}s")
    print(f"   - Thời gian max: {max(times):.3f}s")

def main():
    """
    Hàm chính
    """
    print("🧪 IP102 Model Testing Script")
    print("=" * 40)
    
    # Tìm model đã train
    model_paths = [
        "runs/train/ip102_quick_test/weights/best.pt",
        "runs/train/ip102_full_training/weights/best.pt", 
        "runs/train/ip102_insect_detection/weights/best.pt"
    ]
    
    model_path = None
    for path in model_paths:
        if os.path.exists(path):
            model_path = path
            break
    
    if not model_path:
        print("❌ Không tìm thấy model đã train.")
        print("💡 Chạy quick_train.py hoặc train_model.py trước.")
        return
    
    print(f"🤖 Sử dụng model: {model_path}")
    
    print("\nChọn loại test:")
    print("1. Test trên ảnh mẫu")
    print("2. Test độ chính xác trên test set")
    print("3. Benchmark hiệu suất")
    print("4. Tất cả")
    
    choice = input("\nNhập lựa chọn (1-4): ").strip()
    
    if choice == "1":
        test_on_sample_images()
    elif choice == "2":
        test_model_accuracy(model_path, "../test")
    elif choice == "3":
        benchmark_model(model_path)
    elif choice == "4":
        test_on_sample_images()
        print("\n" + "="*50)
        test_model_accuracy(model_path, "../test")
        print("\n" + "="*50)
        benchmark_model(model_path)
    else:
        print("❌ Lựa chọn không hợp lệ")

if __name__ == "__main__":
    main()
