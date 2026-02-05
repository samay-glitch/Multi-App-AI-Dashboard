import ExpenseForm from './ExpenseForm';
import { Expense } from '../../api/expenseApi';

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (expense: Omit<Expense, 'id'>) => void;
    initialData?: Expense | null;
    title: string;
}

export default function ExpenseModal({ isOpen, onClose, onSubmit, initialData, title }: ExpenseModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div
                className="glass-card w-full max-w-md p-8 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary-500/10 blur-2xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <ExpenseForm
                        onSubmit={onSubmit}
                        initialData={initialData}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
}
