import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseAICommand } from '../../utils/aiCommandParser'

export default function CommandBar() {
    const navigate = useNavigate()
    const [input, setInput] = useState('')
    const [error, setError] = useState('')

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const result = parseAICommand(input)

        if (result.error) {
            setError(result.error)
            setTimeout(() => setError(''), 3000)
            return
        }

        setError('')
        // Construct query string
        let searchString = ''
        if (result.searchParams) {
            const params = new URLSearchParams(result.searchParams)
            searchString = `?${params.toString()}`
        }

        navigate(`${result.path}${searchString}`)
    }

    const examples = [
        "Weather in Mumbai",
        "Tech News",
        "Search iPhone",
        "Open Expenses"
    ]

    return (
        <div className="w-full max-w-2xl mx-auto mb-12 relative z-20">
            <form onSubmit={handleCommand} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-2xl border border-white/20">
                    <div className="pl-4 text-2xl animate-pulse">✨</div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask AI... (e.g. 'Weather in Delhi', 'Show tech news')"
                        className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-lg text-slate-800 dark:text-white placeholder-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                        Run
                    </button>
                </div>
            </form>

            {/* Error Message */}
            {error && (
                <div className="absolute top-full left-0 right-0 mt-2 text-center">
                    <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm inline-block shadow-lg animate-bounce">
                        {error}
                    </span>
                </div>
            )}

            {/* Examples */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
                {examples.map((ex) => (
                    <button
                        key={ex}
                        onClick={() => setInput(ex)}
                        className="text-xs px-3 py-1 rounded-full bg-white/50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-600"
                    >
                        {ex}
                    </button>
                ))}
            </div>
        </div>
    )
}
