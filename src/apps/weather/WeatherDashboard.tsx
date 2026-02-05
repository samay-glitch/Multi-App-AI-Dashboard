import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { searchCity, getRecentSearches, addRecentSearch } from '../../api/weatherApi'
import DarkModeToggle from '../../components/shared/DarkModeToggle'
import SearchBar from '../../components/shared/SearchBar'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'

export default function WeatherDashboard() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const initialCity = searchParams.get('q') || 'London'

    const [selectedCity, setSelectedCity] = useState(initialCity)
    const recentSearches = getRecentSearches()

    const { data: weather, isLoading } = useQuery({
        queryKey: ['weather', selectedCity],
        queryFn: () => searchCity(selectedCity),
    })

    const handleSearch = (query: string) => {
        handleCitySelect(query);
    };

    const handleCitySelect = (city: string) => {
        if (!city.trim()) return;
        setSelectedCity(city);
        addRecentSearch(city);
    };

    const handleCityClick = (city: string) => {
        navigate(`/weather/city/${city}`)
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-3 glass-card hover:scale-110 transition-transform"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold gradient-text">Weather Dashboard</h1>
                            <p className="text-slate-600 dark:text-slate-400">Real-time weather data</p>
                        </div>
                    </div>
                    <DarkModeToggle />
                </div>

                {/* Search */}
                <div className="mb-8">
                    <SearchBar onSearch={handleSearch} placeholder="Search for a city..." showCitySuggestions={true} />
                </div>

                {/* Current Weather */}
                {isLoading ? (
                    <LoadingSkeleton variant="detail" />
                ) : weather ? (
                    <div className="glass-card p-8 mb-8 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                                    {weather.name}, {weather.sys?.country}
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 capitalize">
                                    {weather.weather?.[0]?.description}
                                </p>
                            </div>
                            <div className="text-6xl">
                                {weather.weather?.[0]?.icon ? (
                                    <img
                                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                        alt="weather"
                                        className="w-24 h-24"
                                    />
                                ) : (
                                    '🌤️'
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl">
                                <p className="text-4xl font-bold text-primary-500">{Math.round(weather.main?.temp || 0)}°C</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Temperature</p>
                            </div>
                            <div className="text-center p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl">
                                <p className="text-4xl font-bold text-primary-500">{Math.round(weather.main?.feels_like || 0)}°C</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Feels Like</p>
                            </div>
                            <div className="text-center p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl">
                                <p className="text-4xl font-bold text-primary-500">{weather.main?.humidity || 0}%</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Humidity</p>
                            </div>
                            <div className="text-center p-4 bg-white/50 dark:bg-slate-700/50 rounded-xl">
                                <p className="text-4xl font-bold text-primary-500">{weather.wind?.speed || 0} m/s</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Wind Speed</p>
                            </div>
                        </div>

                        <button
                            onClick={() => handleCityClick(weather.name)}
                            className="btn-primary w-full mt-6"
                        >
                            View Detailed Forecast
                        </button>
                    </div>
                ) : null}

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
                            Recent Searches
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {recentSearches.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => handleCitySelect(city)}
                                    className="p-4 glass-card hover:scale-105 transition-transform text-center"
                                >
                                    <p className="font-semibold text-slate-700 dark:text-slate-200">{city}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
