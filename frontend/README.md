# Movie Ticket Booking Website

Website đặt vé xem phim trực tuyến được xây dựng bằng React, Redux và Ant Design với routing giữa các trang.

## Tính năng

- **Header Navigation**: Menu điều hướng chính với logo, search bar và các icon chức năng
- **Home Page**: Trang chủ với MovieSection và CinemaSection
- **Schedule Page**: Trang lịch chiếu phim với thông tin chi tiết
- **Movies Page**: Trang danh sách phim với tìm kiếm và lọc
- **Responsive Design**: Giao diện tương thích với mọi thiết bị
- **State Management**: Sử dụng Redux Toolkit để quản lý state
- **Routing**: Điều hướng giữa các trang với React Router

## Công nghệ sử dụng

- **React 18**: Framework frontend
- **Redux Toolkit**: State management
- **React Router**: Client-side routing
- **Ant Design**: UI component library
- **Vite**: Build tool
- **CSS3**: Styling và animations

## Cấu trúc dự án

```
src/
├── components/           # React components
│   ├── Header/          # Header component với navigation
│   ├── MovieCard/       # Component hiển thị thông tin phim
│   ├── MovieSection/    # Section hiển thị danh sách phim
│   └── CinemaSection/   # Section chọn rạp chiếu phim
├── pages/               # Các trang của ứng dụng
│   ├── Home/            # Trang chủ
│   ├── Schedule/        # Trang lịch chiếu
│   └── Movies/          # Trang danh sách phim
├── store/               # Redux store
│   ├── slices/          # Redux slices
│   │   ├── moviesSlice.js
│   │   ├── cinemasSlice.js
│   │   └── regionsSlice.js
│   └── index.js         # Store configuration
├── App.jsx              # Component chính với routing
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Cài đặt và chạy

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Chạy ứng dụng:**
   ```bash
   npm run dev
   ```

3. **Build production:**
   ```bash
   npm run build
   ```

4. **Preview build:**
   ```bash
   npm run preview
   ```

## Cấu trúc Component và Pages

### Header Component
- Navigation menu với các link chính
- Logo "movesk" ở giữa
- Search bar và các icon chức năng

### Home Page
- MovieSection: Carousel hiển thị danh sách phim
- CinemaSection: Chọn khu vực và rạp chiếu phim

### Schedule Page
- Hiển thị lịch chiếu phim theo ngày
- Thông tin chi tiết về suất chiếu
- Trạng thái còn vé/hết vé

### Movies Page
- Danh sách phim với tìm kiếm và lọc
- Sắp xếp theo rating, ngày, giá
- Hiển thị thông tin chi tiết mỗi phim

### MovieCard Component
- Hiển thị thông tin phim dạng card
- Hover effects và animations
- Nút "Mua vé" khi hover

## State Management

Sử dụng Redux Toolkit với 3 slices chính:

- **moviesSlice**: Quản lý danh sách phim và phim được chọn
- **regionsSlice**: Quản lý khu vực và khu vực được chọn
- **cinemasSlice**: Quản lý danh sách rạp và rạp được chọn

## Routing

Ứng dụng sử dụng React Router với các route chính:

- `/` - Trang chủ (Home)
- `/schedule` - Trang lịch chiếu (Schedule)
- `/movies` - Trang danh sách phim (Movies)

## Responsive Design

- Mobile-first approach
- Breakpoints: 576px, 768px, 992px, 1200px
- Adaptive layout cho các kích thước màn hình khác nhau

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License
