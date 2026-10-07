# ☁️ VITECH Cloud

**Your files. Your cloud. Your control.**

A professional private cloud storage platform by VITECH Africa. Store, organize, access, and share your files securely from anywhere.

![VITECH Cloud](https://img.shields.io/badge/VITECH-Cloud-6366f1?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-06b6d4?style=flat-square&logo=tailwindcss)

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────┐
│                    VITECH Cloud                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Frontend (React + Vite + Tailwind)                │
│  ├── Authentication (Supabase Auth)                │
│  ├── File Management UI                            │
│  ├── Admin Dashboard                               │
│  └── Storage Abstraction Layer                     │
│                                                     │
│  Backend / API                                      │
│  ├── Supabase PostgreSQL (metadata)                │
│  ├── Supabase Auth (authentication)                │
│  ├── Row Level Security (access control)           │
│  └── Storage Provider Interface                    │
│                                                     │
│  Storage                                            │
│  ├── Cloudflare R2 (production)                    │
│  ├── Local Storage (development/demo)              │
│  └── Extensible to MinIO, S3, NAS, etc.           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## ✨ Features

### For Users
- 🔐 Secure authentication with Supabase Auth
- 📁 Hierarchical folder management
- 📤 Drag & drop file upload with progress tracking
- 🔍 Full-text search across files and folders
- ⭐ Favorites system
- 🔗 Secure file sharing with expiring links
- 🗑 Trash with restore capability
- 📊 Storage quota management
- 🌙 Dark/Light mode
- 📱 Fully responsive design

### For Administrators
- 👥 User management
- 📊 Storage analytics
- 📋 Activity logs
- 🛡 Role-based access control
- 📈 Platform monitoring

### Technical
- 🏛 Clean architecture with storage provider abstraction
- 🔒 Row Level Security (RLS) on all tables
- ⚡ Optimized for performance (lazy loading, pagination)
- 🎨 Premium UI/UX with Framer Motion animations
- 📝 TypeScript strict mode
- ♿ Accessibility compliant

## 📋 Requirements

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Cloudflare account with R2 (for production)

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/vitechafrica/vitech-cloud.git
cd vitech-cloud

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## 🔧 Environment Variables

See `.env.example` for all available variables.

### Quick Setup (Demo Mode)

If you don't set `VITE_SUPABASE_URL`, the app runs in **demo mode** using localStorage. This is perfect for testing the UI without any external services.

### Production Setup

1. **Supabase**: Create a project at [supabase.com](https://supabase.com)
2. **R2**: Create a bucket at [Cloudflare](https://dash.cloudflare.com)
3. Run the SQL migrations in `supabase/migrations/`
4. Fill in your `.env` file

## 🗄 Database Setup

Run the migrations in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL Editor.

This creates:
- `profiles` — User profiles and quotas
- `folders` — Hierarchical folder structure
- `files` — File metadata (not the files themselves)
- `shares` — Share links with security options
- `activity_logs` — Audit trail
- `notifications` — User notifications
- `storage_usage` — Usage tracking

Plus Row Level Security policies ensuring users can only access their own data.

## 📦 Storage Architecture

The app uses a **Storage Provider** abstraction:

```typescript
interface StorageProvider {
  upload(params): Promise<{ key: string }>;
  download(key): Promise<Blob>;
  delete(key): Promise<void>;
  exists(key): Promise<boolean>;
  getSignedUrl(key): Promise<string>;
  // ... multipart upload methods
}
```

**Current implementations:**
- `R2StorageProvider` — Cloudflare R2 (production)
- `LocalStorageProvider` — Browser storage (development)

**Future implementations:**
- MinIO, AWS S3, Google Cloud Storage, self-hosted NAS

## 🛡 Security

- Row Level Security on all database tables
- Signed URLs for file access (never expose storage keys)
- Server-side validation of all operations
- No secrets in frontend code
- CSRF protection
- Rate limiting ready
- Input sanitization
- MIME type validation

## 📱 Responsive Design

Fully responsive across all devices:
- 🖥 Desktop (1920px+)
- 💻 Laptop (1024px - 1920px)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (< 768px)

## 🎨 Design System

- **Colors**: Brand indigo (#6366f1) + Cyan (#06b6d4)
- **Typography**: Inter font family
- **Components**: Custom UI library with consistent design tokens
- **Animations**: Framer Motion with `prefers-reduced-motion` support
- **Dark Mode**: Full dark mode support with system preference detection

## 🧪 Development

```bash
# Development server
npm run dev

# Type checking
npm run typecheck

# Production build
npm run build

# Preview production build
npm run preview
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard.

### Other Platforms

Build with `npm run build` and deploy the `dist/` folder to any static hosting.

## 🔮 Future Features

Architecture is prepared for:
- [ ] Team workspaces
- [ ] File versioning
- [ ] Desktop sync client
- [ ] Mobile apps (iOS/Android)
- [ ] Public API
- [ ] WebDAV support
- [ ] Client-side encryption
- [ ] Antivirus scanning
- [ ] OCR for documents
- [ ] Premium subscriptions
- [ ] Payment integration

## 📄 License

Proprietary — VITECH Africa © 2024

## 🤝 Contributing

This is a private project. Contact the VITECH team for access.

---

Built with ❤️ by **VITECH Africa**
