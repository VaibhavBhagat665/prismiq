# Prismiq - AI-Powered Career Platform

Prismiq — Your Future, Decoded.

🚀 **Functional Prototype with 4 Core Features Implemented!**

This monorepo contains a complete career guidance platform with:
- **Frontend**: React + TypeScript + Tailwind UI with comprehensive Dashboard
- **Server**: Node.js Express API gateway (Firestore + ML proxy)
- **ML Service**: Python FastAPI service (embeddings, recommender, roadmap, chat)
- **Database**: Firebase Firestore for real-time data
- **Infra**: Deployment and seed scripts

## 🎯 Implemented Features

### ✅ 1. Career Recommendations
- **Backend API**: `POST /api/recommend` - ML-powered career matching
- **Frontend Component**: `CareerRecommendations.tsx` with real-time updates
- **ML Service**: Embedding-based similarity matching with confidence scores
- **Database**: Saves recommendations to Firestore `users/demo-user/recommendations`

### ✅ 2. Skills Roadmap
- **Backend API**: `GET /api/roadmap?career=` - Generates learning paths
- **Frontend Component**: `Roadmap.tsx` with interactive timeline
- **ML Service**: Template-based multi-phase roadmaps with courses and projects
- **Database**: Saves roadmaps to Firestore `users/demo-user/roadmaps`

### ✅ 3. AI Chat Mentor
- **Backend API**: `POST /api/chat` - Conversational career guidance
- **Frontend Component**: `ChatBox.tsx` with real-time messaging
- **ML Service**: LangChain-based agent with career search capabilities
- **Database**: Saves chat history to Firestore `users/demo-user/chats`

### ✅ 4. Resume Upload & Analysis
- **Backend API**: `POST /api/upload-resume` - PDF parsing and skill extraction
- **Frontend Component**: `ResumeUpload.tsx` with drag-and-drop interface
- **ML Service**: Text extraction and skill identification
- **Database**: Saves extracted skills to Firestore `users/demo-user/resumeSkills`

### 🎨 Enhanced Dashboard
- **Tabbed Interface**: Overview, Recommendations, Roadmap, AI Mentor, Resume
- **Real-time Updates**: Firebase listeners for live data synchronization
- **Modern UI**: Glassmorphic cards, progress indicators, interactive elements
- **Job Listings**: Integrated job search with filtering and platform badges

## Architecture

```
[React Dashboard] <---> [Job API Service] <---> [LinkedIn/Naukri/Internshala APIs]
       |                       |
       |                       v
       |                [Cache Layer]
       |                       |
       v                       v
[ML Recommendations] <---> [Firebase Firestore]
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Shadcn/ui
- **State Management**: React Query for API state
- **Routing**: React Router v6
- **APIs**: Axios for HTTP requests
- **Styling**: Tailwind CSS with custom components
- **Icons**: Lucide React
- **Build Tool**: Vite

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## License

MIT License - see LICENSE file for details.
