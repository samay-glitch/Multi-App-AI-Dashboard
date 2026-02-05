import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getTopHeadlines, categories } from '../../api/newsApi'
import DarkModeToggle from '../../components/shared/DarkModeToggle'
import SearchBar from '../../components/shared/SearchBar'
import Pagination from '../../components/shared/Pagination'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'

export default function NewsHome() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const selectedCategory = searchParams.get('category') || 'general'
    const currentPage = parseInt(searchParams.get('page') || '1')

    const { data, isLoading } = useQuery({
        queryKey: ['news', selectedCategory, currentPage],
        queryFn: () => getTopHeadlines(selectedCategory, currentPage),
        placeholderData: (previousData) => previousData,
    })

    const handleSearch = (query: string) => {
        if (query) {
            navigate(`/news/search?q=${query}`)
        }
    }

    const handleCategoryChange = (cat: string) => {
        setSearchParams({ category: cat, page: '1' })
    }

    const handlePageChange = (page: number) => {
        setSearchParams({ category: selectedCategory, page: page.toString() })
    }

    const articles = data?.articles || []
    const totalResults = data?.totalResults || 0
    const totalPages = Math.min(Math.ceil(totalResults / 12), 10) // NewsAPI limited to 100 for free tier

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
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
                            <h1 className="text-4xl font-bold gradient-text">News: {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h1>
                            <p className="text-slate-600 dark:text-slate-400">Powered by NewsAPI</p>
                        </div>
                    </div>
                    <DarkModeToggle />
                </div>

                {/* Search */}
                <div className="mb-6">
                    <SearchBar onSearch={handleSearch} placeholder="Search news..." showCitySuggestions={false} />
                </div>

                {/* Category Tabs */}
                <div className="glass-card p-4 mb-8">
                    <div className="flex gap-2 overflow-x-auto">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`px-6 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                        ? 'bg-primary-500 text-white shadow-lg'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                    }`}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Articles Grid */}
                {isLoading && !data ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <LoadingSkeleton key={i} variant="card" />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {articles.map((article: any, index: number) => (
                                <a
                                    key={`${article.url}-${index}`}
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-card overflow-hidden card-hover group h-full flex flex-col"
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
                                            <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 max-w-[150px] truncate">
                                                {article.source?.name || 'News'}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Today'}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                                            {article.description || 'Click to read the full story.'}
                                        </p>
                                        <div className="mt-auto flex items-center text-primary-500 font-medium">
                                            Read more
                                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {articles.length === 0 && (
                            <div className="glass-card p-12 text-center">
                                <p className="text-slate-500 text-lg">No articles found in this category.</p>
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
