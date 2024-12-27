import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const expenses = await prisma.expense.findMany({
      where: {
        OR: [
          { payerId: session.user.id },
          { participants: { some: { id: session.user.id } } }
        ]
      },
      include: {
        payer: {
          select: { name: true }
        }
      },
      orderBy: { date: 'desc' },
      take: 10
    })

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json({ error: 'Error fetching expenses' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { description, amount, currency, payerId } = body

  if (!description || !amount || !currency || !payerId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        currency,
        payerId,
        participants: {
          connect: { id: session.user.id }
        }
      }
    })

    // Update balances
    await updateBalances(expense)

    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json({ error: 'Error creating expense' }, { status: 500 })
  }
}

async function updateBalances(expense: any) {
  const participants = await prisma.user.findMany({
    where: {
      OR: [
        { id: expense.payerId },
        { expenses: { some: { id: expense.id } } }
      ]
    }
  })

  const amountPerPerson = expense.amount / participants.length

  for (const participant of participants) {
    if (participant.id === expense.payerId) continue

    await prisma.balance.upsert({
      where: {
        userId_otherUserId: {
          userId: expense.payerId,
          otherUserId: participant.id
        }
      },
      update: {
        amount: {
          increment: amountPerPerson
        }
      },
      create: {
        userId: expense.payerId,
        otherUserId: participant.id,
        amount: amountPerPerson,
        currency: expense.currency
      }
    })

    await prisma.balance.upsert({
      where: {
        userId_otherUserId: {
          userId: participant.id,
          otherUserId: expense.payerId
        }
      },
      update: {
        amount: {
          decrement: amountPerPerson
        }
      },
      create: {
        userId: participant.id,
        otherUserId: expense.payerId,
        amount: -amountPerPerson,
        currency: expense.currency
      }
    })
  }
}

