#!/usr/bin/env python3
"""
Test script toàn bộ hệ thống IP102 Insect Pest Recognition
"""
import requests
import time
import json
import os
from PIL import Image
import numpy as np

class SystemTester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.results = {}
        
    def test_api_health(self):
        """Test API health endpoint"""
        print("🔍 Testing API health...")
        try:
            response = requests.get(f"{self.base_url}/health", timeout=5)
            if response.status_code == 200:
                print("✅ API health check passed")
                self.results['health'] = True
                return True
            else:
                print(f"❌ API health check failed: {response.status_code}")
                self.results['health'] = False
                return False
        except Exception as e:
            print(f"❌ API health check error: {e}")
            self.results['health'] = False
            return False
    
    def test_system_status(self):
        """Test system status endpoint"""
        print("🔍 Testing system status...")
        try:
            response = requests.get(f"{self.base_url}/status", timeout=10)
            if response.status_code == 200:
                data = response.json()
                print("✅ System status check passed")
                print(f"   - CPU: {data.get('system', {}).get('cpu_percent', 'N/A')}%")
                print(f"   - Memory: {data.get('system', {}).get('memory', {}).get('percent', 'N/A')}%")
                self.results['status'] = True
                return True
            else:
                print(f"❌ System status check failed: {response.status_code}")
                self.results['status'] = False
                return False
        except Exception as e:
            print(f"❌ System status check error: {e}")
            self.results['status'] = False
            return False
    
    def test_insects_endpoint(self):
        """Test insects list endpoint"""
        print("🔍 Testing insects endpoint...")
        try:
            response = requests.get(f"{self.base_url}/insects", timeout=10)
            if response.status_code == 200:
                data = response.json()
                insect_count = len(data.get('insects', {}))
                print(f"✅ Insects endpoint passed - Found {insect_count} insects")
                self.results['insects'] = True
                return True
            else:
                print(f"❌ Insects endpoint failed: {response.status_code}")
                self.results['insects'] = False
                return False
        except Exception as e:
            print(f"❌ Insects endpoint error: {e}")
            self.results['insects'] = False
            return False
    
    def create_test_image(self):
        """Tạo ảnh test"""
        # Tạo ảnh test đơn giản
        img = Image.new('RGB', (640, 640), color='green')
        img_array = np.array(img)
        
        # Thêm một số noise để giống ảnh thật
        noise = np.random.randint(0, 50, img_array.shape, dtype=np.uint8)
        img_array = np.clip(img_array.astype(np.int16) + noise, 0, 255).astype(np.uint8)
        
        test_img = Image.fromarray(img_array)
        test_img.save('test_image.jpg')
        return 'test_image.jpg'
    
    def test_prediction(self):
        """Test prediction endpoint"""
        print("🔍 Testing prediction endpoint...")
        try:
            # Tạo ảnh test
            test_image_path = self.create_test_image()
            
            # Gửi request
            with open(test_image_path, 'rb') as f:
                files = {'file': f}
                response = requests.post(f"{self.base_url}/predict", files=files, timeout=30)
            
            # Cleanup
            os.remove(test_image_path)
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Prediction endpoint passed")
                print(f"   - Total detections: {data.get('total_detections', 0)}")
                if data.get('predictions'):
                    pred = data['predictions'][0]
                    print(f"   - First prediction: {pred.get('insect_id')} (confidence: {pred.get('confidence', 0):.3f})")
                self.results['prediction'] = True
                return True
            else:
                print(f"❌ Prediction endpoint failed: {response.status_code}")
                print(f"   Response: {response.text}")
                self.results['prediction'] = False
                return False
        except Exception as e:
            print(f"❌ Prediction endpoint error: {e}")
            self.results['prediction'] = False
            return False
    
    def test_performance(self):
        """Test performance metrics"""
        print("🔍 Testing performance...")
        try:
            # Test multiple requests
            start_time = time.time()
            success_count = 0
            
            for i in range(5):
                response = requests.get(f"{self.base_url}/health", timeout=5)
                if response.status_code == 200:
                    success_count += 1
                time.sleep(0.1)
            
            end_time = time.time()
            avg_response_time = (end_time - start_time) / 5
            
            print(f"✅ Performance test passed")
            print(f"   - Success rate: {success_count}/5")
            print(f"   - Average response time: {avg_response_time:.3f}s")
            
            self.results['performance'] = True
            return True
        except Exception as e:
            print(f"❌ Performance test error: {e}")
            self.results['performance'] = False
            return False
    
    def run_all_tests(self):
        """Chạy tất cả tests"""
        print("🚀 IP102 System Test Suite")
        print("=" * 40)
        
        tests = [
            self.test_api_health,
            self.test_system_status,
            self.test_insects_endpoint,
            self.test_prediction,
            self.test_performance
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test():
                    passed += 1
            except Exception as e:
                print(f"❌ Test error: {e}")
            print()
        
        # Kết quả tổng hợp
        print("📊 Test Results Summary")
        print("=" * 30)
        print(f"✅ Passed: {passed}/{total}")
        print(f"❌ Failed: {total - passed}/{total}")
        print(f"📈 Success Rate: {(passed/total)*100:.1f}%")
        
        if passed == total:
            print("\n🎉 All tests passed! System is ready!")
            return True
        else:
            print(f"\n⚠️  {total - passed} tests failed. Please check the system.")
            return False

def main():
    """Main test function"""
    print("🐛 IP102 Insect Pest Recognition - System Test")
    print("=" * 50)
    
    # Kiểm tra backend có chạy không
    tester = SystemTester()
    
    print("🔍 Checking if backend is running...")
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code != 200:
            print("❌ Backend is not running. Please start it first:")
            print("   cd backend && python main.py")
            return False
    except:
        print("❌ Cannot connect to backend. Please start it first:")
        print("   cd backend && python main.py")
        return False
    
    print("✅ Backend is running. Starting tests...\n")
    
    # Chạy tests
    success = tester.run_all_tests()
    
    if success:
        print("\n🎯 System Status: READY FOR PRODUCTION")
        print("🌐 Frontend: http://localhost:3000")
        print("🔧 Backend: http://localhost:8000")
        print("📚 API Docs: http://localhost:8000/docs")
    else:
        print("\n⚠️  System Status: NEEDS ATTENTION")
        print("Please check the failed tests and fix issues.")
    
    return success

if __name__ == "__main__":
    main()
