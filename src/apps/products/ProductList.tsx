import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProducts, getCategories, addToCart, getCart, Product } from '../../api/productsApi'
import DarkModeToggle from '../../components/shared/DarkModeToggle'
import SearchBar from '../../components/shared/SearchBar'
import Pagination from '../../components/shared/Pagination'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'

export default function ProductList() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    // Initialize from URL params if present
    const initialQuery = searchParams.get('q') || ''
    const initialCategory = searchParams.get('category') || 'all'

    const [searchQuery, setSearchQuery] = useState(initialQuery)
    const [selectedCategory, setSelectedCategory] = useState(initialCategory)
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
    const [sortBy, setSortBy] = useState('default')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(12)
    const [cartCount, setCartCount] = useState(getCart().length)

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
    })

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    })

    // Filter and sort products
    let filteredProducts = products.filter((product: Product) => {
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
        return matchesSearch && matchesCategory && matchesPrice
    })

    if (sortBy === 'price-low') {
        filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
        filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
        filteredProducts = [...filteredProducts].sort((a, b) => b.rating.rate - a.rating.rate)
    }

    const totalPages = Math.ceil(filteredProducts.length / pageSize)
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const handleAddToCart = (product: Product) => {
        addToCart(product)
        setCartCount(getCart().length)
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedCategory, priceRange, sortBy])

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
                            <h1 className="text-4xl font-bold gradient-text">Product Listing</h1>
                            <p className="text-slate-600 dark:text-slate-400">Browse and shop products</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button className="p-3 glass-card hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                        <DarkModeToggle />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Filters */}
                    <div className="lg:w-64 space-y-4">
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Filters</h3>

                            {/* Category */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((cat: string) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                                    className="w-full"
                                />
                            </div>

                            {/* Sort */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                >
                                    <option value="default">Default</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search */}
                        <div className="mb-6">
                            <SearchBar onSearch={setSearchQuery} placeholder="Search products..." />
                        </div>

                        {/* Products Grid */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <LoadingSkeleton key={i} variant="card" />
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="glass-card p-4 mb-6">
                                    <p className="text-slate-600 dark:text-slate-400">
                                        Showing {paginatedProducts.length} of {filteredProducts.length} products
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                    {paginatedProducts.map((product: Product) => (
                                        <div key={product.id} className="glass-card overflow-hidden group">
                                            <div
                                                onClick={() => navigate(`/products/${product.id}`)}
                                                className="cursor-pointer"
                                            >
                                                <div className="h-64 bg-white dark:bg-slate-700 flex items-center justify-center p-4">
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="p-6">
                                                    <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                                                        {product.category}
                                                    </span>
                                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-2 mb-2 line-clamp-2">
                                                        {product.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="flex items-center">
                                                            <span className="text-yellow-500">★</span>
                                                            <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">
                                                                {product.rating.rate} ({product.rating.count})
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="text-2xl font-bold text-primary-500 mb-4">
                                                        ${product.price.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="px-6 pb-6">
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="btn-primary w-full"
                                                >
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {paginatedProducts.length === 0 && (
                                    <div className="glass-card p-12 text-center">
                                        <p className="text-slate-500 text-lg">No products found</p>
                                    </div>
                                )}

                                {totalPages > 1 && (
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                        pageSize={pageSize}
                                        onPageSizeChange={setPageSize}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
