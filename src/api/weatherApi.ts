import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Mock data for fallback
const mockWeatherData = {
    name: 'London',
    sys: { country: 'GB' },
    main: {
        temp: 15,
        feels_like: 13,
        humidity: 72,
        pressure: 1013,
    },
    weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
    wind: { speed: 4.5 },
    dt: Date.now() / 1000,
}

const mockForecastData = {
    list: Array.from({ length: 40 }, (_, i) => ({
        dt: Date.now() / 1000 + i * 10800,
        main: {
            temp: 15 + Math.random() * 10,
            feels_like: 13 + Math.random() * 10,
            humidity: 60 + Math.random() * 20,
        },
        weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        wind: { speed: 3 + Math.random() * 5 },
    })),
}

export const searchCity = async (city: string) => {
    if (API_KEY === 'demo') {
        return { ...mockWeatherData, name: city }
    }

    try {
        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric',
            },
        })
        return response.data
    } catch (error) {
        console.error('Weather API error:', error)
        return { ...mockWeatherData, name: city }
    }
}

export const getForecast = async (city: string) => {
    if (API_KEY === 'demo') {
        return mockForecastData
    }

    try {
        const response = await axios.get(`${BASE_URL}/forecast`, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric',
            },
        })
        return response.data
    } catch (error) {
        console.error('Forecast API error:', error)
        return mockForecastData
    }
}

export const getRecentSearches = (): string[] => {
    const searches = localStorage.getItem('recentWeatherSearches')
    return searches ? JSON.parse(searches) : ['London', 'New York', 'Tokyo', 'Paris']
}

export const addRecentSearch = (city: string) => {
    const searches = getRecentSearches()
    const updated = [city, ...searches.filter((s) => s !== city)].slice(0, 5)
    localStorage.setItem('recentWeatherSearches', JSON.stringify(updated))
}
