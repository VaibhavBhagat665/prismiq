# SECURITY

## Environment Variables & API Keys

### 🔒 Secure Setup Instructions

1. **Never commit `.env` files to version control**
   - `.env` is gitignored to prevent accidental commits
   - Use `.env.template` as reference for required variables

2. **Setting up your local environment:**
   ```bash
   # Copy the template
   cp .env.template .env
   
   # Edit .env with your actual credentials
   # Replace placeholder values with real API keys
   ```

3. **Required API Keys:**
   - **Firebase Web API Key**: Get from Firebase Console > Project Settings > Web Apps
   - **Gemini API Key**: Get from Google AI Studio (https://makersuite.google.com/app/apikey)
   - **Firebase Service Account**: Download from Firebase Console > Project Settings > Service Accounts

4. **Production Deployment:**
   - Use environment variables in your hosting platform
   - Never hardcode API keys in source code
   - Rotate keys regularly
   - Use different Firebase projects for dev/staging/prod

### 🚨 Security Checklist

#### Authentication & Authorization
- ✅ Firebase Authentication implemented
- ✅ Firestore security rules for user data isolation
- ✅ Demo mode with limited access
- ⚠️ Add rate limiting for production
- ⚠️ Implement session management

#### API Security
- ✅ Input validation with Joi schemas
- ✅ CORS configuration
- ✅ File upload size limits
- ⚠️ Add API rate limiting
- ⚠️ Implement request logging

#### Data Protection
- ✅ User data stored in isolated Firestore collections
- ✅ Sensitive operations require authentication
- ⚠️ Add data encryption at rest
- ⚠️ Implement audit logging

#### Infrastructure
- ⚠️ Enforce HTTPS in production
- ⚠️ Add security headers (HSTS, CSP, etc.)
- ⚠️ Implement WAF/CDN protection
- ⚠️ Add monitoring and alerting

### 🔑 API Key Management

**Local Development:**
```bash
# Your .env should contain:
GEMINI_API_KEY=your_actual_gemini_key
VITE_FIREBASE_API_KEY=your_actual_firebase_key
# ... other keys
```

**Production Deployment:**
- Use platform environment variables (Vercel, Netlify, etc.)
- Never expose keys in client-side code
- Use different keys for different environments

### 📋 Pre-Production Checklist

Before deploying to production:
- [ ] All API keys moved to environment variables
- [ ] Firestore rules reviewed and tightened
- [ ] Rate limiting implemented
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Monitoring and logging enabled
- [ ] Backup and recovery procedures tested
