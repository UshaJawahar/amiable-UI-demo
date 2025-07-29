# Inclusive Talent Directory Platform

A purpose-driven, professionally managed digital platform that functions as a central talent directory and portfolio repository for individuals with disabilities, specifically tailored for opportunities in the film, television, and OTT industries.

## 🎯 Mission

To bridge the gap between inclusive hiring goals and accessible talent pipelines by providing a comprehensive platform where disabled individuals can showcase their skills and industry professionals can discover diverse talent.

## ✨ Key Features

### For Talented Individuals
- **Dual Career Tracks**: Choose between Production roles (behind-the-scenes) and Acting roles (on-screen performance)
- **Professional Portfolio**: Upload videos, images, documents, and showcase your work
- **Verification System**: OTP verification and admin approval for authenticity
- **Featured Profiles**: Standout talents highlighted by admin team
- **Industry Access**: Direct connection to film studios, OTT platforms, and casting agencies

### For Industry Professionals
- **Verified Talent Pool**: Curated profiles of skilled individuals with disabilities
- **Advanced Filtering**: Search by role type, skills, language, location, and more
- **Quality Assurance**: Admin-moderated content ensures professional standards
- **Direct Connection**: Request connections through platform admin or inquiry forms

### For Administrators
- **Comprehensive Dashboard**: Full visibility into platform operations
- **User Management**: Approve/reject profiles, manage featured listings
- **Content Moderation**: Quality control and flagging system
- **Analytics**: Platform growth, user engagement, and performance metrics

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (React-based SSR Framework)
- **Styling**: Tailwind CSS with custom accessibility-focused design
- **Animations**: Framer Motion for smooth interactions
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React for consistent iconography
- **Notifications**: React Hot Toast for user feedback
- **TypeScript**: Full type safety throughout the application

## 🎨 Design Philosophy

### Accessibility-First
- WCAG 2.1 AA compliant design
- High contrast mode support
- Reduced motion preferences
- Screen reader friendly
- Keyboard navigation support

### Modern UI/UX
- Clean, professional interface
- Responsive design for all devices
- Smooth animations and transitions
- Intuitive user flows
- Consistent design system

## 📱 Pages & Features

### Home Page (`/`)
- Hero section with clear value proposition
- Feature highlights and statistics
- Testimonials from industry professionals
- Call-to-action sections

### Explore Page (`/explore`)
- Interactive talent browsing
- Advanced filtering and search
- Responsive grid layout
- Quick action buttons (view, favorite, message)

### Registration Page (`/register`)
- Purpose selection (Talent vs Professional)
- Dynamic forms based on selection
- Disability certificate upload for verification
- Portfolio upload functionality
- Comprehensive validation

### Admin Dashboard (`/admin`)
- **Dashboard**: Overview with key metrics
- **Users**: Complete user management
- **Approvals**: Pending profile approvals
- **Featured**: Manage featured profiles
- **Analytics**: Platform performance data
- **Settings**: Platform configuration

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd talent-directory-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and Tailwind config
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   ├── explore/           # Talent exploration
│   ├── register/          # User registration
│   └── admin/             # Admin dashboard
├── components/            # Reusable components
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## 🎭 User Workflows

### Talent Registration Flow
1. **Purpose Selection**: Choose between Production or Acting roles
2. **Basic Information**: Personal details and contact information
3. **Professional Details**: Skills, experience, languages, bio
4. **Accessibility Information**: Disability type and certificate upload
5. **Portfolio Upload**: Work samples and documentation
6. **Verification**: OTP verification and admin approval

### Professional Registration Flow
1. **Purpose Selection**: Choose professional/hiring role
2. **Basic Information**: Personal details and contact information
3. **Company Information**: Company details, size, industry
4. **Hiring Needs**: Type of talent and project requirements
5. **Verification**: Admin approval for industry access

### Admin Management Flow
1. **Dashboard Overview**: Monitor platform metrics
2. **User Management**: Approve, reject, or feature profiles
3. **Content Moderation**: Review and manage user content
4. **Analytics**: Track platform growth and engagement
5. **Settings**: Configure platform parameters

## 🔒 Security & Privacy

- **OTP Verification**: Secure user authentication
- **Admin Approval**: Manual verification for quality control
- **Data Protection**: Secure handling of personal information
- **Accessibility Compliance**: WCAG 2.1 AA standards
- **Privacy Policy**: Clear data usage guidelines

## 🌟 Platform Differentiators

| Feature | Value |
|---------|-------|
| **Role-Based Structuring** | Clearly separates Production and Acting profiles |
| **Verified User Base** | OTP and admin approval for authenticity |
| **Featured Profiles** | Admin curation highlights standout users |
| **Industry-Facing Output** | Focused on portfolios, not just listings |
| **Accessibility-First UI** | Built with disabled users in mind |
| **Admin Control** | Enables strict moderation and quality assurance |

## 📊 Target Impact

### For Disabled Talent
- **Structured Access**: Professional platform for skill showcase
- **Industry Visibility**: Direct connection to decision-makers
- **Career Growth**: Clear pathways for skill development
- **Authentic Representation**: Verified, professional profiles

### For Industry
- **Diverse Talent Pool**: Access to verified disabled professionals
- **Inclusive Hiring**: Support for diversity initiatives
- **Quality Assurance**: Pre-screened, professional candidates
- **Efficient Discovery**: Advanced filtering and search capabilities

## 🤝 Contributing

We welcome contributions to make the platform more inclusive and accessible. Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions, support, or partnership opportunities:
- Email: admin@inclusive-talent.com
- Website: https://inclusive-talent-directory.com

## 🙏 Acknowledgments

- Backstage.com for inspiration in talent management platforms
- WCAG guidelines for accessibility standards
- The disability community for valuable insights and feedback
- Industry professionals for guidance on inclusive hiring practices

---

**Building bridges between inclusive hiring goals and accessible talent pipelines.** 