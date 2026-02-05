import axios from 'axios'

const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY || 'demo'
const BASE_URL = 'https://api.exchangerate-api.com/v4/latest'

export interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
  notes: string
}

// Mock exchange rates
const mockRates: Record<string, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.0,
  INR: 74.5,
}

export const getExchangeRates = async (base: string = 'USD') => {
  if (API_KEY === 'demo') {
    return { rates: mockRates, base, date: new Date().toISOString() }
  }

  try {
    const response = await axios.get(`${BASE_URL}/${base}`)
    return response.data
  } catch (error) {
    console.error('Exchange rate API error:', error)
    return { rates: mockRates, base, date: new Date().toISOString() }
  }
}

export const getExpenses = (): Expense[] => {
  const expenses = localStorage.getItem('expenses')
  return expenses ? JSON.parse(expenses) : []
}

export const saveExpenses = (expenses: Expense[]) => {
  localStorage.setItem('expenses', JSON.stringify(expenses))
  // Dispatch custom event to notify other components of state change
  window.dispatchEvent(new Event('expense-change'));
}

export const addExpense = (expense: Omit<Expense, 'id'>) => {
  const expenses = getExpenses()
  const newExpense = { ...expense, id: Date.now().toString() }
  saveExpenses([newExpense, ...expenses])
  return newExpense
}

export const updateExpense = (id: string, updates: Partial<Expense>) => {
  const expenses = getExpenses()
  const updated = expenses.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
  saveExpenses(updated)
}

export const deleteExpense = (id: string) => {
  const expenses = getExpenses()
  saveExpenses(expenses.filter((exp) => exp.id !== id))
}

export const clearExpenses = () => {
  localStorage.removeItem('expenses')
  window.dispatchEvent(new Event('expense-change'))
}

export const getCategories = () => {
  return ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other']
}

export const seedData = () => {
  const sampleExpenses: Omit<Expense, 'id'>[] = [
    { title: 'Grocery Run', amount: 50.25, category: 'Food', date: new Date().toISOString().split('T')[0], notes: 'Weekly basics' },
    { title: 'Gas Station', amount: 45.00, category: 'Transport', date: new Date().toISOString().split('T')[0], notes: 'Full tank' },
    { title: 'Netflix', amount: 15.99, category: 'Entertainment', date: new Date().toISOString().split('T')[0], notes: 'Monthly sub' },
    { title: 'Electricity Bill', amount: 120.50, category: 'Bills', date: new Date().toISOString().split('T')[0], notes: 'January' },
    { title: 'New Shoes', amount: 85.00, category: 'Shopping', date: new Date().toISOString().split('T')[0], notes: 'Nike' },
  ];
  sampleExpenses.forEach(exp => addExpense(exp));
}
