# AmiAble Platform Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd amiable
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env.local
```

4. **Configure environment variables**
Edit `.env.local` and update:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:3000`

## 📋 Required Setup

**Environment Variables:**
- ✅ **NEXT_PUBLIC_APP_URL** - Your application URL

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### File Upload
The platform includes a file upload component that currently uses local file handling. In a production environment, you would integrate with your preferred file storage solution.

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Ensure environment variables are set
- Build and deploy using standard Next.js commands

## 📁 Project Structure

```
amiable/
├── app/                 # Next.js app directory
│   ├── components/      # Reusable UI components
│   ├── explore/         # Talent discovery
│   ├── register/        # Registration forms
│   ├── talent/          # Talent profiles
│   ├── projects/        # Project management
│   ├── analytics/       # Analytics dashboard
│   └── admin/           # Admin panel
├── prisma/              # Database schema (if using Prisma)
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## 🆘 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Use a different port
npm run dev -- -p 3001
```

**Environment variables not loading:**
- Ensure `.env.local` exists in the root directory
- Restart the development server after changes

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Next Steps

1. **Customize the platform** - Modify components and styling
2. **Add authentication** - Integrate your preferred auth solution
3. **Set up file storage** - Configure your file upload solution
4. **Add database** - Connect to your preferred database
5. **Deploy** - Deploy to your hosting platform

---

**AmiAble** - Building inclusive bridges in the media industry. 