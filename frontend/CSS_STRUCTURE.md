# Cấu Trúc CSS - Booking Movie Ticket

## Tổng Quan
Dự án đã được tái cấu trúc CSS để mỗi component có CSS riêng, tránh việc dùng chung CSS gây lỗi khi sửa.

## Cấu Trúc Thư Mục CSS

```
src/
├── styles/
│   └── utilities.css          # Utility classes chung
├── components/
│   ├── Header/
│   │   ├── Header.jsx
│   │   └── Header.css         # CSS riêng cho Header
│   ├── Footer/
│   │   ├── Footer.jsx
│   │   └── Footer.css         # CSS riêng cho Footer
│   ├── MovieCard/
│   │   ├── MovieCard.jsx
│   │   └── MovieCard.css      # CSS riêng cho MovieCard
│   └── ...
├── pages/
│   ├── Home/
│   │   ├── Home.jsx
│   │   └── Home.css           # CSS riêng cho Home page
│   ├── Movies/
│   │   ├── Movies.jsx
│   │   └── Movies.css         # CSS riêng cho Movies page
│   ├── Schedule/
│   │   ├── Schedule.jsx
│   │   └── Schedule.css       # CSS riêng cho Schedule page
│   ├── Community/
│   │   ├── Community.jsx
│   │   └── Community.css      # CSS riêng cho Community page
│   └── ...
├── App.jsx
├── App.css                    # CSS cho layout chính và global styles
├── index.css                  # CSS reset và base styles
└── main.jsx                   # Import utilities.css
```

## Quy Tắc Sử Dụng

### 1. CSS cho Component
- Mỗi component phải có file CSS riêng
- Đặt tên file CSS trùng với tên component
- Import CSS trong component tương ứng

```jsx
// Header.jsx
import './Header.css'

// Header.css
.header { ... }
.header-content { ... }
```

### 2. CSS cho Page
- Mỗi page phải có file CSS riêng
- Đặt tên file CSS trùng với tên page
- Import CSS trong page tương ứng

```jsx
// Home.jsx
import './Home.css'

// Home.css
.home-container { ... }
.home-hero { ... }
```

### 3. CSS Global (App.css)
- Chỉ chứa CSS cho layout chính
- CSS override cho Ant Design
- Global animations và loading states
- Không chứa CSS cụ thể cho component/page

### 4. Utility Classes (utilities.css)
- Các class tiện ích chung
- Spacing, colors, display, flexbox, grid
- Responsive utilities
- Có thể sử dụng ở bất kỳ đâu trong dự án

## Lợi Ích Của Cấu Trúc Mới

### ✅ Ưu Điểm
1. **Dễ bảo trì**: Mỗi component có CSS riêng, dễ tìm và sửa
2. **Tránh xung đột**: Không có CSS dùng chung gây lỗi
3. **Tái sử dụng**: Component có thể dễ dàng di chuyển giữa các dự án
4. **Performance**: Chỉ load CSS cần thiết cho từng component
5. **Teamwork**: Nhiều developer có thể làm việc song song không lo xung đột

### ❌ Nhược Điểm
1. **Nhiều file**: Cần quản lý nhiều file CSS
2. **Import nhiều**: Cần import CSS trong mỗi component

## Hướng Dẫn Sửa CSS

### Khi sửa Header
```bash
# Chỉ sửa file này
src/components/Header/Header.css
```

### Khi sửa Home page
```bash
# Chỉ sửa file này
src/pages/Home/Home.css
```

### Khi sửa MovieCard
```bash
# Chỉ sửa file này
src/components/MovieCard/MovieCard.css
```

### Khi sửa layout chung
```bash
# Sửa file này
src/App.css
```

### Khi thêm utility classes
```bash
# Sửa file này
src/styles/utilities.css
```

## Best Practices

### 1. Naming Convention
- Sử dụng BEM hoặc kebab-case cho class names
- Prefix class với tên component/page

```css
/* Header.css */
.header { ... }
.header-content { ... }
.header-menu { ... }

/* Home.css */
.home-container { ... }
.home-hero { ... }
.home-sections { ... }
```

### 2. Responsive Design
- Sử dụng media queries trong mỗi file CSS
- Không tạo responsive chung trong utilities.css

```css
/* Trong Home.css */
@media (max-width: 768px) {
  .home-hero h1 {
    font-size: 2rem;
  }
}
```

### 3. CSS Variables
- Sử dụng CSS variables cho colors, spacing chung
- Đặt trong :root hoặc App.css

```css
:root {
  --primary-color: #1890ff;
  --secondary-color: #52c41a;
  --text-color: #333;
  --border-radius: 8px;
}
```

### 4. Import Order
```jsx
// Thứ tự import CSS
import 'antd/dist/reset.css'        // Ant Design reset
import './index.css'                 // Base styles
import './styles/utilities.css'      // Utility classes
import './App.css'                   // App layout
import './Component.css'             // Component specific
```

## Troubleshooting

### CSS không hoạt động
1. Kiểm tra import CSS trong component
2. Kiểm tra đường dẫn file CSS
3. Kiểm tra CSS specificity

### CSS bị xung đột
1. Sử dụng CSS modules hoặc CSS-in-JS
2. Tăng specificity bằng cách thêm parent selector
3. Sử dụng !important (chỉ khi cần thiết)

### Performance issues
1. Sử dụng CSS minification
2. Lazy load CSS cho component không cần thiết
3. Sử dụng CSS critical path

## Kết Luận
Cấu trúc CSS mới giúp dự án dễ bảo trì, tránh xung đột và tăng hiệu suất phát triển. Mỗi developer có thể làm việc độc lập trên component/page riêng biệt.
