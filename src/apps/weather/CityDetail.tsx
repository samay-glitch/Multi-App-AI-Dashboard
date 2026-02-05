import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getForecast } from '../../api/weatherApi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import DarkModeToggle from '../../components/shared/DarkModeToggle'
import Pagination from '../../components/shared/Pagination'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'

export default function CityDetail() {
    const { name } = useParams<{ name: string }>()
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    const { data: forecast, isLoading } = useQuery({
        queryKey: ['forecast', name],
        queryFn: () => getForecast(name || 'London'),
        enabled: !!name,
    })

    if (isLoading) {
        return (
            <div className="min-h-screen p-8">
                <div className="max-w-6xl mx-auto">
                    <LoadingSkeleton variant="detail" />
                </div>
            </div>
        )
    }

    const forecastList = forecast?.list || []
    const totalPages = Math.ceil(forecastList.length / itemsPerPage)
    const paginatedData = forecastList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    // Prepare chart data (every 3 hours for 5 days)
    const chartData = forecastList.slice(0, 40).map((item: any) => ({
        time: new Date(item.dt * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
        }),
        temp: Math.round(item.main.temp),
        feels_like: Math.round(item.main.feels_like),
    }))

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/weather')}
                            className="p-3 glass-card hover:scale-110 transition-transform"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold gradient-text">{name} Forecast</h1>
                            <p className="text-slate-600 dark:text-slate-400">5-day weather forecast</p>
                        </div>
                    </div>
                    <DarkModeToggle />
                </div>

                {/* Temperature Chart */}
                <div className="glass-card p-6 mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Temperature Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="time" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#fff',
                                }}
                            />
                            <Line type="monotone" dataKey="temp" stroke="#0ea5e9" strokeWidth={3} name="Temperature" />
                            <Line type="monotone" dataKey="feels_like" stroke="#8b5cf6" strokeWidth={2} name="Feels Like" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Forecast Cards */}
                <div className="glass-card p-6 mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Hourly Forecast</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {paginatedData.map((item: any, index: number) => (
                            <div key={index} className="p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl">
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    {new Date(item.dt * 1000).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-3xl font-bold text-primary-500">{Math.round(item.main.temp)}°C</p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                                            {item.weather[0].description}
                                        </p>
                                    </div>
                                    <img
                                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                        alt="weather"
                                        className="w-16 h-16"
                                    />
                                </div>
                                <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                                    <p>💧 Humidity: {item.main.humidity}%</p>
                                    <p>💨 Wind: {item.wind.speed} m/s</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    )
}
