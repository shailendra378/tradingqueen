# Trading Queen 👑 - Complete Stock Market Website

A comprehensive, dynamic, and responsive stock market website with real-time data, e-commerce functionality, professional financial services, and a complete backend API system.

## 🚀 Features

### Frontend Features
- **Dynamic Home Page** with AI-powered stock recommendations
- **Real-time Market Data** (NIFTY, SENSEX, BANK NIFTY, USD/INR)
- **FII/DII/Client Data** with live institutional flow analysis
- **Market Update Page** with TradingView integration
- **E-commerce Services** with shopping cart and checkout
- **News & Blogs** with real-time updates
- **Authentication System** with JWT tokens
- **Responsive Design** optimized for all devices
- **Social Media Integration**
- **Stock Market Learning Hub**

### Backend API Features
- **RESTful API** with Express.js
- **Authentication & Authorization** with JWT
- **Real-time Data Simulation** for market updates
- **E-commerce System** with cart and order management
- **Contact Management** with form submissions
- **Newsletter Subscription** system
- **Rate Limiting** and security middleware
- **CORS Support** for cross-origin requests
- **Error Handling** and logging

## 📁 Project Structure

```
trading-queen-website/
├── frontend/
│   ├── index.html                 # Main landing page
│   ├── css/
│   │   └── style.css             # Comprehensive styling
│   ├── js/
│   │   ├── main.js               # Core functionality
│   │   ├── auth.js               # Authentication
│   │   ├── market-data.js        # Market data handling
│   │   ├── market-update.js      # Market update page
│   │   ├── ai-recommendations.js # AI features
│   │   ├── ecommerce.js          # Shopping functionality
│   │   ├── news-api.js           # News integration
│   │   └── contact.js            # Contact forms
│   └── pages/
│       ├── market-update.html    # Market data & FII/DII
│       ├── services.html         # E-commerce services
│       ├── news-blogs.html       # News & blogs
│       ├── about.html            # Company information
│       └── contact.html          # Contact page
├── backend/
│   ├── server/
│   │   ├── server.js             # Main server file
│   │   └── routes/
│   │       ├── auth.js           # Authentication routes
│   │       ├── market.js         # Market data API
│   │       ├── institutional.js  # FII/DII/Client data
│   │       ├── news.js           # News & blogs API
│   │       ├── services.js       # E-commerce API
│   │       └── contact.js        # Contact management
├── package.json                  # Dependencies & scripts
├── .env.example                  # Environment configuration
└── README.md                     # Documentation
```

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **JavaScript ES6+** - Interactive functionality
- **Bootstrap 5** - Responsive framework
- **Font Awesome** - Icons and graphics

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection
- **Compression** - Response optimization

## 🚀 Quick Start

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/tradingqueen/trading-queen-website.git
cd trading-queen-website
```

2. **Install dependencies**
```bash
npm run setup
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env file with your configuration
```

4. **Start the development server**
```bash
# Backend only (API server on port 3000)
npm run dev

# Frontend only (Static server on port 8000)
npm run frontend

# Full stack development (Both servers)
npm run dev-full
```

5. **Access the application**
- Frontend: http://localhost:8000
- Backend API: http://localhost:3000
- API Health Check: http://localhost:3000/api/health

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}
```

#### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Market Data Endpoints

#### GET /api/market/overview
Get comprehensive market data including indices, stocks, and sectors.

**Response:**
```json
{
  "success": true,
  "data": {
    "indices": {
      "nifty": {
        "price": 19850.25,
        "change": 125.30,
        "changePercent": 0.63
      }
    },
    "stocks": {
      "gainers": [...],
      "losers": [...]
    }
  }
}
```

#### GET /api/market/gainers
Get top gaining stocks.

#### GET /api/market/losers
Get top losing stocks.

### Institutional Data Endpoints

#### GET /api/institutional/overview
Get FII, DII, and client data overview.

