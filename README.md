# AmiAble - Empowering Talent with Disabilities in Media

A purpose-driven, professionally managed digital platform that functions as a central talent directory and portfolio repository for individuals who have disabilities, specifically tailored for opportunities in the film, television, and OTT industries.

## 🎯 Mission

To bridge the gap between inclusive hiring goals and accessible talent pipelines by providing a comprehensive platform where individuals who have disabilities can showcase their skills and industry professionals can discover diverse talent.

## 🚀 Features

- **Advanced Talent Discovery**: Search and filter by skills, location, experience, and more
- **Social Media Integration**: Embed reels from Instagram, Facebook, and YouTube
- **Portfolio Management**: Upload and showcase work samples, images, and documents
- **Contact & Invitation System**: Direct communication between talent and industry professionals
- **Profile Creation**: Multi-step profile builder with tagging and media upload
- **File Management**: Local file handling for portfolio management

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Forms**: React Hook Form, Zod validation
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd amiable
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── Navigation.tsx   # Main navigation sidebar
│   ├── FileUpload.tsx   # File upload component
│   ├── SocialMediaEmbed.tsx # Social media integration
│   ├── AdvancedSearch.tsx   # Search and filtering
│   ├── ContactTalent.tsx    # Contact modal
│   └── ProfileCreator.tsx   # Profile creation form
├── explore/             # Talent discovery page
├── register/            # Talent registration
├── talent/              # Individual talent profiles
├── projects/            # Project management
├── analytics/           # Analytics dashboard
└── admin/               # Admin panel
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_APP_URL` | Your application URL | Yes |

### File Upload Configuration

The application supports:
- **Image files**: JPG, PNG, GIF, WebP
- **Video files**: MP4, MOV, AVI, WebM
- **Documents**: PDF, DOC, DOCX
- **Maximum file size**: 10MB per file
- **Maximum files**: 5 per upload

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update component styles in individual files
- Add new animations using Framer Motion

### Features
- Add new file types in `FileUpload.tsx`
- Extend search filters in `AdvancedSearch.tsx`
- Customize profile fields in `ProfileCreator.tsx`

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Ensure environment variables are set
- Build and deploy using standard Next.js commands

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository. 