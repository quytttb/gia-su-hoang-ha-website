# 🎓 **Gia Sư Hoàng Hà - Website Trung Tâm Gia Sư**

Website chính thức của Trung tâm Gia Sư Hoàng Hà tại Thanh Hóa - Nơi kết nối tri thức và ước mơ.

## 🌟 **Tính Năng Chính**

### ✅ **Đã Hoàn Thành**

- 🏠 **Trang chủ** với banner và giới thiệu
- 📚 **Danh sách khóa học** với tìm kiếm và lọc
- 📖 **Chi tiết khóa học** với thông tin đầy đủ
- 📝 **Đăng ký khóa học** với EmailJS integration
- 📞 **Liên hệ** với form gửi email tự động
- 📅 **Lịch học** với calendar view
- 👥 **Giới thiệu** về trung tâm và đội ngũ
- 🔐 **Trang quản trị** với dashboard
- 📱 **Facebook Integration** với fanpage chính thức
- 🔒 **Bảo mật** với validation và rate limiting
- ⚡ **Tối ưu hiệu suất** với code splitting
- 🔍 **SEO** optimization hoàn chỉnh
- 🧪 **Testing** với 91.83% coverage

### 🆕 **Tính Năng Mới (Latest Update)**

- 📧 **EmailJS Integration**: Gửi email trực tiếp từ frontend
- 🤖 **Enhanced Chatbot**: AI chatbot thông minh với quick replies
- 📱 **Facebook Integration**: Kết nối trực tiếp với fanpage
- 🎯 **Interactive UI**: Quick reply buttons và Facebook buttons
- 💬 **Smart Responses**: Phản hồi thông minh với emoji và formatting

## 🚀 **Cài Đặt & Chạy Dự Án**

### **Yêu Cầu Hệ Thống**

- Node.js 18+
- npm hoặc yarn

### **Cài Đặt**

```bash
# Clone repository
git clone <repository-url>
cd gia-su-hoang-ha-website

# Cài đặt dependencies
npm install

# Tạo file environment variables
cp .env.example .env
# Cập nhật các giá trị trong .env (xem CONFIGURATION.md)

# Chạy development server
npm run dev

# Mở http://localhost:3000
```

### **Build Production**

```bash
# Build cho production
npm run build

# Preview production build
npm run preview
```

## 📧 **Cấu Hình EmailJS**

### **Bước 1: Tạo tài khoản EmailJS**

1. Truy cập https://www.emailjs.com/
2. Đăng ký tài khoản miễn phí
3. Tạo Email Service (Gmail/Outlook)
4. Tạo Email Templates (xem `CONFIGURATION.md`)

### **Bước 2: Cập nhật .env**

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT=your_contact_template
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_REGISTRATION=your_registration_template
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### **Bước 3: Test Email**

- Vào `/contact` và test form liên hệ
- Vào `/courses/[id]/register` và test đăng ký khóa học

## 📱 **Facebook Integration**

### **Tính Năng**

- ✅ Facebook buttons trong contact form và registration form
- ✅ Chatbot với Facebook integration
- ✅ Direct link đến fanpage chính thức
- ✅ Quick replies trong chatbot để truy cập Facebook
- ✅ Responsive design cho mọi thiết bị

### **Facebook Fanpage**

- **URL**: https://www.facebook.com/profile.php?id=61575087818708
- **Tên**: Gia Sư Hoàng Hà Official
- **Tính năng**: Nhắn tin trực tiếp, cập nhật tin tức, hình ảnh hoạt động

## 🤖 **Enhanced Chatbot**

### **Tính Năng Mới**

- ✅ **Quick Reply Buttons**: Phản hồi nhanh với các lựa chọn sẵn có
- ✅ **Facebook Integration**: Nút truy cập trực tiếp đến fanpage
- ✅ **Smart Responses**: Phản hồi thông minh với emoji và formatting
- ✅ **Enhanced UI**: Giao diện đẹp hơn với gradient và animations
- ✅ **Multiple Message Types**: Text, quick-reply, contact, facebook
- ✅ **Contextual Responses**: Phản hồi phù hợp với ngữ cảnh

### **Cách Sử Dụng**

1. Click vào chatbot button ở góc phải màn hình
2. Chọn quick reply hoặc nhập câu hỏi
3. Sử dụng Facebook button để kết nối trực tiếp
4. Chatbot sẽ hướng dẫn và hỗ trợ 24/7

## 🛠️ **Scripts Có Sẵn**

```bash
# Development
npm run dev          # Chạy dev server
npm run build        # Build production
npm run preview      # Preview production build

# Testing
npm test             # Chạy unit tests
npm run test:watch   # Chạy tests ở watch mode
npm run test:coverage # Xem coverage report

# SEO Testing
npm run test:seo     # Test SEO configuration
npm run test:seo:prod # Test SEO trên production build

# Code Quality
npm run lint         # Chạy ESLint
npm run format       # Format code với Prettier

# Deployment
npm run deploy       # Deploy lên Vercel (preview)
npm run deploy:prod  # Deploy lên production
npm run deploy:quick # Deploy nhanh
```

## 📁 **Cấu Trúc Dự Án**

