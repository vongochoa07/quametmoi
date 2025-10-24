"""
Notification System cho IP102 Insect Pest Recognition
"""
import asyncio
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Dict, Any, List, Optional
import os

class NotificationManager:
    def __init__(self):
        self.notifications = []
        self.subscribers = []
        self.email_config = {
            "smtp_server": os.getenv("SMTP_SERVER", "smtp.gmail.com"),
            "smtp_port": int(os.getenv("SMTP_PORT", "587")),
            "username": os.getenv("EMAIL_USERNAME", ""),
            "password": os.getenv("EMAIL_PASSWORD", ""),
            "from_email": os.getenv("FROM_EMAIL", "noreply@ip102.com")
        }
    
    def add_notification(self, title: str, message: str, notification_type: str = "info", 
                        user_id: Optional[str] = None, data: Optional[Dict] = None):
        """Thêm notification mới"""
        notification = {
            "id": f"notif_{len(self.notifications) + 1}",
            "title": title,
            "message": message,
            "type": notification_type,  # info, warning, error, success
            "user_id": user_id,
            "data": data or {},
            "created_at": datetime.utcnow().isoformat(),
            "read": False
        }
        
        self.notifications.append(notification)
        
        # Gửi real-time notification
        asyncio.create_task(self.send_realtime_notification(notification))
        
        return notification
    
    async def send_realtime_notification(self, notification: Dict[str, Any]):
        """Gửi real-time notification"""
        # Trong thực tế, có thể dùng WebSocket hoặc Server-Sent Events
        print(f"📢 Real-time notification: {notification['title']}")
        
        # Gửi email nếu có subscribers
        if self.subscribers:
            await self.send_email_notification(notification)
    
    async def send_email_notification(self, notification: Dict[str, Any]):
        """Gửi email notification"""
        try:
            if not self.email_config["username"]:
                return
            
            msg = MIMEMultipart()
            msg['From'] = self.email_config["from_email"]
            msg['To'] = ", ".join(self.subscribers)
            msg['Subject'] = f"IP102 Alert: {notification['title']}"
            
            body = f"""
            <h2>{notification['title']}</h2>
            <p>{notification['message']}</p>
            <p><strong>Type:</strong> {notification['type']}</p>
            <p><strong>Time:</strong> {notification['created_at']}</p>
            <hr>
            <p><em>IP102 Insect Pest Recognition System</em></p>
            """
            
            msg.attach(MIMEText(body, 'html'))
            
            server = smtplib.SMTP(self.email_config["smtp_server"], self.email_config["smtp_port"])
            server.starttls()
            server.login(self.email_config["username"], self.email_config["password"])
            server.send_message(msg)
            server.quit()
            
            print(f"✅ Email notification sent: {notification['title']}")
            
        except Exception as e:
            print(f"❌ Error sending email: {e}")
    
    def subscribe_email(self, email: str):
        """Subscribe email notifications"""
        if email not in self.subscribers:
            self.subscribers.append(email)
            return True
        return False
    
    def unsubscribe_email(self, email: str):
        """Unsubscribe email notifications"""
        if email in self.subscribers:
            self.subscribers.remove(email)
            return True
        return False
    
    def get_notifications(self, user_id: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        """Lấy notifications"""
        notifications = self.notifications
        
        if user_id:
            notifications = [n for n in notifications if n.get("user_id") == user_id]
        
        # Sắp xếp theo thời gian mới nhất
        notifications.sort(key=lambda x: x["created_at"], reverse=True)
        
        return notifications[:limit]
    
    def mark_as_read(self, notification_id: str, user_id: Optional[str] = None) -> bool:
        """Đánh dấu notification đã đọc"""
        for notification in self.notifications:
            if notification["id"] == notification_id:
                if user_id and notification.get("user_id") != user_id:
                    return False
                notification["read"] = True
                return True
        return False
    
    def get_unread_count(self, user_id: Optional[str] = None) -> int:
        """Đếm số notifications chưa đọc"""
        notifications = self.notifications
        
        if user_id:
            notifications = [n for n in notifications if n.get("user_id") == user_id]
        
        return len([n for n in notifications if not n.get("read", False)])
    
    def create_system_notification(self, event_type: str, data: Dict[str, Any]):
        """Tạo system notification"""
        notifications_map = {
            "prediction_completed": {
                "title": "Phân tích hoàn thành",
                "message": f"Đã phân tích ảnh và phát hiện {data.get('count', 0)} côn trùng",
                "type": "success"
            },
            "model_updated": {
                "title": "Mô hình AI đã được cập nhật",
                "message": f"Độ chính xác mới: {data.get('accuracy', 'N/A')}%",
                "type": "info"
            },
            "system_error": {
                "title": "Lỗi hệ thống",
                "message": f"Đã xảy ra lỗi: {data.get('error', 'Unknown error')}",
                "type": "error"
            },
            "high_usage": {
                "title": "Cảnh báo sử dụng cao",
                "message": f"CPU usage: {data.get('cpu', 'N/A')}%, Memory: {data.get('memory', 'N/A')}%",
                "type": "warning"
            }
        }
        
        notification_config = notifications_map.get(event_type, {
            "title": "System Notification",
            "message": "A system event occurred",
            "type": "info"
        })
        
        return self.add_notification(
            title=notification_config["title"],
            message=notification_config["message"],
            notification_type=notification_config["type"],
            data=data
        )
    
    def get_notification_stats(self) -> Dict[str, Any]:
        """Lấy thống kê notifications"""
        total = len(self.notifications)
        unread = len([n for n in self.notifications if not n.get("read", False)])
        
        by_type = {}
        for notification in self.notifications:
            notif_type = notification.get("type", "unknown")
            by_type[notif_type] = by_type.get(notif_type, 0) + 1
        
        return {
            "total_notifications": total,
            "unread_notifications": unread,
            "read_notifications": total - unread,
            "by_type": by_type,
            "subscribers": len(self.subscribers)
        }

# Global notification manager
notification_manager = NotificationManager()

# Helper functions
def add_notification(title: str, message: str, notification_type: str = "info", 
                   user_id: Optional[str] = None, data: Optional[Dict] = None):
    """Helper function để thêm notification"""
    return notification_manager.add_notification(title, message, notification_type, user_id, data)

def create_system_notification(event_type: str, data: Dict[str, Any]):
    """Helper function để tạo system notification"""
    return notification_manager.create_system_notification(event_type, data)

def get_notifications(user_id: Optional[str] = None, limit: int = 50):
    """Helper function để lấy notifications"""
    return notification_manager.get_notifications(user_id, limit)

def get_unread_count(user_id: Optional[str] = None):
    """Helper function để lấy số notifications chưa đọc"""
    return notification_manager.get_unread_count(user_id)
