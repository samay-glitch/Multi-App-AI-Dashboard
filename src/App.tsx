import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DarkModeProvider } from './contexts/DarkModeContext'
import DashboardHome from './components/dashboard/DashboardHome'
import WeatherDashboard from './apps/weather/WeatherDashboard'
import CityDetail from './apps/weather/CityDetail'
import ExpenseDashboard from './apps/expenses/ExpenseDashboard'
import ExpenseList from './apps/expenses/ExpenseList'
import NewsHome from './apps/news/NewsHome'
import NewsSearch from './apps/news/NewsSearch'
import ProductList from './apps/products/ProductList'
import ProductDetail from './apps/products/ProductDetail'

function App() {
    return (
        <DarkModeProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<DashboardHome />} />

                    {/* Weather App Routes */}
                    <Route path="/weather" element={<WeatherDashboard />} />
                    <Route path="/weather/city/:name" element={<CityDetail />} />

                    {/* Expense Tracker Routes */}
                    <Route path="/expenses" element={<ExpenseDashboard />} />
                    <Route path="/expenses/list" element={<ExpenseList />} />

                    {/* News App Routes */}
                    <Route path="/news" element={<NewsHome />} />
                    <Route path="/news/search" element={<NewsSearch />} />

                    {/* Product Listing Routes */}
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                </Routes>
            </Router>
        </DarkModeProvider>
    )
}

export default App
