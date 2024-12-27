'use client'

import { useState } from 'react'
import { Expense } from '../page'

interface ExpenseFormProps {
  addExpense: (expense: Omit<Expense, 'id'>) => void
}

export default function ExpenseForm({ addExpense }: ExpenseFormProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [splitBetween, setSplitBetween] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addExpense({
      description,
      amount: parseFloat(amount),
      paidBy,
      splitBetween: splitBetween.split(',').map(name => name.trim())
    })
    setDescription('')
    setAmount('')
    setPaidBy('')
    setSplitBetween('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block mb-1">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="amount" className="block mb-1">Amount</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="paidBy" className="block mb-1">Paid By</label>
        <input
          type="text"
          id="paidBy"
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="splitBetween" className="block mb-1">Split Between (comma-separated)</label>
        <input
          type="text"
          id="splitBetween"
          value={splitBetween}
          onChange={(e) => setSplitBetween(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Add Expense
      </button>
    </form>
  )
}

