import { Expense } from '../page'

interface ExpenseListProps {
  expenses: Expense[]
}

export default function ExpenseList({ expenses }: ExpenseListProps) {
  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div key={expense.id} className="border p-4 rounded">
          <h3 className="font-semibold">{expense.description}</h3>
          <p>Amount: ${expense.amount.toFixed(2)}</p>
          <p>Paid by: {expense.paidBy}</p>
          <p>Split between: {expense.splitBetween.join(', ')}</p>
        </div>
      ))}
    </div>
  )
}

