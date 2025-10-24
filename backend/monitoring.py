"""
Monitoring và logging system cho IP102 Insect Pest Recognition
"""
import logging
import time
import psutil
import requests
from datetime import datetime
from typing import Dict, Any
import json
import os

class SystemMonitor:
    def __init__(self):
        self.setup_logging()
        self.start_time = time.time()
        
    def setup_logging(self):
        """Thiết lập logging system"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('app.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def get_system_stats(self) -> Dict[str, Any]:
        """Lấy thống kê hệ thống"""
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            return {
                'timestamp': datetime.now().isoformat(),
                'cpu_percent': cpu_percent,
                'memory': {
                    'total': memory.total,
                    'available': memory.available,
                    'percent': memory.percent,
                    'used': memory.used
                },
                'disk': {
                    'total': disk.total,
                    'used': disk.used,
                    'free': disk.free,
                    'percent': (disk.used / disk.total) * 100
                },
                'uptime': time.time() - self.start_time
            }
        except Exception as e:
            self.logger.error(f"Lỗi khi lấy system stats: {e}")
            return {}
    
    def check_api_health(self) -> Dict[str, Any]:
        """Kiểm tra health của API"""
        try:
            response = requests.get('http://localhost:8000/health', timeout=5)
            return {
                'status': 'healthy' if response.status_code == 200 else 'unhealthy',
                'status_code': response.status_code,
                'response_time': response.elapsed.total_seconds()
            }
        except Exception as e:
            return {
                'status': 'unhealthy',
                'error': str(e)
            }
    
    def log_prediction(self, image_size: int, processing_time: float, 
                      confidence: float, insect_id: str):
        """Log thông tin prediction"""
        self.logger.info(f"Prediction: {insect_id}, confidence: {confidence:.3f}, "
                        f"processing_time: {processing_time:.3f}s, image_size: {image_size}")
        
        # Lưu vào file log chi tiết
        prediction_log = {
            'timestamp': datetime.now().isoformat(),
            'insect_id': insect_id,
            'confidence': confidence,
            'processing_time': processing_time,
            'image_size': image_size
        }
        
        with open('predictions.log', 'a') as f:
            f.write(json.dumps(prediction_log) + '\n')
    
    def get_performance_metrics(self) -> Dict[str, Any]:
        """Lấy performance metrics"""
        try:
            # Đọc prediction logs
            predictions = []
            if os.path.exists('predictions.log'):
                with open('predictions.log', 'r') as f:
                    for line in f:
                        try:
                            predictions.append(json.loads(line.strip()))
                        except:
                            continue
            
            if not predictions:
                return {'message': 'No predictions yet'}
            
            # Tính toán metrics
            confidences = [p['confidence'] for p in predictions]
            processing_times = [p['processing_time'] for p in predictions]
            
            return {
                'total_predictions': len(predictions),
                'avg_confidence': sum(confidences) / len(confidences),
                'avg_processing_time': sum(processing_times) / len(processing_times),
                'min_confidence': min(confidences),
                'max_confidence': max(confidences),
                'min_processing_time': min(processing_times),
                'max_processing_time': max(processing_times)
            }
        except Exception as e:
            self.logger.error(f"Lỗi khi tính performance metrics: {e}")
            return {}
    
    def generate_report(self) -> Dict[str, Any]:
        """Tạo báo cáo tổng hợp"""
        system_stats = self.get_system_stats()
        api_health = self.check_api_health()
        performance = self.get_performance_metrics()
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'system': system_stats,
            'api_health': api_health,
            'performance': performance
        }
        
        # Lưu report
        with open(f'reports/report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        return report

# Global monitor instance
monitor = SystemMonitor()

def log_prediction(image_size: int, processing_time: float, 
                  confidence: float, insect_id: str):
    """Helper function để log prediction"""
    monitor.log_prediction(image_size, processing_time, confidence, insect_id)

def get_system_status() -> Dict[str, Any]:
    """Helper function để lấy system status"""
    return monitor.generate_report()
