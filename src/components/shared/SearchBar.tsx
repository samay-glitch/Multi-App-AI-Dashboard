import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { famousCities } from '../../api/famousCities';
import { getRecentSearches } from '../../api/weatherApi';

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    showCitySuggestions?: boolean;
}

export default function SearchBar({
    onSearch,
    placeholder = 'Search...',
    showCitySuggestions = false
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const debouncedQuery = useDebounce(query, 300);

    const containerRef = useRef<HTMLDivElement>(null);
    useOutsideClick(containerRef, () => setIsOpen(false));

    useEffect(() => {
        if (debouncedQuery.trim().length > 0) {
            const allSuggestions: string[] = [];

            // Only include cities if explicitly requested (e.g., in Weather app)
            if (showCitySuggestions) {
                const recent = getRecentSearches();
                allSuggestions.push(...Array.from(new Set([...recent, ...famousCities])));
            }

            if (allSuggestions.length > 0) {
                const filtered = allSuggestions
                    .filter(item => item.toLowerCase().includes(debouncedQuery.toLowerCase()))
                    .slice(0, 8);

                setSuggestions(filtered);
                setIsOpen(filtered.length > 0);
            } else {
                setSuggestions([]);
                setIsOpen(false);
            }
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
        setActiveIndex(-1);
    }, [debouncedQuery, showCitySuggestions]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'Enter' && query.trim()) {
                onSearch(query.trim());
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
            if (activeIndex >= 0) {
                selectSuggestion(suggestions[activeIndex]);
            } else if (query.trim()) {
                onSearch(query.trim());
                setIsOpen(false);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const selectSuggestion = (suggestion: string) => {
        setQuery(suggestion);
        onSearch(suggestion);
        setIsOpen(false);
    };

    const highlightMatch = (text: string, match: string) => {
        if (!match) return text;
        const parts = text.split(new RegExp(`(${match})`, 'gi'));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === match.toLowerCase() ? (
                        <span key={i} className="font-bold text-primary-500">{part}</span>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </>
        );
    };

    return (
        <div className="relative w-full max-w-md" ref={containerRef}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.trim() && suggestions.length > 0 && setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full px-5 py-3 pl-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
                />
                <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setSuggestions([]);
                            setIsOpen(false);
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-card overflow-hidden z-50 animate-fade-in">
                    <ul className="py-2">
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={suggestion}
                                onClick={() => selectSuggestion(suggestion)}
                                onMouseEnter={() => setActiveIndex(index)}
                                className={`px-5 py-3 cursor-pointer transition-colors ${index === activeIndex
                                        ? 'bg-primary-50 dark:bg-slate-700 text-primary-600 dark:text-primary-400'
                                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">📍</span>
                                    <span>{highlightMatch(suggestion, query)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
