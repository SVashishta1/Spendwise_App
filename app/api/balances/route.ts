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
    const balances = await prisma.balance.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { otherUserId: session.user.id }
        ]
      },
      include: {
        user: {
          select: { name: true }
        }
      }
    })

    const formattedBalances = balances.map(balance => ({
      userId: balance.userId === session.user.id ? balance.otherUserId : balance.userId,
      userName: balance.userId === session.user.id ? balance.user.name : balance.user.name,
      amount: balance.userId === session.user.id ? balance.amount : -balance.amount,
      currency: balance.currency
    }))

    return NextResponse.json(formattedBalances)
  } catch (error) {
    console.error('Error fetching balances:', error)
    return NextResponse.json({ error: 'Error fetching balances' }, { status: 500 })
  }
}

