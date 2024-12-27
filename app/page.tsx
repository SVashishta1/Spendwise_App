'use client'

import { useState } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import BalanceSummary from './components/BalanceSummary'

export interface Expense {
  id: string
  description: string
  amount: number
  paidBy: string
  splitBetween: string[]
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Math.random().toString(36).substr(2, 9) }
    setExpenses([...expenses, newExpense])
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Splitwise Clone</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Add Expense</h2>
          <ExpenseForm addExpense={addExpense} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Balance Summary</h2>
          <BalanceSummary expenses={expenses} />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Expense List</h2>
        <ExpenseList expenses={expenses} />
      </div>
    </div>
  )
}

