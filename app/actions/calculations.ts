'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { calculations } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function saveCalculation(input: { type: string; title: string; inputs: Record<string, unknown>; result: Record<string, unknown> }) {
  const userId = await getUserId()
  await db.insert(calculations).values({ userId, type: input.type, title: input.title, inputs: input.inputs, result: input.result })
  return { ok: true }
}

export async function getCalculations() {
  const userId = await getUserId()
  return db.select().from(calculations).where(eq(calculations.userId, userId)).orderBy(desc(calculations.createdAt)).limit(30)
}
