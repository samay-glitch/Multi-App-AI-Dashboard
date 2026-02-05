# Multi-App AI Dashboard

A modern, premium dashboard application featuring 4 fully-functional apps with beautiful UI, dark mode, and seamless navigation.

## 🎨 Features

### Main Dashboard
- Beautiful glassmorphism design with vibrant gradients
- 4 clickable app cards with smooth animations
- Dark mode support with persistent settings
- Responsive layout (mobile + desktop)

### 📱 Included Apps

#### 1. Weather Dashboard 🌤️
- Real-time weather data using OpenWeatherMap API
- City search with recent searches history
- 5-day forecast with temperature charts
- Paginated hourly forecast view
- Air quality and detailed metrics

#### 2. Expense Tracker 💰
- Full CRUD operations for expenses (localStorage)
- Currency conversion using Exchange Rate API
- Category-based spending analytics with pie charts
- Search and filter functionality
- Paginated expense list

#### 3. News App 📰
- Latest news using NewsAPI
- Category filters (business, tech, sports, etc.)
- Search functionality with pagination
- Article cards with images
- External links to full articles

#### 4. Product Listing 🛍️
- Product catalog using Fake Store API
- Advanced filters (category, price range)
- Search and sort options
- Shopping cart functionality
- Detailed product pages

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Keys (Optional):**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Then add your API keys:
   ```
   VITE_OPENWEATHER_API_KEY=your_openweather_key
   VITE_NEWS_API_KEY=your_news_api_key
   VITE_EXCHANGE_RATE_API_KEY=your_exchange_rate_key
   ```

   **Get Free API Keys:**
   - Weather: https://openweathermap.org/api (free tier available)
   - News: https://newsapi.org/ (free tier available)
   - Exchange Rate: https://exchangerate-api.com/ (free tier available)
   - Products: No key required (Fake Store API)

   **Note:** The app works without API keys using fallback mock data!

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```
What makes this project unique is the AI-style Command Interface, which allows users to navigate and control apps using natural language commands like:

open weather

weather in delhi

tech news

search iphone in products

The command system performs intent detection and smart routing on the frontend, passing relevant query parameters via URLs to dynamically update each module.

✨ Key Features

AI-inspired command bar for natural language navigation

Modular multi-app architecture

Real-time API integration

Search, filters, and pagination across apps

Shared UI components and dark mode

Clean, scalable React + TypeScript codebas

## 🎯 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS with custom glassmorphism utilities
- **Routing:** React Router v6
- **State Management:** TanStack Query (React Query)
- **Charts:** Recharts
- **HTTP Client:** Axios

## 📂 Project Structure

```
src/
├── apps/
│   ├── weather/          # Weather Dashboard
│   ├── expenses/         # Expense Tracker
│   ├── news/            # News App
│   └── products/        # Product Listing
├── components/
│   ├── shared/          # Reusable components
│   └── dashboard/       # Dashboard home
├── api/                 # API integrations
├── contexts/            # React contexts
├── App.tsx             # Main app with routing
└── main.tsx            # Entry point
```

## ✨ Key Features

### Shared Components
- **Pagination:** Reusable pagination with page size selector
- **SearchBar:** Debounced search with clear button
- **DarkModeToggle:** Smooth theme switching
- **LoadingSkeleton:** Multiple skeleton variants

### Design Highlights
- Glassmorphism cards with backdrop blur
- Smooth animations and micro-interactions
- Gradient text and backgrounds
- Custom scrollbar styling
- Responsive grid layouts

### Data Persistence
- Dark mode preference (localStorage)
- Recent weather searches (localStorage)
- Expense data (localStorage)
- Shopping cart (localStorage)

## 🔧 Pagination Implementation

Each app implements pagination differently:

- **Weather:** Paginated forecast days (8 items per page)
- **Expenses:** Paginated transaction list (10 items per page, adjustable)
- **News:** API-based pagination (12 articles per page)
- **Products:** Client-side pagination with filters (12 items per page, adjustable)

## 🌙 Dark Mode

Dark mode is implemented using:
- TailwindCSS dark mode class strategy
- React Context for state management
- localStorage for persistence
- Smooth transitions between themes

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:
- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3-4 columns)

## 🎨 Color Palette

- Primary: Blue (#0ea5e9)
- Gradients: Purple, Pink, Cyan, Green
- Dark mode: Slate tones
- Glassmorphism: White/Slate with transparency

## 📝 License

MIT License - feel free to use this project for learning or personal use!

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- NewsAPI for news articles
- Fake Store API for product data
- ExchangeRate API for currency conversion
