import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { searchNews } from '../../api/newsApi'
import DarkModeToggle from '../../components/shared/DarkModeToggle'
import SearchBar from '../../components/shared/SearchBar'
import Pagination from '../../components/shared/Pagination'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'

export default function NewsSearch() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const query = searchParams.get('q') || ''
    const currentPage = parseInt(searchParams.get('page') || '1')

    const { data, isLoading } = useQuery({
        queryKey: ['newsSearch', query, currentPage],
        queryFn: () => searchNews(query, currentPage),
        enabled: !!query,
    })

    const handleSearch = (newQuery: string) => {
        if (newQuery) {
            setSearchParams({ q: newQuery, page: '1' })
        }
    }

    const handlePageChange = (page: number) => {
        setSearchParams({ q: query, page: page.toString() })
    }

    const articles = data?.articles || []
    const totalResults = data?.totalResults || 0
    const totalPages = Math.min(Math.ceil(totalResults / 12), 10)

    // Helper to highlight matching text
    const highlightText = (text: string, match: string) => {
        if (!text || !match) return text;
        const parts = text.split(new RegExp(`(${match})`, 'gi'));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === match.toLowerCase() ? (
                        <span key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-slate-900 dark:text-yellow-100 rounded-sm px-0.5 font-bold">
                            {part}
                        </span>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </>
        );
    };

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/news')}
                            className="p-3 glass-card hover:scale-110 transition-transform"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold gradient-text">Topic Search</h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                {query ? (
                                    <>Searching for <span className="font-bold text-primary-500 underline underline-offset-4">"{query}"</span> in titles</>
                                ) : 'Enter a search term'}
                            </p>
                        </div>
                    </div>
                    <DarkModeToggle />
                </div>

                {/* Search */}
                <div className="mb-8">
                    <SearchBar onSearch={handleSearch} placeholder="Search main topics only..." showCitySuggestions={false} />
                </div>

                {/* Results */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <LoadingSkeleton key={i} variant="card" />
                        ))}
                    </div>
                ) : (
                    <>
                        {articles.length > 0 && (
                            <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg inline-block w-fit text-sm font-medium border border-indigo-100 dark:border-indigo-800">
                                <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                                Title-Only Filter: Only articles with "{query}" in the headline are shown
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {articles.map((article: any, index: number) => (
                                <a
                                    key={`${article.url}-${index}`}
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-card overflow-hidden card-hover group h-full flex flex-col border border-transparent hover:border-indigo-500/30 transition-all"
                                >
                                    <div className="h-48 overflow-hidden bg-slate-200 dark:bg-slate-700">
                                        {article.urlToImage ? (
                                            <img
                                                src={article.urlToImage}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://picsum.photos/seed/news/400/300'
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-6xl">📰</div>
                                        )}
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 max-w-[150px] truncate">
                                                {article.source?.name || 'News'}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Today'}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-2">
                                            {highlightText(article.title, query)}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                                            {highlightText(article.description || 'Click to read full article', query)}
                                        </p>
                                        <div className="mt-auto flex items-center text-indigo-500 font-medium">
                                            Read full story
                                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {articles.length === 0 && query && (
                            <div className="glass-card p-12 text-center border-dashed border-2 border-slate-200 dark:border-slate-700 bg-transparent">
                                <div className="text-6xl mb-4">🎯</div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Topic not found in headlines</h3>
                                <p className="text-slate-500 max-w-md mx-auto">We couldn't find any headlines containing "{query}". Try a different topic or broader term.</p>
                            </div>
                        )}

                        {totalPages > 1 && (
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
