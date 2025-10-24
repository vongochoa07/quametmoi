# Frontend - Insect Pest Recognition

## Mô tả
Frontend React responsive cho ứng dụng nhận diện sâu bệnh/côn trùng gây hại. Giao diện được thiết kế để hoạt động tốt trên cả desktop và mobile.

## Tính năng

### 🖥️ Giao diện Responsive
- Thiết kế responsive hoạt động trên mọi thiết bị
- Giao diện thân thiện, dễ sử dụng
- Tối ưu cho mobile và desktop

### 📱 Chức năng chính
- **Upload ảnh**: Kéo thả hoặc chọn file ảnh
- **Nhận diện AI**: Sử dụng API để phân tích ảnh
- **Hiển thị kết quả**: Thông tin chi tiết về côn trùng
- **Danh sách côn trùng**: Xem tất cả 102 loài
- **Tìm kiếm & lọc**: Tìm kiếm theo tên, mức độ nguy hiểm

### 🎨 UI/UX
- Thiết kế hiện đại với gradient và shadow
- Animation mượt mà
- Toast notification
- Loading states
- Error handling

## Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình environment
Tạo file `.env` trong thư mục frontend:
```env
REACT_APP_API_URL=http://localhost:8000
```

### 3. Chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## Cấu trúc dự án

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   └── ImageUpload.js
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── ResultPage.js
│   │   ├── InsectListPage.js
│   │   └── AboutPage.js
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   └── global.css
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Công nghệ sử dụng

### Core
- **React 18**: Thư viện UI chính
- **React Router**: Điều hướng trang
- **Axios**: HTTP client

### UI/UX
- **Styled Components**: CSS-in-JS
- **Lucide React**: Icon library
- **React Toastify**: Notification
- **React Dropzone**: File upload

### Development
- **Create React App**: Build tool
- **ESLint**: Code linting
- **Prettier**: Code formatting

## API Integration

### Endpoints sử dụng
- `POST /predict` - Nhận diện côn trùng
- `GET /insects` - Lấy danh sách côn trùng
- `GET /insects/{id}` - Thông tin chi tiết
- `GET /health` - Kiểm tra trạng thái

### Error Handling
- Network errors
- API errors
- File upload errors
- Validation errors

## Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Features
- Touch-friendly interface
- Swipe gestures
- Mobile-optimized forms
- Responsive images

## Performance

### Optimization
- Lazy loading components
- Image optimization
- Bundle splitting
- Caching strategies

### Loading States
- Skeleton screens
- Progress indicators
- Error boundaries
- Retry mechanisms

## Deployment

### Build for production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

## Environment Variables

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000

# Optional
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Scripts
```bash
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
npm run eject      # Eject CRA (not recommended)
```

### Code Style
- ESLint configuration
- Prettier formatting
- Component structure
- Naming conventions

## Troubleshooting

### Common Issues
1. **API Connection Error**
   - Kiểm tra backend đang chạy
   - Kiểm tra CORS configuration
   - Kiểm tra API URL

2. **File Upload Issues**
   - Kiểm tra file size limit
   - Kiểm tra file format
   - Kiểm tra network connection

3. **Performance Issues**
   - Kiểm tra bundle size
   - Kiểm tra image optimization
   - Kiểm tra API response time

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - Xem file LICENSE để biết thêm chi tiết.
