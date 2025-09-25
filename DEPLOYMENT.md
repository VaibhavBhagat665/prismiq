# Deployment Guide - Backend & ML Services on Render

This guide walks you through deploying Prismiq's backend services on Render (Backend API + ML Service). 
**Note: Frontend is already deployed on Vercel.**

## 🚀 Quick Deploy

### Option 1: Blueprint Deployment (Recommended)
1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect `render.yaml` and deploy backend services

### Option 2: Manual Service Creation
Follow the individual service setup below.

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub repository
- [ ] `.env` file is gitignored (contains sensitive keys)
- [ ] Firebase project created and configured
- [ ] Gemini API key obtained
- [ ] All services have health check endpoints

## 🔧 Service Configuration

### 1. Backend API Service

**Service Settings:**
- **Type:** Web Service
- **Name:** `prismiq-backend`
- **Runtime:** Node.js
- **Build Command:** `cd server && npm install && npm run build`
- **Start Command:** `cd server && npm start`
- **Plan:** Starter (free tier)

**Environment Variables:**
```
NODE_ENV=production
PORT=4000
ML_SERVICE_URL=https://prismiq-ml-service.onrender.com
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-service-account-email
FIREBASE_PRIVATE_KEY=your-firebase-private-key
```

**Health Check:** `/health`

### 2. ML Service

**Service Settings:**
- **Type:** Web Service
- **Name:** `prismiq-ml-service`
- **Runtime:** Python
- **Build Command:** `cd ml-service && pip install -r requirements.txt`
- **Start Command:** `cd ml-service && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Plan:** Starter (free tier)

**Environment Variables:**
```
GEMINI_API_KEY=your-gemini-api-key
```

**Health Check:** `/health`

## 📝 Step-by-Step Deployment

### Step 1: Prepare Repository
```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub account

### Step 3: Deploy Backend Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure settings:
   - **Name:** `prismiq-backend`
   - **Runtime:** Node.js
   - **Build Command:** `cd server && npm install && npm run build`
   - **Start Command:** `cd server && npm start`
4. Add environment variables (see above)
5. Click "Create Web Service"

### Step 4: Deploy ML Service
1. Click "New" → "Web Service"
2. Select same repository
3. Configure settings:
   - **Name:** `prismiq-ml-service`
   - **Runtime:** Python
   - **Build Command:** `cd ml-service && pip install -r requirements.txt`
   - **Start Command:** `cd ml-service && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables
5. Click "Create Web Service"

### Step 5: Update Vercel Frontend Environment Variables
Once backend services are deployed, update your Vercel deployment with the new API URLs:

**In Vercel Dashboard → Project Settings → Environment Variables:**
```
VITE_API_URL=https://prismiq-backend.onrender.com
VITE_ML_SERVICE_URL=https://prismiq-ml-service.onrender.com
```

**Backend Environment Variables (in Render):**
```
ML_SERVICE_URL=https://prismiq-ml-service.onrender.com
```

## 🔒 Security Configuration

### Firebase Setup
1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project
   - Enable Firestore Database
   - Enable Authentication (Email/Password)

2. **Generate Service Account:**
   - Go to Project Settings → Service Accounts
   - Generate new private key
   - Download JSON file
   - Extract values for environment variables

3. **Get Web App Config:**
   - Go to Project Settings → General
   - Add web app if not exists
   - Copy configuration values

### Environment Variables Security
- Never commit `.env` files
- Use Render's environment variable interface
- Rotate keys regularly
- Use different Firebase projects for staging/production

## 🔍 Service URLs (After Deployment)
- **Frontend**: Already deployed on Vercel
- **Backend API**: `https://prismiq-backend.onrender.com`
- **ML Service**: `https://prismiq-ml-service.onrender.com`

## 🧪 Testing Deployment

### Health Checks
- Backend: `https://prismiq-backend.onrender.com/health`
- ML Service: `https://prismiq-ml-service.onrender.com/health`
- Frontend: Already deployed on Vercel

### API Testing
```bash
# Test backend API
curl https://prismiq-backend.onrender.com/api/pricing

# Test ML service
curl https://prismiq-ml-service.onrender.com/

# Test frontend connection to backend
# Check your Vercel deployment URL
```

## 🐛 Troubleshooting

### Common Issues

**Build Failures:**
- Check build logs in Render dashboard
- Verify package.json scripts
- Ensure all dependencies are listed

**Environment Variable Issues:**
- Verify all required variables are set
- Check for typos in variable names
- Ensure Firebase credentials are correct

**Service Communication:**
- Verify service URLs in environment variables
- Check CORS configuration
- Ensure health checks are responding

**Performance Issues:**
- Free tier services sleep after 15 minutes of inactivity
- Consider upgrading to paid plans for production
- Implement proper caching strategies

### Logs and Monitoring
- View logs in Render dashboard
- Set up log aggregation for production
- Monitor service health and performance

## 🚀 Production Considerations

### Scaling
- Upgrade to paid plans for better performance
- Enable auto-scaling for high traffic
- Use CDN for static assets

### Monitoring
- Set up uptime monitoring
- Configure error tracking (Sentry)
- Implement performance monitoring

### Security
- Enable HTTPS (automatic on Render)
- Configure security headers
- Implement rate limiting
- Regular security audits

## 💰 Cost Optimization

### Free Tier Limits
- 750 hours/month per service
- Services sleep after 15 minutes inactivity
- Limited bandwidth and storage

### Upgrade Path
- **Starter Plan:** $7/month per service
- **Standard Plan:** $25/month per service
- **Pro Plan:** $85/month per service

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Node.js Deployment Guide](https://render.com/docs/deploy-node-express-app)
- [Python Deployment Guide](https://render.com/docs/deploy-fastapi)
- [Static Site Deployment](https://render.com/docs/deploy-create-react-app)
