import { TaxDashboard } from '@/components/tax-dashboard'
import { getCalculations } from '@/app/actions/calculations'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const calculations = await getCalculations()
  return <TaxDashboard user={session.user} initialHistory={calculations} />
}
