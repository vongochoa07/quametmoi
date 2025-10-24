"""
User Authentication System cho IP102 Insect Pest Recognition
"""
import os
import jwt
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import json

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "ip102-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Security
security = HTTPBearer()

# User Database (trong thực tế nên dùng database thật)
users_db = {
    "admin": {
        "username": "admin",
        "password_hash": hashlib.sha256("admin123".encode()).hexdigest(),
        "email": "admin@ip102.com",
        "role": "admin",
        "created_at": "2024-01-01T00:00:00Z",
        "is_active": True
    },
    "user": {
        "username": "user",
        "password_hash": hashlib.sha256("user123".encode()).hexdigest(),
        "email": "user@ip102.com",
        "role": "user",
        "created_at": "2024-01-01T00:00:00Z",
        "is_active": True
    }
}

# Session storage (trong thực tế nên dùng Redis)
active_sessions = {}

class AuthManager:
    def __init__(self):
        self.secret_key = SECRET_KEY
        self.algorithm = ALGORITHM
    
    def hash_password(self, password: str) -> str:
        """Hash password với salt"""
        salt = secrets.token_hex(16)
        password_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return f"{salt}:{password_hash.hex()}"
    
    def verify_password(self, password: str, hashed_password: str) -> bool:
        """Verify password"""
        try:
            salt, password_hash = hashed_password.split(':')
            password_hash_check = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
            return password_hash_check.hex() == password_hash
        except:
            return False
    
    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        """Tạo JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Dict[str, Any]:
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            username: str = payload.get("sub")
            if username is None:
                raise HTTPException(status_code=401, detail="Invalid token")
            return payload
        except jwt.PyJWTError:
            raise HTTPException(status_code=401, detail="Invalid token")
    
    def authenticate_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user"""
        user = users_db.get(username)
        if not user:
            return None
        
        # Simple password check (trong thực tế nên dùng proper hashing)
        if user["password_hash"] == hashlib.sha256(password.encode()).hexdigest():
            return user
        return None
    
    def register_user(self, username: str, password: str, email: str, role: str = "user") -> Dict[str, Any]:
        """Register new user"""
        if username in users_db:
            raise HTTPException(status_code=400, detail="Username already exists")
        
        # Hash password
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        # Create user
        user = {
            "username": username,
            "password_hash": password_hash,
            "email": email,
            "role": role,
            "created_at": datetime.utcnow().isoformat(),
            "is_active": True
        }
        
        users_db[username] = user
        
        return {
            "username": username,
            "email": email,
            "role": role,
            "created_at": user["created_at"]
        }
    
    def get_current_user(self, credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
        """Get current authenticated user"""
        token = credentials.credentials
        payload = self.verify_token(token)
        username = payload.get("sub")
        
        user = users_db.get(username)
        if not user or not user.get("is_active"):
            raise HTTPException(status_code=401, detail="User not found or inactive")
        
        return user
    
    def require_role(self, required_role: str):
        """Decorator để check role"""
        def role_checker(current_user: Dict[str, Any] = Depends(self.get_current_user)):
            if current_user.get("role") != required_role:
                raise HTTPException(status_code=403, detail="Insufficient permissions")
            return current_user
        return role_checker

# Global auth manager
auth_manager = AuthManager()

# Dependency functions
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Get current user dependency"""
    return auth_manager.get_current_user(credentials)

def require_admin(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Require admin role"""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

def require_user(current_user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
    """Require user role (user or admin)"""
    if current_user.get("role") not in ["user", "admin"]:
        raise HTTPException(status_code=403, detail="User access required")
    return current_user

# Auth endpoints sẽ được thêm vào main.py
def create_auth_endpoints(app):
    """Tạo auth endpoints"""
    
    @app.post("/auth/login")
    async def login(username: str, password: str):
        """Login endpoint"""
        user = auth_manager.authenticate_user(username, password)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        access_token = auth_manager.create_access_token(data={"sub": username})
        
        # Store session
        session_id = secrets.token_urlsafe(32)
        active_sessions[session_id] = {
            "username": username,
            "created_at": datetime.utcnow().isoformat()
        }
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "session_id": session_id,
            "user": {
                "username": user["username"],
                "email": user["email"],
                "role": user["role"]
            }
        }
    
    @app.post("/auth/register")
    async def register(username: str, password: str, email: str):
        """Register endpoint"""
        try:
            user = auth_manager.register_user(username, password, email)
            return {
                "message": "User registered successfully",
                "user": user
            }
        except HTTPException as e:
            raise e
    
    @app.post("/auth/logout")
    async def logout(session_id: str):
        """Logout endpoint"""
        if session_id in active_sessions:
            del active_sessions[session_id]
        return {"message": "Logged out successfully"}
    
    @app.get("/auth/me")
    async def get_current_user_info(current_user: Dict[str, Any] = Depends(get_current_user)):
        """Get current user info"""
        return {
            "username": current_user["username"],
            "email": current_user["email"],
            "role": current_user["role"],
            "created_at": current_user["created_at"]
        }
    
    @app.get("/auth/sessions")
    async def get_active_sessions(admin_user: Dict[str, Any] = Depends(require_admin)):
        """Get active sessions (admin only)"""
        return {
            "active_sessions": len(active_sessions),
            "sessions": list(active_sessions.values())
        }
