import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getExpenses, addExpense, updateExpense, deleteExpense, getCategories, Expense } from '../../api/expenseApi'
import DarkModeToggle from '../../components/shared/DarkModeToggle'
import SearchBar from '../../components/shared/SearchBar'
import Pagination from '../../components/shared/Pagination'
import ExpenseModal from './ExpenseModal'

export default function ExpenseList() {
    const navigate = useNavigate()
    const [expenses, setExpenses] = useState(getExpenses())
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

    useEffect(() => {
        const handleExpenseChange = () => {
            setExpenses(getExpenses());
        };
        window.addEventListener('expense-change', handleExpenseChange);
        return () => window.removeEventListener('expense-change', handleExpenseChange);
    }, []);

    const categories = getCategories()

    // Filter expenses
    const filteredExpenses = expenses.filter((exp) => {
        const matchesSearch =
            exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exp.notes.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = categoryFilter === 'All' || exp.category === categoryFilter
        return matchesSearch && matchesCategory
    })

    const totalPages = Math.ceil(filteredExpenses.length / pageSize)
    const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    const handleModalSubmit = (expenseData: Omit<Expense, 'id'>) => {
        if (editingExpense) {
            updateExpense(editingExpense.id, expenseData)
        } else {
            addExpense(expenseData)
        }
        setIsModalOpen(false)
        setEditingExpense(null)
    }

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            deleteExpense(id)
        }
    }

    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense)
        setIsModalOpen(true)
    }

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/expenses')}
                            className="p-3 glass-card hover:scale-110 transition-transform"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold gradient-text">All Expenses</h1>
                            <p className="text-slate-600 dark:text-slate-400">Manage your transactions</p>
                        </div>
                    </div>
                    <DarkModeToggle />
                </div>

                {/* Filters */}
                <div className="glass-card p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <SearchBar onSearch={setSearchQuery} placeholder="Search expenses..." />
                        <div className="flex gap-4 items-center">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                            >
                                <option value="All">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            <button onClick={() => { setEditingExpense(null); setIsModalOpen(true); }} className="btn-primary whitespace-nowrap">
                                + Add Expense
                            </button>
                        </div>
                    </div>
                </div>

                {/* Expense Table */}
                <div className="glass-card p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left p-3 text-slate-700 dark:text-slate-300">Title</th>
                                    <th className="text-left p-3 text-slate-700 dark:text-slate-300">Category</th>
                                    <th className="text-left p-3 text-slate-700 dark:text-slate-300">Amount</th>
                                    <th className="text-left p-3 text-slate-700 dark:text-slate-300">Date</th>
                                    <th className="text-left p-3 text-slate-700 dark:text-slate-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedExpenses.map((expense) => (
                                    <tr key={expense.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="p-3">
                                            <p className="font-semibold text-slate-800 dark:text-white">{expense.title}</p>
                                            {expense.notes && <p className="text-sm text-slate-500">{expense.notes}</p>}
                                        </td>
                                        <td className="p-3">
                                            <span className="px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="p-3 font-bold text-primary-500">${expense.amount.toFixed(2)}</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">{new Date(expense.date).toLocaleDateString()}</td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(expense)} className="text-blue-500 hover:text-blue-700 font-medium">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(expense.id)} className="text-red-500 hover:text-red-700 font-medium">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {paginatedExpenses.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-slate-500 text-lg mb-4">No expenses found</p>
                            <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                                Add your first expense
                            </button>
                        </div>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        pageSize={pageSize}
                        onPageSizeChange={setPageSize}
                    />
                </div>

                <ExpenseModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setEditingExpense(null); }}
                    onSubmit={handleModalSubmit}
                    initialData={editingExpense}
                    title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
                />
            </div>
        </div>
    )
}
