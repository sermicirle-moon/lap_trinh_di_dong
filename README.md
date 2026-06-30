# Zentask Mobile - Ứng dụng Quản lý Năng suất Cá nhân

Zentask Mobile là một ứng dụng di động quản lý năng suất cá nhân toàn diện, đa nền tảng được xây dựng bằng **React Native (Expo)** và **Node.js/Express**. Được lấy cảm hứng từ các công cụ quản lý năng suất hàng đầu như *TickTick* và *Todoist*, Zentask Mobile tích hợp quản lý tác vụ, lịch biểu, theo dõi thói quen, trình hẹn giờ tập trung sâu và các phương pháp ưu tiên thời gian vào một trải nghiệm di động thống nhất và bảo mật.

---

## Các Tính năng Nổi bật

* **Quản lý Tác vụ & Thư mục Thông minh:** Tạo danh sách tùy chỉnh, lồng danh sách vào trong thư mục và phân loại công việc bằng thẻ (tags). Các danh sách thông minh tự động (Hộp thư đến, Hôm nay, 7 ngày tới, Đã hoàn thành, Thùng rác) giúp sắp xếp công việc khoa học.
* **Lịch trình Kép Tương tác trực quan:**
  * **Chế độ xem Agenda:** Danh sách lịch trình hàng ngày trực quan đồng bộ với lịch mở rộng.
  * **Chế độ xem lưới giờ (Hour Grid):** Lưới thời gian chi tiết hỗ trợ cử chỉ **kéo thả (drag-and-drop)** để lên lịch lại công việc/sự kiện nhanh chóng, đi kèm các nút điều khiển phóng to/thu nhỏ (zoom).
* **Theo dõi Thói quen Khoa học:** Xây dựng lộ trình thói quen hàng ngày/hàng tuần. Tích hợp thuật toán **Habit Streak Algorithm** tự động tính toán số ngày check-in liên tục và ngăn chặn check-in trước cho các ngày ở tương lai.
* **Đồng hồ Tập trung (Deep Work Timer):** Trình hẹn giờ Pomodoro với nhiều danh mục (Công việc, Học tập, Cá nhân), ghi nhận số lần tạm dừng và lưu trữ phiên tập trung chi tiết phục vụ vẽ biểu đồ thống kê hiệu suất.
* **Ma trận Eisenhower:** Phân loại công việc vào 4 góc phần tư ưu tiên (Làm ngay, Lên lịch, Ủy quyền, Loại bỏ) giúp tối ưu hóa việc ra quyết định.
* **Xác thực Bảo mật & Cô lập Dữ liệu:** Hệ thống đăng ký/đăng nhập an toàn sử dụng mã hóa mật khẩu **Bcrypt** và quản lý phiên bằng **JWT**. Thiết lập Middleware ở Backend tự động cô lập dữ liệu theo từng tài khoản (`userId`), bảo vệ quyền riêng tư tuyệt đối.

---

## Công nghệ Sử dụng

* **Frontend:**
  * React Native & Expo SDK (v54)
  * React Navigation (Stack, Drawer, Bottom Tabs)
  * React Native Calendars & React Native Big Calendar (hỗ trợ kéo thả)
  * React Native Reanimated & Gesture Handler
* **Backend:**
  * Node.js & Express
  * JSON Server (Cơ sở dữ liệu giả lập có hooks)
  * JSON Web Token (JWT) & BcryptJS (Mã hóa mật khẩu)
  * Expo Secure Store (Lưu trữ token mã hóa phía client)

---

##  Kiến trúc & Mô hình Thiết kế

Dự án được cấu trúc theo mô hình **Kiến trúc 3 lớp (3-Layer Architecture)** để tách biệt các thành phần, giảm thiểu code trùng lặp và tăng khả năng bảo trì:

```
                  ┌───────────────────────┐
                  │    Tầng Component     │  <-- Giao diện & Các thành phần UI React Native
                  └───────────┬───────────┘
                              │
                  ┌───────────▼───────────┐
                  │       Tầng Hook       │  <-- Các Custom Hooks quản lý State cục bộ/toàn cục
                  └───────────┬───────────┘
                              │
                  ┌───────────▼───────────┐
                  │     Tầng Service      │  <-- Xử lý gọi API & Giao tiếp HTTP client
                  └───────────────────────┘
```

* **Tầng Service** ([src/services/](file:///e:/l%E1%BA%ADp%20tr%C3%ACnh%20di%20%C4%91%E1%BB%99ng/NangSuatCaNhanMobile/src/services)): Giao tiếp trực tiếp với Backend API.
* **Tầng Hook** ([src/hooks/](file:///e:/l%E1%BA%ADp%20tr%C3%ACnh%20di%20%C4%91%E1%BB%99ng/NangSuatCaNhanMobile/src/hooks)): Chứa logic xử lý nghiệp vụ chính (quản lý danh sách, đồng bộ lịch, cập nhật tác vụ) và quản lý state.
* **Tầng Component** ([src/Components/](file:///e:/l%E1%BA%ADp%20tr%C3%ACnh%20di%20%C4%91%E1%BB%99ng/NangSuatCaNhanMobile/src/Components)): Các component UI tái sử dụng.

---

## Cấu trúc Thư mục Chính

```
NangSuatCaNhanMobile/
├── assets/                 # Tài nguyên hình ảnh, biểu tượng ứng dụng
├── auth-server.js          # Máy chủ xác thực Backend Express (JWT/Bcrypt)
├── db_full.json            # File lưu trữ dữ liệu (users, tasks, habits, focus)
├── App.js                  # Entry point chính của ứng dụng React Native
├── app.json                # File cấu hình Expo
└── src/
    ├── Components/         # Các Component dùng chung & component theo tính năng
    ├── hooks/              # Các Custom Hooks xử lý State và Logic nghiệp vụ
    ├── Navigation/         # Cấu hình định tuyến (Tabs, Drawer, Stacks)
    ├── Screens/            # Màn hình chính (Calendar, Focus, Habits, Matrix, Tasks, Auth)
    └── services/           # Lớp gọi API client và tương tác database
```

---

## Hướng dẫn Cài đặt & Khởi chạy

### Yêu cầu hệ thống
Đảm bảo máy tính của bạn đã cài đặt Node.js và điện thoại đã cài đặt ứng dụng **Expo Go** (trên Google Play hoặc App Store).

### 1. Tải các gói phụ thuộc (Dependencies)
```bash
npm install
```

### 2. Khởi chạy máy chủ xác thực Backend
Server Express giả lập dữ liệu sẽ chạy trên cổng 3000.
```bash
node auth-server.js
```

### 3. Khởi chạy ứng dụng Expo
```bash
npx expo start
```
*Quét mã QR hiển thị ở terminal bằng ứng dụng **Expo Go** (đối với Android) hoặc ứng dụng Camera (đối với iOS) để khởi chạy giao diện trên thiết bị di động.*