```
├── docs/                   # Documentation and reports
│   └── seo-reports/       # SEO test reports
├── public/                 # Static assets
│   └── images/            # Public images (logos, etc.)
├── scripts/               # Build and deployment scripts
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── blog/         # Blog-related components
│   │   ├── classes/      # Course/class components
│   │   ├── contact/      # Contact form components
│   │   ├── home/         # Homepage components
│   │   ├── layout/       # Layout components (Header, Footer)
│   │   ├── panel/        # Admin panel components
│   │   ├── schedule/     # Schedule components
│   │   ├── shared/       # Shared/common components
│   │   └── ui/           # Reusable UI components
│   ├── config/           # Configuration files
│   ├── constants/        # Constants and static data
│   ├── contexts/         # React contexts (Auth)
│   ├── hooks/            # Custom React hooks + TanStack Query hooks
│   ├── stores/           # Zustand stores (theme, notifications)
│   ├── lib/              # External libraries setup
│   ├── pages/            # Page components
│   ├── services/         # API services and external integrations
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
└── tools/                # Development tools
    └── cloudinary-scripts/ # Cloudinary setup scripts
```

## 🔧 **Công Nghệ Sử Dụng**

### **Core**

- ⚛️ **React 18** với TypeScript
- ▲ **Next.js 16** (App Router)
- 🎨 **Tailwind CSS v4** + **Shadcn/ui**
- 🔥 **Firebase** (Firestore, Auth)
- 📦 **Zustand** (client state) + **TanStack Query** (server state)

### **Integrations**

- 📧 **EmailJS** cho email functionality
- 📱 **Facebook Integration** cho social messaging
- 🔍 **SEO optimization** với meta tags và structured data

### **Development**

- 🧪 **Vitest** cho testing
- 🔍 **ESLint** cho code quality
- 💅 **Prettier** cho code formatting
- 🐕 **Husky** cho git hooks

## 📊 **Thống Kê Dự Án**

### **Performance**

- ⚡ **Initial Bundle**: 167.42 kB (54.78 kB gzipped)
- 🚀 **Code Splitting**: Giảm 55% initial load
- 📱 **Mobile-first**: Responsive design
- 🔍 **SEO Score**: 100/100
- 🤖 **Enhanced Chatbot**: 12.87 kB (5.12 kB gzipped)

### **Testing Coverage**

- 🧪 **Total Tests**: 59 tests
- ✅ **Coverage**: 91.83% for utilities
- 📁 **Test Files**: 5 test suites

### **Bundle Analysis**

```
Main chunks:
- index.js: 167.42 kB (core app)
- dataService.js: 42.42 kB (data layer)
- AdminPage.js: 52.50 kB (admin features)
- SchedulePage.js: 68.03 kB (calendar features)
- Chatbot.js: 12.87 kB (enhanced chatbot)
```

## 🔐 **Bảo Mật**

- ✅ Input validation và sanitization
- ✅ Rate limiting cho forms
- ✅ XSS protection
- ✅ Environment variables cho sensitive data
- ✅ Security headers

## 📞 **Liên Hệ & Hỗ Trợ**

### **Thông Tin Trung Tâm**

- 📍 **Địa chỉ**: 265 - Đường 06, Phường Nam Ngạn, Thanh Hóa
- 📞 **Điện thoại**: 0385.510.892 - 0962.390.161
- 📧 **Email**: lienhe@giasuhoangha.com
- 📱 **Facebook**: https://www.facebook.com/profile.php?id=61575087818708

### **Hỗ Trợ Kỹ Thuật**

- 📖 **Documentation**: Xem `CONFIGURATION.md`
- 🔍 **SEO Guide**: Xem `SEO_TESTING_GUIDE.md`
- ✅ **Testing Guide**: Xem `TESTING.md`

## 📈 **Roadmap**

### **Phase 2 (Upcoming)**

- 🔥 **Firebase Integration** cho real-time data
- 📊 **Google Analytics** tracking
- 🗺️ **Google Maps** integration
- 📱 **Messenger Bot** nâng cao

### **Phase 3 (Future)**

- 🎥 **Video streaming** cho học online
- 💳 **Payment gateway** integration
- 📱 **Mobile app** development
- 🤖 **AI chatbot** với machine learning

---

**🎯 Mục tiêu**: Tạo ra website trung tâm gia sư hiện đại, thân thiện và hiệu quả nhất tại Thanh Hóa!

**💡 Slogan**: "Nơi kết nối tri thức và ước mơ" 🌟

## 📚 **Tài Liệu Chi Tiết**

Tất cả tài liệu hướng dẫn chi tiết được tổ chức trong thư mục [`docs/`](./docs/):

### 🚀 **Deploy & DevOps**

- [Deploy Guide](./docs/DEPLOYMENT_GUIDE.md) - Hướng dẫn deploy lên Vercel
- [Deployment](./docs/DEPLOYMENT.md) - Tài liệu deployment chi tiết
- [Monitoring](./docs/MONITORING.md) - Hướng dẫn monitoring

### 🔧 **Setup & Configuration**

- [Configuration](./docs/CONFIGURATION.md) - Cấu hình dự án
- [Firebase Setup](./docs/FIREBASE_SETUP_VI.md) - Setup Firebase (Tiếng Việt)
- [Cloudinary Setup](./docs/CLOUDINARY_SETUP.md) - Setup Cloudinary

### 🧪 **Testing & Quality**

- [Testing Guide](./docs/TESTING.md) - Hướng dẫn testing
- [Security](./docs/SECURITY.md) - Tài liệu bảo mật

### 🎨 **SEO & Marketing**

- [SEO Guide](./docs/SEO.md) - Hướng dẫn SEO chi tiết
- [SEO Checklist](./docs/SEO_CHECKLIST.md) - SEO Checklist
- [SEO Testing](./docs/SEO_TESTING_GUIDE.md) - Hướng dẫn test SEO

**📖 Xem tất cả**: [Danh sách đầy đủ tài liệu](./docs/README.md)
