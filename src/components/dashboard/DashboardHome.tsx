import { useNavigate } from 'react-router-dom'
import DarkModeToggle from '../shared/DarkModeToggle'
import CommandBar from './CommandBar'

interface AppCardProps {
    title: string
    description: string
    icon: string
    gradient: string
    path: string
}

const AppCard = ({ title, description, icon, gradient, path }: AppCardProps) => {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(path)}
            className="glass-card p-8 card-hover group relative overflow-hidden"
        >
            {/* Gradient background on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{ background: gradient }}
            ></div>

            {/* Content */}
            <div className="relative z-10">
                <div className="text-6xl mb-4">{icon}</div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{description}</p>
                <button className="btn-primary w-full group-hover:scale-105 transition-transform">
                    Open App
                </button>
            </div>

            {/* Decorative corner */}
            <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500"
                style={{ background: gradient }}
            ></div>
        </div>
    )
}

export default function DashboardHome() {
    const apps = [
        {
            title: 'Weather Dashboard',
            description: 'Real-time weather data with forecasts and air quality',
            icon: '🌤️',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            path: '/weather',
        },
        {
            title: 'Expense Tracker',
            description: 'Manage expenses with currency conversion and analytics',
            icon: '💰',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            path: '/expenses',
        },
        {
            title: 'News App',
            description: 'Latest news from around the world with search',
            icon: '📰',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            path: '/news',
        },
        {
            title: 'Product Listing',
            description: 'Browse and shop products with filters and cart',
            icon: '🛍️',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            path: '/products',
        },
    ]

    return (
        <div className="min-h-screen p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-5xl font-bold gradient-text mb-2 animate-fade-in">
                            Multi-App Dashboard
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400">
                            Choose an application to get started
                        </p>
                    </div>
                    <DarkModeToggle />
                </div>

                {/* AI Command Bar */}
                <CommandBar />

                {/* Apps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
                    {apps.map((app) => (
                        <AppCard key={app.title} {...app} />
                    ))}
                </div>

                {/* Footer Info */}
                <div className="mt-12 glass-card p-6 text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                        💡 <strong>Tip:</strong> Each app features search, pagination, and dark mode support
                    </p>
                </div>
            </div>
        </div>
    )
}
