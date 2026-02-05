import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProduct, addToCart, getCart } from '../../api/productsApi'
import { useState } from 'react'
import DarkModeToggle from '../../components/shared/DarkModeToggle'
import LoadingSkeleton from '../../components/shared/LoadingSkeleton'

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [cartCount, setCartCount] = useState(getCart().length)

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => getProduct(Number(id)),
        enabled: !!id,
    })

    const handleAddToCart = () => {
        if (product) {
            addToCart(product)
            setCartCount(getCart().length)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen p-8">
                <div className="max-w-6xl mx-auto">
                    <LoadingSkeleton variant="detail" />
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="glass-card p-12 text-center">
                        <p className="text-slate-500 text-lg">Product not found</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/products')}
                            className="p-3 glass-card hover:scale-110 transition-transform"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold gradient-text">Product Details</h1>
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

                {/* Product Detail */}
                <div className="glass-card p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Image */}
                        <div className="bg-white dark:bg-slate-700 rounded-xl p-8 flex items-center justify-center">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="max-h-96 max-w-full object-contain"
                            />
                        </div>

                        {/* Details */}
                        <div>
                            <span className="text-sm px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                                {product.category}
                            </span>
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mt-4 mb-4">
                                {product.title}
                            </h2>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center">
                                    <span className="text-yellow-500 text-2xl">★</span>
                                    <span className="text-xl font-semibold text-slate-700 dark:text-slate-300 ml-2">
                                        {product.rating.rate}
                                    </span>
                                </div>
                                <span className="text-slate-500">({product.rating.count} reviews)</span>
                            </div>

                            <div className="mb-6">
                                <p className="text-4xl font-bold text-primary-500">${product.price.toFixed(2)}</p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Description</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <button onClick={handleAddToCart} className="btn-primary w-full text-lg py-4">
                                    Add to Cart
                                </button>
                                <button onClick={() => navigate('/products')} className="btn-secondary w-full text-lg py-4">
                                    Continue Shopping
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
                                <h4 className="font-bold text-slate-800 dark:text-white mb-3">Product Information</h4>
                                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                    <li>✓ Free shipping on orders over $50</li>
                                    <li>✓ 30-day return policy</li>
                                    <li>✓ Secure checkout</li>
                                    <li>✓ Customer support available 24/7</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
