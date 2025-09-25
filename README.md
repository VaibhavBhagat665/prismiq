# Prismiq - AI-Powered Career Platform

Prismiq — Your Future, Decoded.

🚀 **Full-Stack AI Career Platform with Real Backend Integration!**

A comprehensive career guidance platform powered by AI, featuring real authentication, ML-driven recommendations, and intelligent career counseling.

## 🎯 Core Features

### ✅ 1. Career Recommendations
- **AI-Powered Matching**: Uses Gemini AI or fallback mock adapters for career suggestions
- **Personalized Results**: Based on user profile, interests, and skills
- **Real-time Storage**: Saves recommendations to Firestore with timestamps
- **Interactive Dashboard**: Visual cards with confidence scores and next steps

### ✅ 2. Skills Roadmap Generator
- **Dynamic Learning Paths**: Multi-phase roadmaps with timelines, skills, and projects
- **Career-Specific**: Tailored roadmaps for different career paths (Software Dev, Data Analyst, etc.)
- **Resource Integration**: Includes courses, documentation, and learning materials
- **Progress Tracking**: Save and track roadmap progress in Firestore

### ✅ 3. AI Chat Mentor
- **Conversational AI**: Powered by Gemini AI for natural career counseling
- **Multi-language Support**: English, Spanish, French language options
- **Context-Aware**: Uses user profile for personalized advice
- **Chat History**: Persistent conversation storage with message threading

### ✅ 4. Resume Analysis & Skills Extraction
- **PDF Processing**: Upload and parse PDF resumes automatically
- **AI Skills Extraction**: Identifies technical and soft skills from resume content
- **Gap Analysis**: Compares extracted skills with career requirements
- **Improvement Suggestions**: Actionable feedback for resume enhancement

### 🔐 5. Authentication & User Management
- **Firebase Authentication**: Secure signup/signin with email validation
- **Multi-step Onboarding**: Interactive wizard collecting user preferences
- **Demo Mode**: Guest access for trying features without registration
- **Profile Management**: Persistent user data and preferences

### 💰 6. Pricing & Subscription
- **Tiered Plans**: Free, Pro, and Enterprise tiers with feature limits
- **Usage Tracking**: Monitor API calls and feature usage
- **Upgrade Prompts**: Seamless upgrade flow for premium features

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   ML Service   │
│   (React/Vite)  │◄──►│   (Node/Express)│◄──►│   (FastAPI)     │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • Auth Routes   │    │ • Gemini AI     │
│ • Auth Wizard   │    │ • API Gateway   │    │ • Mock Adapters │
│ • File Upload   │    │ • File Handling │    │ • ML Endpoints  │
│ • Real-time UI  │    │ • Validation    │    │ • Resume Parser │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────────┐
                    │   Firebase          │
                    │   • Firestore DB    │
                    │   • Authentication  │
                    │   • Real-time Sync  │
                    │   • Security Rules  │
                    └─────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+ and pip
- Firebase project with Firestore enabled
- Gemini API key (optional, has fallback)

### 1. Clone and Install
```bash
git clone <repository-url>
cd prismiq

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Install ML service dependencies
cd ml-service && pip install -r requirements.txt && cd ..
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.template .env

# Edit .env with your credentials:
# - Firebase configuration
# - Gemini API key
# - Service URLs
```

**⚠️ SECURITY NOTICE**: Never commit your `.env` file to version control. It contains sensitive API keys and is gitignored for security.

### 3. Firebase Configuration
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Generate service account key
5. Update `.env` with Firebase credentials

### 4. Run the Application

#### Option A: Docker Compose (Recommended)
```bash
docker-compose up --build
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- ML Service: http://localhost:8000

#### Option B: Manual Development
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd server && npm run dev

# Terminal 3: ML Service
cd ml-service && uvicorn app.main:app --reload --port 8000
```

## 🔧 Configuration

### Environment Variables

#### Required
```bash
# Firebase (Required for auth and data)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Frontend Firebase Config
VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

#### Optional (Enhanced AI Features)
```bash
# Gemini AI (for real AI responses)
GEMINI_API_KEY=your-gemini-api-key
VITE_GEMINI_API_KEY=your-gemini-api-key

# OpenAI (alternative to Gemini)
OPENAI_API_KEY=sk-your-openai-key
```

### Firestore Security Rules
The application includes security rules in `infra/firestore.rules`:
- Users can only access their own data
- Demo users have limited access
- Authenticated read/write for user-specific collections

## 🧪 Testing

### Frontend
```bash
npm test                    # Run tests
npm run test:coverage      # Coverage report
```

### Backend
```bash
cd server
npm test                   # API tests
npm run test:integration   # Integration tests
```

### ML Service
```bash
cd ml-service
pytest                     # Python tests
pytest --cov=app          # Coverage report
```

## 📦 Deployment

### Production Build
```bash
# Build all services
npm run build
cd server && npm run build
```

### Docker Production
```bash
# Build production images
docker-compose -f docker-compose.prod.yml up --build
```

### Environment-Specific Deployment
- **Development**: Local with hot reload
- **Staging**: Docker with staging Firebase project
- **Production**: Optimized builds with production Firebase

## 🔍 API Documentation

### Backend Endpoints
- `POST /api/auth/demo-login` - Create/get demo user
- `POST /api/recommend` - Get career recommendations
- `GET /api/roadmap` - Generate skills roadmap
- `POST /api/chat` - AI chat mentor
- `POST /api/upload-resume` - Resume analysis
- `GET /api/pricing` - Pricing plans

### ML Service Endpoints
- `POST /recommend` - ML career matching
- `POST /roadmap` - Generate learning roadmap
- `POST /chat` - AI chat responses
- `POST /process_resume` - Resume parsing and analysis

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn/ui
- **State**: React Query + Context API
- **Authentication**: Firebase Auth
- **Database**: Firestore SDK

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Validation**: Joi
- **File Upload**: Multer + PDF-Parse
- **Database**: Firebase Admin SDK
- **HTTP Client**: Axios

### ML Service
- **Framework**: FastAPI + Python
- **AI**: Google Generative AI (Gemini)
- **Validation**: Pydantic
- **Fallback**: Mock adapters for offline mode

### Infrastructure
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Containerization**: Docker + Docker Compose
- **Deployment**: Multi-service architecture

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Firebase Connection Issues**
- Verify Firebase project ID and credentials
- Check Firestore security rules
- Ensure service account has proper permissions

**AI Features Not Working**
- Verify Gemini API key is set
- Check ML service is running on port 8000
- Fallback mock adapters should work without API keys

**File Upload Issues**
- Check file size limits (default 10MB)
- Verify PDF parsing dependencies are installed
- Ensure proper CORS configuration

**Development Server Issues**
- Clear node_modules and reinstall dependencies
- Check port conflicts (5173, 4000, 8000)
- Verify environment variables are loaded

### Support
For issues and questions, please open a GitHub issue with:
- Environment details (OS, Node version, etc.)
- Error messages and logs
- Steps to reproduce the issue
