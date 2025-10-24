"""
Database System cho IP102 Insect Pest Recognition
Sử dụng SQLite cho development, có thể chuyển sang PostgreSQL cho production
"""
import sqlite3
import json
import os
from datetime import datetime
from typing import Dict, Any, List, Optional
import hashlib

class DatabaseManager:
    def __init__(self, db_path: str = "ip102_database.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Khởi tạo database và tạo tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT DEFAULT 'user',
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP
            )
        ''')
        
        # Predictions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                image_hash TEXT,
                image_size INTEGER,
                processing_time REAL,
                confidence REAL,
                insect_id TEXT,
                bounding_box TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Notifications table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                title TEXT NOT NULL,
                message TEXT NOT NULL,
                notification_type TEXT DEFAULT 'info',
                data TEXT,
                is_read BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # System logs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS system_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                log_level TEXT NOT NULL,
                message TEXT NOT NULL,
                data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Insect data table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS insect_data (
                id TEXT PRIMARY KEY,
                vietnamese_name TEXT NOT NULL,
                scientific_name TEXT,
                danger_level TEXT,
                affected_crops TEXT,
                habitat TEXT,
                prevention TEXT,
                treatment TEXT,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # User sessions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_sessions (
                id TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                token_hash TEXT NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        conn.commit()
        conn.close()
        
        print("✅ Database initialized successfully")
    
    def get_connection(self):
        """Lấy database connection"""
        return sqlite3.connect(self.db_path)
    
    def create_user(self, username: str, email: str, password_hash: str, role: str = "user") -> Dict[str, Any]:
        """Tạo user mới"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO users (username, email, password_hash, role)
                VALUES (?, ?, ?, ?)
            ''', (username, email, password_hash, role))
            
            user_id = cursor.lastrowid
            conn.commit()
            
            return {
                "id": user_id,
                "username": username,
                "email": email,
                "role": role,
                "created_at": datetime.utcnow().isoformat()
            }
        except sqlite3.IntegrityError:
            raise ValueError("Username or email already exists")
        finally:
            conn.close()
    
    def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Lấy user theo username"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, username, email, password_hash, role, is_active, created_at, last_login
            FROM users WHERE username = ?
        ''', (username,))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return {
                "id": row[0],
                "username": row[1],
                "email": row[2],
                "password_hash": row[3],
                "role": row[4],
                "is_active": bool(row[5]),
                "created_at": row[6],
                "last_login": row[7]
            }
        return None
    
    def update_user_login(self, user_id: int):
        """Cập nhật thời gian login cuối"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
        ''', (user_id,))
        
        conn.commit()
        conn.close()
    
    def save_prediction(self, user_id: Optional[int], image_hash: str, image_size: int,
                       processing_time: float, confidence: float, insect_id: str,
                       bounding_box: Dict[str, Any]) -> int:
        """Lưu prediction vào database"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO predictions (user_id, image_hash, image_size, processing_time, 
                                   confidence, insect_id, bounding_box)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, image_hash, image_size, processing_time, confidence, 
              insect_id, json.dumps(bounding_box)))
        
        prediction_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return prediction_id
    
    def get_user_predictions(self, user_id: int, limit: int = 50) -> List[Dict[str, Any]]:
        """Lấy predictions của user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, image_hash, image_size, processing_time, confidence, 
                   insect_id, bounding_box, created_at
            FROM predictions 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT ?
        ''', (user_id, limit))
        
        rows = cursor.fetchall()
        conn.close()
        
        predictions = []
        for row in rows:
            predictions.append({
                "id": row[0],
                "image_hash": row[1],
                "image_size": row[2],
                "processing_time": row[3],
                "confidence": row[4],
                "insect_id": row[5],
                "bounding_box": json.loads(row[6]),
                "created_at": row[7]
            })
        
        return predictions
    
    def get_prediction_stats(self) -> Dict[str, Any]:
        """Lấy thống kê predictions"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Total predictions
        cursor.execute('SELECT COUNT(*) FROM predictions')
        total_predictions = cursor.fetchone()[0]
        
        # Average confidence
        cursor.execute('SELECT AVG(confidence) FROM predictions')
        avg_confidence = cursor.fetchone()[0] or 0
        
        # Average processing time
        cursor.execute('SELECT AVG(processing_time) FROM predictions')
        avg_processing_time = cursor.fetchone()[0] or 0
        
        # Predictions by day (last 7 days)
        cursor.execute('''
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM predictions 
            WHERE created_at >= datetime('now', '-7 days')
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        ''')
        daily_predictions = cursor.fetchall()
        
        conn.close()
        
        return {
            "total_predictions": total_predictions,
            "avg_confidence": round(avg_confidence, 3),
            "avg_processing_time": round(avg_processing_time, 3),
            "daily_predictions": [{"date": row[0], "count": row[1]} for row in daily_predictions]
        }
    
    def save_notification(self, user_id: Optional[int], title: str, message: str,
                        notification_type: str = "info", data: Optional[Dict] = None) -> int:
        """Lưu notification"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO notifications (user_id, title, message, notification_type, data)
            VALUES (?, ?, ?, ?, ?)
        ''', (user_id, title, message, notification_type, json.dumps(data or {})))
        
        notification_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return notification_id
    
    def get_user_notifications(self, user_id: int, limit: int = 50) -> List[Dict[str, Any]]:
        """Lấy notifications của user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, title, message, notification_type, data, is_read, created_at
            FROM notifications 
            WHERE user_id = ? OR user_id IS NULL
            ORDER BY created_at DESC 
            LIMIT ?
        ''', (user_id, limit))
        
        rows = cursor.fetchall()
        conn.close()
        
        notifications = []
        for row in rows:
            notifications.append({
                "id": row[0],
                "title": row[1],
                "message": row[2],
                "notification_type": row[3],
                "data": json.loads(row[4]) if row[4] else {},
                "is_read": bool(row[5]),
                "created_at": row[6]
            })
        
        return notifications
    
    def mark_notification_read(self, notification_id: int, user_id: int) -> bool:
        """Đánh dấu notification đã đọc"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE notifications 
            SET is_read = 1 
            WHERE id = ? AND (user_id = ? OR user_id IS NULL)
        ''', (notification_id, user_id))
        
        affected = cursor.rowcount
        conn.commit()
        conn.close()
        
        return affected > 0
    
    def save_insect_data(self, insect_id: str, vietnamese_name: str, scientific_name: str,
                        danger_level: str, affected_crops: str, habitat: str,
                        prevention: str, treatment: str, image_url: str = None) -> bool:
        """Lưu dữ liệu côn trùng"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT OR REPLACE INTO insect_data 
                (id, vietnamese_name, scientific_name, danger_level, affected_crops, 
                 habitat, prevention, treatment, image_url, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ''', (insect_id, vietnamese_name, scientific_name, danger_level, 
                  affected_crops, habitat, prevention, treatment, image_url))
            
            conn.commit()
            return True
        except Exception as e:
            print(f"Error saving insect data: {e}")
            return False
        finally:
            conn.close()
    
    def get_insect_data(self, insect_id: str) -> Optional[Dict[str, Any]]:
        """Lấy dữ liệu côn trùng"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, vietnamese_name, scientific_name, danger_level, affected_crops,
                   habitat, prevention, treatment, image_url, created_at, updated_at
            FROM insect_data WHERE id = ?
        ''', (insect_id,))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return {
                "id": row[0],
                "vietnamese_name": row[1],
                "scientific_name": row[2],
                "danger_level": row[3],
                "affected_crops": row[4],
                "habitat": row[5],
                "prevention": row[6],
                "treatment": row[7],
                "image_url": row[8],
                "created_at": row[9],
                "updated_at": row[10]
            }
        return None
    
    def log_system_event(self, log_level: str, message: str, data: Optional[Dict] = None):
        """Log system event"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO system_logs (log_level, message, data)
            VALUES (?, ?, ?)
        ''', (log_level, message, json.dumps(data or {})))
        
        conn.commit()
        conn.close()

# Global database manager
db_manager = DatabaseManager()

# Helper functions
def save_prediction(user_id: Optional[int], image_hash: str, image_size: int,
                   processing_time: float, confidence: float, insect_id: str,
                   bounding_box: Dict[str, Any]) -> int:
    """Helper function để lưu prediction"""
    return db_manager.save_prediction(user_id, image_hash, image_size, 
                                    processing_time, confidence, insect_id, bounding_box)

def get_prediction_stats() -> Dict[str, Any]:
    """Helper function để lấy prediction stats"""
    return db_manager.get_prediction_stats()

def log_system_event(log_level: str, message: str, data: Optional[Dict] = None):
    """Helper function để log system event"""
    return db_manager.log_system_event(log_level, message, data)
