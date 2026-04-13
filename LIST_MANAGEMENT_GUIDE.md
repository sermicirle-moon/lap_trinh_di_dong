# Hệ Thống Quản Lý List & Folder - Tài Liệu Kiến Trúc

## 📋 Tổng Quan

Hệ thống quản lý danh sách (List) và thư mục (Folder) được refactor từ kiểu TickTick, với kiến trúc 3 layers:
- **Service Layer** (listService.js) - Logic xử lý
- **Hook Layer** (useListManagement.js) - State management
- **Component Layer** (ListManagement/*) - UI Components

## 📁 Cấu Trúc Thư Mục

```
src/
├── services/
│   ├── dbAPI.js           ✅ Cập nhật: Thêm methods cho tasks
│   ├── apiClient.js        
│   └── listService.js      🆕 Service layer - Logic CRUD
│
├── hooks/
│   └── useListManagement.js 🆕 Hook quản lý toàn bộ state
│
├── Components/
│   ├── CustomDrawer.js     ✅ Refactored sử dụng ListManager
│   └── ListManagement/     🆕 Thư mục mới chứa các component
│       ├── ListManager.js        - Component chính
│       ├── ListItem.js           - Item hiển thị trong list
│       ├── ListForm.js           - Form thêm/sửa danh sách
│       ├── FolderForm.js         - Form thêm/sửa thư mục
│       ├── TagForm.js            - Form thêm/sửa tag
│       ├── ListColorPicker.js     - Chọn màu sắc
│       ├── ContextMenu.js         - Menu ẩn phải (long press)
│       └── AddMenuModal.js        - Modal chọn thêm
```

## 🎯 Các Tính Năng

### ✅ Tính Năng List
- **Tạo mới** list độc lập hoặc trong folder
- **Sửa tên, màu sắc, biểu tượng** của list
- **Xóa** list (với xác nhận)
- **Chọn màu** từ 8 màu có sẵn
- **Chọn icon** từ 5 biểu tượng khác nhau

### ✅ Tính Năng Folder
- **Tạo mới** folder để organize
- **Sửa tên, màu sắc, biểu tượng** của folder
- **Xóa** folder (xóa cả list con)
- **Mở/Đóng** folder để xem/ẩn list con
- **Thêm list con** vào folder từ context menu

### ✅ Tính Năng Tag
- **Tạo mới** tag để phân loại task
- **Sửa tên, màu sắc** của tag
- **Xóa** tag

### ✅ Smart Lists (Mặc định)
- Hộp thư đến (Inbox)
- Hôm nay (Today)
- 7 ngày tới (Next 7 Days)
- Đã hoàn thành (Done)
- Thùng rác (Trash)

## 📊 Data Model

### List/Folder Object
```javascript
{
  id: "list_1234567890",
  title: "Công việc quan trọng",
  isFolder: false,           // true nếu là folder
  icon: "list-outline",
  color: "#2D9CDB",
  tasks: [],                 // Chứa tasks của list này
  lists: [],                 // Chỉ dùng khi isFolder=true
  createdAt: "2026-04-13T...",
  updatedAt: "2026-04-13T...",
  order: 1681404...          // Dùng để sắp xếp
}
```

### Tag Object
```javascript
{
  id: "tag_1234567890",
  title: "UI/UX",
  color: "#2D9CDB",
  createdAt: "2026-04-13T...",
  updatedAt: "2026-04-13T..."
}
```

## 🔧 Cách Sử Dụng Hook

```javascript
import { useListManagement } from '../hooks/useListManagement';

export function MyComponent() {
  const {
    folders,           // State: mảng folder/list
    tags,              // State: mảng tag
    isLoading,         // State: đang tải?
    expandedFolders,   // State: folder nào đang mở
    
    createFolder,      // Function: tạo folder
    updateFolder,      // Function: sửa folder
    deleteFolder,      // Function: xóa folder
    
    createList,        // Function: tạo list độc lập
    createListInFolder,// Function: tạo list trong folder
    updateList,        // Function: sửa list
    deleteList,        // Function: xóa list
    
    createTag,         // Function: tạo tag
    updateTag,         // Function: sửa tag
    deleteTag,         // Function: xóa tag
    
    toggleFolder,      // Function: mở/đóng folder
    findList,          // Function: tìm list theo ID
    getAllTasks,       // Function: lấy tất cả tasks
    fetchAllData,      // Function: làm mới dữ liệu
  } = useListManagement();

  // Sử dụng các functions...
  const handleCreate = async () => {
    try {
      await createList("Dự án mới", "#F2994A", "star-outline");
    } catch (error) {
      console.error('Error:', error);
    }
  };
}
```

## 🎨 Màu Sắc Có Sẵn

```javascript
[
  "#2D9CDB",  // Xanh (Blue)
  "#27AE60",  // Xanh lá (Green)
  "#F2994A",  // Cam (Orange)
  "#EB5757",  // Đỏ (Red)
  "#9B51E0",  // Tím (Purple)
  "#50E3C2",  // Cyan
  "#F5A623",  // Vàng (Gold)
  "#828282",  // Xám (Gray)
]
```

## 🎯 Biểu Tượng Có Sẵn

### List Icons
- list-outline
- document
- folder-outline
- star-outline
- heart-outline

### Folder Icons
- folder-outline
- folder-open
- shapes
- archive
- briefcase

## 🔄 Flow Ứng Dụng

```
CustomDrawer (Sidebar)
    ↓
ListManager
    ├─→ Render Smart Lists
    ├─→ Render Folders + Lists
    ├─→ Render Tags
    ├─→ Context Menu (long press)
    ├─→ Add Menu Modal (button +)
    └─→ Forms (List/Folder/Tag)
           ↓
        useListManagement Hook
           ↓
        listService (Logic)
           ↓
        dbAPI / Backend
```

## 💾 Lưu Trữ Dữ Liệu

Mặc định, ứng dụng kết nối đến `json-server` chạy trên `http://localhost:3000`:

```bash
# Các endpoint
GET    /folders
POST   /folders
PUT    /folders/:id
DELETE /folders/:id

GET    /tags        
POST   /tags
PUT    /tags/:id
DELETE /tags/:id

GET    /smartLists
GET    /tasks
```

## 🚀 Cách Chạy

1. Khởi động json-server
```bash
npm install -g json-server
json-server --watch db.json --port 3000
```

2.Chạy app
```bash
expo start
```

3. Quét QR code trên Expo Go

## 📝 Quy Ước Code

- **Tên Component**: CamelCase, mô tả hành động (ListForm, FolderForm)
- **Tên File**: Giống tên Component (.js)
- **Hook**: useXxx (useListManagement)
- **Service**: xxxService.js (listService.js)
- **Const màu**: COLORS (array), PRIORITY_COLORS (object)
- **Comment**: // Dùng cho inline, /** */ cho block

## 🐛 Debugging

### Kiểm tra state
```javascript
import { useListManagement } from '../hooks/useListManagement';

// Trong component
const { folders, tags, isLoading } = useListManagement();
console.log('Folders:', folders);
console.log('Tags:', tags);
console.log('Loading:', isLoading);
```

### Kiểm tra API
```javascript
// Sử dụng React Native Debugger
// hoặc console.log ở service layer
```

## ✨ Tính Năng Tiếp Theo

- [ ] Drag & drop reorder list
- [ ] Search list/folder/tag
- [ ] Bulk operations (select multiple)
- [ ] Archive list
- [ ] Share list
- [ ] Notification
- [ ] Sync với cloud backend

---

**Cập nhật:** 13/04/2026
**Version:** 2.0 (Refactored Architecture)
