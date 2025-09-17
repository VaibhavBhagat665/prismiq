# Prismiq - AI-Powered Career Dashboard

Prismiq — Your Future, Decoded.

🚀 **NEW: Career Dashboard with ML-powered job suggestions from LinkedIn, Naukri, and Internshala!**

This monorepo contains:
- **Frontend**: React + TypeScript + Tailwind UI with Career Dashboard
- **Server**: Node.js Express API gateway (Firestore + ML proxy)
- **ML Service**: Python FastAPI service (embeddings, recommender, roadmap, chat)
- **Job Integration**: Real-time job opportunities from multiple platforms
- **Infra**: Deployment and seed scripts

## 🎯 Features

- **AI Career Dashboard**: Personalized job recommendations with ML-powered matching
- **Multi-Platform Integration**: LinkedIn, Naukri, and Internshala job listings
- **Smart Filtering**: Search by skills, location, experience, and platform
- **Career Insights**: AI-powered suggestions for skill gaps and career progression
- **Real-time Updates**: Live job market data and trending opportunities

## 🚀 Quick Start

### Option 1: Docker (Recommended)
1. Copy `.env.example` to `.env` and configure API keys (see API Setup section)
2. `docker-compose up --build`
3. Open http://localhost:3000

### Option 2: Local Development
1. Install dependencies: `npm install`
2. Set up environment variables (see API Setup section)
3. Start development server: `npm run dev`
4. Navigate to `/dashboard` to see job opportunities

## 🔧 Free API Integration Guide

### LinkedIn Jobs API (Free Tier)

**Option 1: LinkedIn Developer Program (Recommended)**
1. Visit [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Create a LinkedIn App:
   - Go to "My Apps" → "Create App"
   - Fill in app details (name, company, etc.)
   - Select "Sign In with LinkedIn" product
3. Get API credentials:
   - Copy `Client ID` and `Client Secret`
   - Add redirect URL: `http://localhost:3000/auth/linkedin/callback`
4. Add to `.env`:
   ```bash
   REACT_APP_LINKEDIN_CLIENT_ID=your_client_id
   REACT_APP_LINKEDIN_CLIENT_SECRET=your_client_secret
   ```

**Option 2: JSearch API (RapidAPI) - Free 2500 requests/month**
1. Visit [JSearch on RapidAPI](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
2. Subscribe to free plan
3. Get API key from dashboard
4. Add to `.env`:
   ```bash
   REACT_APP_JSEARCH_API_KEY=your_rapidapi_key
   ```

### Naukri Jobs API (Free Scraping Alternative)

**Option 1: Naukri Developer API (If Available)**
1. Contact Naukri.com for API access
2. Follow their developer documentation

**Option 2: Free Web Scraping (Legal Alternative)**
1. Use Puppeteer/Playwright for scraping:
   ```bash
   npm install puppeteer
   ```
2. Implement respectful scraping with rate limits
3. Example scraping service included in `src/services/jobApiService.ts`

### Internshala API (Free Alternative)

**Option 1: Internshala Partner Program**
1. Apply for Internshala Partner Program
2. Get API access for educational/non-commercial use

**Option 2: RSS Feed Integration (Free)**
1. Use Internshala's RSS feeds:
   ```
   https://internshala.com/feeds/internships
   ```
2. Parse RSS with libraries like `rss-parser`:
   ```bash
   npm install rss-parser
   ```

### Alternative Free Job APIs

**1. Adzuna API - 1000 calls/month free**
```bash
# Register at: https://developer.adzuna.com/
REACT_APP_ADZUNA_APP_ID=your_app_id
REACT_APP_ADZUNA_API_KEY=your_api_key
```

**2. Jobs2Careers API - Free tier available**
```bash
# Register at: https://api.jobs2careers.com/
REACT_APP_J2C_API_KEY=your_api_key
```

**3. GitHub Jobs API (Free)**
```bash
# No API key required
# Endpoint: https://jobs.github.com/positions.json
```

**4. RemoteOK API (Free)**
```bash
# No API key required
# Endpoint: https://remoteok.io/api
```

### Environment Configuration

Create `.env` file in project root:
```bash
# LinkedIn API
REACT_APP_LINKEDIN_CLIENT_ID=your_linkedin_client_id
REACT_APP_LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Alternative APIs
REACT_APP_JSEARCH_API_KEY=your_jsearch_key
REACT_APP_ADZUNA_APP_ID=your_adzuna_app_id
REACT_APP_ADZUNA_API_KEY=your_adzuna_key

# Naukri (if available)
REACT_APP_NAUKRI_API_KEY=your_naukri_key

# Internshala (if available)
REACT_APP_INTERNSHALA_API_KEY=your_internshala_key

# Optional: Rate limiting
REACT_APP_API_RATE_LIMIT=100
```

### Implementation Notes

1. **Rate Limiting**: All APIs have rate limits. The service includes automatic retry logic.

2. **Caching**: Implement Redis/localStorage caching to reduce API calls:
   ```javascript
   // Cache jobs for 1 hour
   const CACHE_DURATION = 60 * 60 * 1000;
   ```

3. **Error Handling**: Graceful fallbacks to mock data when APIs are unavailable.

4. **CORS Issues**: Use proxy server or CORS-anywhere for development:
   ```javascript
   const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
   ```

5. **Legal Compliance**: 
   - Respect robots.txt for scraping
   - Follow API terms of service
   - Implement proper attribution

### Testing the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/dashboard`

3. Check browser console for API responses

4. Test different search filters and platforms

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

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist`

## Security

- API keys are environment variables (never committed)
- CORS properly configured
- Rate limiting implemented
- Input validation on all forms
- XSS protection with proper sanitization

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

MIT License - see LICENSE file for details.
