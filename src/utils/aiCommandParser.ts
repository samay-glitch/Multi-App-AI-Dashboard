export interface AICommandResult {
    path: string;
    searchParams?: Record<string, string>;
    error?: string;
}

export const parseAICommand = (input: string): AICommandResult => {
    const command = input.toLowerCase().trim();

    // 1. Weather Commands
    // Patterns: "weather in london", "temperature of paris", "forecast for tokyo"
    const weatherMatch = command.match(/(weather|temperature|forecast|temp).*(in|at|for|of)\s+([a-zA-Z\s.-]+)/i);
    if (weatherMatch) {
        return {
            path: '/weather',
            searchParams: { q: weatherMatch[3].trim() }
        };
    }
    // Simple "weather" command
    if (command.includes('weather') || command.includes('forecast')) {
        return { path: '/weather' };
    }


    // 2. News Commands
    // Patterns: "tech news", "news about sports", "business headlines"
    const newsCategoryMatch = command.match(/(technology|tech|business|sports|science|health|entertainment)\s+(news|headlines)/i);
    if (newsCategoryMatch) {
        let category = newsCategoryMatch[1];
        if (category === 'tech') category = 'technology';
        return {
            path: '/news',
            searchParams: { category }
        };
    }

    const newsSearchMatch = command.match(/(news|headlines).*(about|on|for)\s+([a-zA-Z0-9\s]+)/i);
    if (newsSearchMatch) {
        return {
            path: '/news/search',
            searchParams: { q: newsSearchMatch[3].trim() }
        };
    }

    if (command.includes('news') || command.includes('headlines')) {
        return { path: '/news' };
    }


    // 3. Product/Shopping Commands
    // Patterns: "search iphone", "buy shoes", "find laptop in products"
    const productSearchMatch = command.match(/(buy|shop|search|find|get).*(product|item)?\s+([a-zA-Z0-9\s]+)/i);
    // Exclude "expenses" from product search if user says "open expenses"
    if (productSearchMatch && !command.includes('expense')) {
        // Clean up common prepositions if caught in current group (naive check)
        let query = productSearchMatch[3].trim();
        query = query.replace(/^(for|in)\s+/, '');

        // Check if query is just a category name
        const categories = ["electronics", "jewelery", "men's clothing", "women's clothing"];
        const lowerQuery = query.toLowerCase();

        if (categories.some(cat => cat.includes(lowerQuery) || lowerQuery.includes(cat))) {
            return {
                path: '/products',
                searchParams: { category: query } // Note: ProductList needs logic to fuzzy match or we pass exact
            };
        }

        return {
            path: '/products',
            searchParams: { q: query }
        };
    }
    if (command.includes('product') || command.includes('shop') || command.includes('store')) {
        return { path: '/products' };
    }


    // 4. Expense Commands
    if (command.includes('expense') || command.includes('spend') || command.includes('money')) {
        return { path: '/expenses' };
    }

    return {
        path: '',
        error: "I didn't understand that command. Try 'Weather in Tokyo' or 'Tech News'."
    };
};
