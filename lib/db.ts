import { User, Expense } from '../types';

let users: User[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

let expenses: Expense[] = [];

export function getUsers(): User[] {
  return users;
}

export function getExpenses(): Expense[] {
  return expenses;
}

export function addExpense(expense: Omit<Expense, 'id'>): Expense {
  const newExpense = { ...expense, id: Math.random().toString(36).substr(2, 9) };
  expenses.push(newExpense);
  return newExpense;
}

export function calculateBalances(): Record<string, Record<string, number>> {
  const balances: Record<string, Record<string, number>> = {};

  users.forEach(user => {
    balances[user.id] = {};
    users.forEach(otherUser => {
      if (user.id !== otherUser.id) {
        balances[user.id][otherUser.id] = 0;
      }
    });
  });

  expenses.forEach(expense => {
    const paidBy = expense.paidBy;
    const splitBetween = expense.splitBetween;
    const amountPerPerson = expense.amount / splitBetween.length;

    splitBetween.forEach(userId => {
      if (userId !== paidBy) {
        balances[userId][paidBy] += amountPerPerson;
        balances[paidBy][userId] -= amountPerPerson;
      }
    });
  });

  return balances;
}

