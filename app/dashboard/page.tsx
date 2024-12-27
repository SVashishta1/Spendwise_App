import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../../pages/api/auth/[...nextauth]"
import ExpenseList from "../components/ExpenseList"
import ExpenseForm from "../components/ExpenseForm"
import BalanceSummary from "../components/BalanceSummary"

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Add Expense</h2>
        <ExpenseForm />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Balance Summary</h2>
        <BalanceSummary />
      </div>
      <div className="md:col-span-2">
        <h2 className="text-2xl font-semibold mb-4">Recent Expenses</h2>
        <ExpenseList />
      </div>
    </div>
  )
}

