# APIfyn - No-Code API Automation Platform

**APIfyn** is a powerful no-code workflow automation platform that enables users to connect multiple APIs, automate business processes, and leverage AI capabilities through an intuitive drag-and-drop interface.

## Features

### **Visual Workflow Builder**
- Drag-and-drop interface for creating automations
- Connect triggers, actions, conditions, and AI processing blocks
- Real-time workflow visualization with connection flows

###  **Extensive Integrations**
- **Email**: Gmail API integration
- **Communication**: Slack messaging
- **Data**: Google Sheets, Google Drive
- **Payments**: Stripe, Razorpay webhooks
- **Forms**: Typeform, custom webhook support
- **AI**: OpenAI, Hugging Face sentiment analysis
- **Custom APIs**: REST API connector for any service

### **AI-Powered Processing**
- Sentiment analysis for text processing
- Keyword extraction from content
- Automated data categorization
- Smart routing based on AI insights

### **Subscription Management**
- Multiple pricing tiers (Free, Pro, Business)
- Razorpay payment integration
- Usage-based billing and limits
- Team management features

### **Analytics & Monitoring**
- Real-time execution tracking
- Success/failure analytics
- Performance metrics
- Detailed execution logs

## Architecture

### Frontend (React + Vite)
```
src/
├── components/         # Reusable UI components
├── pages/             # Main application pages
├── contexts/          # React contexts (Auth, Payment)
├── hooks/             # Custom React hooks
└── firebase/          # Firebase configuration
```

### Backend (Node.js + Express + PostgreSQL)
```
server/src/
├── routes/            # API route handlers
├── services/          # Business logic services
├── middleware/        # Authentication, error handling
├── utils/            # Utility functions
└── prisma/           # Database schema and migrations
```

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Firebase project for authentication

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd APIfyn-frontend

# Run setup script (Windows)
setup.bat

# Or run setup script (Mac/Linux)
chmod +x setup.sh
./setup.sh
```

### 2. Configure Environment
Edit `server/.env` with your credentials:
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/apifyn"

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."

# Payment Gateway
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# AI Services
OPENAI_API_KEY=your-openai-key
HUGGINGFACE_API_KEY=your-huggingface-key
```

### 3. Start Development Servers
```bash
# Backend (Terminal 1)
cd server
npm run dev

# Frontend (Terminal 2)
npm run dev
```

Visit:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Database Studio: `npx prisma studio`

## Usage Examples

### Example 1: Form Submission to Email Workflow
1. **Create Workflow** in the builder
2. **Add Blocks**:
   - Trigger: Webhook (Typeform)
   - Action: Send Gmail
   - Action: Add to Google Sheets
3. **Connect Blocks** by clicking connection ports
4. **Configure** each block with settings
5. **Get Webhook URL** from workflow detail page
6. **Add to Typeform** webhook settings

### Example 2: AI-Powered Content Processing
1. **Trigger**: New content webhook
2. **AI Block**: Sentiment analysis
3. **Condition**: If sentiment is positive
4. **Action**: Post to Slack channel
5. **Action**: Add to "Good feedback" sheet

### Example 3: E-commerce Order Processing
1. **Trigger**: Stripe payment webhook
2. **Action**: Send confirmation email
3. **Action**: Update inventory sheet
4. **Action**: Notify team on Slack

## API Documentation

### Webhook Endpoints
```bash
# Generic webhook trigger
POST /api/webhook/trigger/:workflowId

# Service-specific webhooks
POST /api/webhook/external/typeform/:workflowId
POST /api/webhook/external/stripe/:workflowId
POST /api/webhook/external/calendly/:workflowId

# Test webhook
POST /api/webhook/test/:workflowId
```

### Testing with curl
```bash
curl -X POST http://localhost:5000/api/webhook/test/WORKFLOW_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Test automation"
  }'
```

## Security Features

- **Firebase Authentication** for secure user management
- **API Key Encryption** for stored credentials
- **Rate Limiting** to prevent abuse
- **OAuth 2.0** for service integrations
- **Webhook Signature Verification** for external triggers

## Project Structure

```
APIfyn-frontend/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Application pages
│   ├── contexts/          # React contexts
│   └── firebase/          # Firebase config
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Helper functions
│   └── prisma/            # Database schema
├── IMPLEMENTATION_GUIDE.md  # Detailed technical guide
├── setup.bat              # Windows setup script
└── setup.sh               # Unix setup script
```

## Development

### Adding New Integrations
1. Add to `IntegrationType` enum in Prisma schema
2. Implement API calls in `integration.service.ts`
3. Add processor in `execution.engine.ts`
4. Update frontend block library

### Custom Workflow Blocks
1. Define block type in workflow builder
2. Add processor function in execution engine
3. Create configuration UI component
4. Update block library with new block

### AI Enhancements
1. Add new AI processor functions
2. Integrate with additional AI services
3. Create custom prompt templates
4. Add configuration options

## Deployment

### Production Environment
- **Frontend**: Deploy to Vercel/Netlify
- **Backend**: Deploy to Railway/Heroku/AWS
- **Database**: Railway PostgreSQL/AWS RDS
- **File Storage**: AWS S3/Google Cloud Storage

### Environment Variables for Production
```bash
NODE_ENV=production
DATABASE_URL=your-production-db-url
ALLOWED_ORIGINS=https://yourdomain.com
# Add all other production credentials
```
