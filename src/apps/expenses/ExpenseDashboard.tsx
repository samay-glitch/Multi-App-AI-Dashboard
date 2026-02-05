import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getExpenses, getExchangeRates, addExpense, seedData, clearExpenses, Expense } from '../../api/expenseApi'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import DarkModeToggle from '../../components/shared/DarkModeToggle'
import ExpenseModal from './ExpenseModal'

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1']

export default function ExpenseDashboard() {
    const navigate = useNavigate()
    const [currency, setCurrency] = useState('USD')
    const [expenses, setExpenses] = useState<Expense[]>(getExpenses())
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        const handleExpenseChange = () => {
            setExpenses(getExpenses());
        };
        window.addEventListener('expense-change', handleExpenseChange);
        return () => window.removeEventListener('expense-change', handleExpenseChange);
    }, []);

    const { data: rates } = useQuery({
        queryKey: ['exchangeRates', currency],
        queryFn: () => getExchangeRates(currency),
    })

    const totalSpend = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const convertedTotal = rates ? totalSpend * (rates.rates[currency] || 1) : totalSpend

    // Category breakdown
    const categoryData = expenses.reduce((acc: any, exp) => {
        const existing = acc.find((item: any) => item.name === exp.category)
        if (existing) {
            existing.value += exp.amount
        } else {
            acc.push({ name: exp.category, value: exp.amount })
        }
        return acc
    }, [])

    const recentExpenses = expenses.slice(0, 5)

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
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
                            <h1 className="text-4xl font-bold gradient-text">Expense Tracker</h1>
                            <p className="text-slate-600 dark:text-slate-400">Manage your finances</p>
                        </div>
                    </div>
                    <DarkModeToggle />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-slate-600 dark:text-slate-400">Total Expenses</p>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="INR">INR</option>
                            </select>
                        </div>
                        <p className="text-4xl font-bold text-primary-500">
                            {currency} {convertedTotal.toFixed(2)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Last updated: {rates?.date ? new Date(rates.date).toLocaleDateString() : 'Now'}
                        </p>
                    </div>

                    <div className="glass-card p-6">
                        <p className="text-slate-600 dark:text-slate-400 mb-2">Total Transactions</p>
                        <p className="text-4xl font-bold text-purple-500">{expenses.length}</p>
                    </div>

                    <div className="glass-card p-6">
                        <p className="text-slate-600 dark:text-slate-400 mb-2">Categories</p>
                        <p className="text-4xl font-bold text-pink-500">{categoryData.length}</p>
                    </div>
                </div>

                {/* Chart and Recent */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Pie Chart */}
                    <div className="glass-card p-6">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Spending by Category</h2>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={(entry) => entry.name}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((_: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center text-slate-500 py-20">No expenses yet</p>
                        )}
                    </div>

                    {/* Recent Expenses */}
                    <div className="glass-card p-6">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Recent Expenses</h2>
                        <div className="space-y-3">
                            {recentExpenses.length > 0 ? (
                                recentExpenses.map((expense) => (
                                    <div key={expense.id} className="p-3 bg-white/50 dark:bg-slate-700/50 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-white">{expense.title}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">{expense.category}</p>
                                            </div>
                                            <p className="font-bold text-primary-500">${expense.amount.toFixed(2)}</p>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">{new Date(expense.date).toLocaleDateString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-slate-500 py-10">No expenses yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button onClick={() => navigate('/expenses/list')} className="btn-secondary flex-1">
                        View All Expenses
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary flex-1">
                        + Add Expense
                    </button>
                    <button
                        onClick={() => { seedData(); setExpenses(getExpenses()); }}
                        className="p-3 glass-card hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                        title="Seed Demo Data"
                    >
                        🌱
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete all expenses?')) {
                                clearExpenses();
                                setExpenses(getExpenses());
                            }
                        }}
                        className="p-3 glass-card hover:bg-slate-100 dark:hover:bg-slate-700 text-red-500"
                        title="Clear All Expenses"
                    >
                        🗑️
                    </button>
                </div>

                <ExpenseModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={(newExpense) => {
                        addExpense(newExpense);
                        setIsModalOpen(false);
                    }}
                    title="Add New Expense"
                />
            </div>
        </div>
    )
}
