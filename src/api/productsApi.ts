import axios from 'axios'

const BASE_URL = 'https://fakestoreapi.com'

export interface Product {
    id: number
    title: string
    price: number
    description: string
    category: string
    image: string
    rating: {
        rate: number
        count: number
    }
}

export const getProducts = async (): Promise<Product[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/products`)
        return response.data
    } catch (error) {
        console.error('Products API error:', error)
        return []
    }
}

export const getProduct = async (id: number): Promise<Product | null> => {
    try {
        const response = await axios.get(`${BASE_URL}/products/${id}`)
        return response.data
    } catch (error) {
        console.error('Product API error:', error)
        return null
    }
}

export const getCategories = async (): Promise<string[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/products/categories`)
        return response.data
    } catch (error) {
        console.error('Categories API error:', error)
        return ['electronics', 'jewelery', "men's clothing", "women's clothing"]
    }
}

export const getCart = (): Product[] => {
    const cart = localStorage.getItem('productCart')
    return cart ? JSON.parse(cart) : []
}

export const addToCart = (product: Product) => {
    const cart = getCart()
    const existing = cart.find((p) => p.id === product.id)
    if (!existing) {
        localStorage.setItem('productCart', JSON.stringify([...cart, product]))
    }
}

export const removeFromCart = (productId: number) => {
    const cart = getCart()
    localStorage.setItem('productCart', JSON.stringify(cart.filter((p) => p.id !== productId)))
}
