import { Expense } from '../page'

interface BalanceSummaryProps {
  expenses: Expense[]
}

export default function BalanceSummary({ expenses }: BalanceSummaryProps) {
  const calculateBalances = () => {
    const balances: Record<string, number> = {}

    expenses.forEach(expense => {
      const paidBy = expense.paidBy
      const splitBetween = expense.splitBetween
      const amountPerPerson = expense.amount / splitBetween.length

      splitBetween.forEach(person => {
        if (!balances[person]) balances[person] = 0
        if (person !== paidBy) {
          balances[person] -= amountPerPerson
          if (!balances[paidBy]) balances[paidBy] = 0
          balances[paidBy] += amountPerPerson
        }
      })
    })

    return balances
  }

  const balances = calculateBalances()

  return (
    <div className="space-y-4">
      {Object.entries(balances).map(([person, balance]) => (
        <div key={person} className="border p-4 rounded">
          <h3 className="font-semibold">{person}</h3>
          {balance > 0 ? (
            <p className="text-green-600">Is owed ${balance.toFixed(2)}</p>
          ) : balance < 0 ? (
            <p className="text-red-600">Owes ${(-balance).toFixed(2)}</p>
          ) : (
            <p>Is all settled up</p>
          )}
        </div>
      ))}
    </div>
  )
}

