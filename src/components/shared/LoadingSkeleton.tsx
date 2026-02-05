export default function LoadingSkeleton({ variant = 'card' }: { variant?: 'card' | 'list' | 'detail' }) {
    if (variant === 'card') {
        return (
            <div className="glass-card p-6 animate-pulse">
                <div className="skeleton h-48 w-full mb-4 rounded-lg"></div>
                <div className="skeleton h-6 w-3/4 mb-2 rounded"></div>
                <div className="skeleton h-4 w-1/2 rounded"></div>
            </div>
        )
    }

    if (variant === 'list') {
        return (
            <div className="glass-card p-4 animate-pulse">
                <div className="flex gap-4">
                    <div className="skeleton h-16 w-16 rounded-lg"></div>
                    <div className="flex-1">
                        <div className="skeleton h-5 w-3/4 mb-2 rounded"></div>
                        <div className="skeleton h-4 w-1/2 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="glass-card p-8 animate-pulse">
            <div className="skeleton h-64 w-full mb-6 rounded-lg"></div>
            <div className="skeleton h-8 w-2/3 mb-4 rounded"></div>
            <div className="skeleton h-4 w-full mb-2 rounded"></div>
            <div className="skeleton h-4 w-full mb-2 rounded"></div>
            <div className="skeleton h-4 w-3/4 rounded"></div>
        </div>
    )
}