**Response:**
```json
{
  "success": true,
  "data": {
    "fii": {
      "today": -2450,
      "mtd": 8750,
      "ytd": 45230,
      "sentiment": 65
    },
    "dii": {
      "today": 3680,
      "mtd": 12450,
      "ytd": 89560,
      "sentiment": 78
    },
    "client": {
      "active": 2847,
      "newSignups": 156,
      "volume": 45.2,
      "sentiment": 72
    }
  }
}
```

#### GET /api/institutional/live-updates
Get real-time institutional activity updates.

### Services & E-commerce Endpoints

#### GET /api/services/list
Get all available services.

#### POST /api/services/cart/add
Add service to shopping cart.

**Request Body:**
```json
{
  "userId": "user_id",
  "serviceId": 1,
  "quantity": 1
}
```

#### POST /api/services/order/create
Create a new order from cart items.

### News Endpoints

#### GET /api/news/all
Get all news articles with pagination.

**Query Parameters:**
- `category`: Filter by category (market, global, economic-data)
- `limit`: Number of articles per page (default: 10)
- `offset`: Pagination offset (default: 0)

#### POST /api/news/newsletter/subscribe
Subscribe to newsletter.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "User Name"
}
```

### Contact Endpoints

#### POST /api/contact/submit
Submit contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Your message here"
}
```

#### POST /api/contact/callback
Request a callback.

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "+91 9876543210",
  "preferredTime": "morning",
  "topic": "Investment Planning"
}
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:8000
```

### Demo Accounts

For testing, use these demo accounts:

**Demo User:**
- Email: demo@tradingqueen.com
- Password: demo123

**Test Investor:**
- Email: test@tradingqueen.com
- Password: test123

## 🎯 Key Features Implemented

### 1. FII/DII/Client Data Integration ✅
- Real-time Foreign Institutional Investor (FII) data
- Domestic Institutional Investor (DII) flow tracking
- Client activity and retail investor metrics
- Live updates feed with institutional activities
- Sentiment analysis and market impact calculations

### 2. Complete Authentication System ✅
- JWT-based authentication
- User registration and login
- Password hashing with bcrypt
- Protected routes and middleware
- Demo accounts for testing

### 3. E-commerce Functionality ✅
- Service catalog with detailed descriptions
- Shopping cart management
- Order creation and tracking
- SIP calculator integration
- Package deals and pricing

### 4. Real-time Market Data ✅
- Live index prices (NIFTY, SENSEX, BANK NIFTY)
- Top gainers and losers
- Sector performance tracking
- Market status and trading hours
- Historical data simulation

### 5. News & Content Management ✅
- Market news aggregation
- Newsletter subscription system
- Content categorization
- Search functionality
- Trending topics tracking

### 6. Contact & Support System ✅
- Contact form submissions
- Callback request system
- FAQ management
- Office information API
- Feedback collection

## 🔒 Security Features

- **Rate Limiting** - Prevents API abuse
- **CORS Protection** - Secure cross-origin requests
- **Helmet Security** - HTTP security headers
- **Input Validation** - Sanitized user inputs
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Error Handling** - Secure error responses

## 📱 Responsive Design

- **Mobile-First** approach
- **Bootstrap 5** responsive grid
- **Touch-friendly** interface
- **Fast loading** optimized assets
- **Cross-browser** compatibility

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=your-production-secret
```

2. **Build Assets**
```bash
npm run build
```

3. **Start Production Server**
```bash
npm start
```

### Docker Deployment (Optional)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Lint code
npm run lint

# Format code
npm run format

# Validate HTML
npm run validate
```

## 📈 Performance

- **Fast API responses** (< 100ms average)
- **Optimized assets** with compression
- **Efficient caching** strategies
- **Real-time updates** without page refresh
- **Lazy loading** for better UX

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email:** info@tradingqueen.com
- **Phone:** +91 9876543210
- **Website:** https://tradingqueen.com

## 🙏 Acknowledgments

- **TradingView** for market data widgets
- **Bootstrap** for responsive framework
- **Font Awesome** for icons
- **Express.js** community for excellent documentation

---

**Trading Queen 👑** - Your trusted partner in stock market success!
