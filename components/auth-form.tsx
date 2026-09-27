'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setPending(true); setError('')
    const result = mode === 'sign-up' ? await authClient.signUp.email({ name, email, password }) : await authClient.signIn.email({ email, password })
    setPending(false)
    if (result.error) { setError('Провери въведените данни и опитай отново.'); return }
    router.push('/'); router.refresh()
  }
  return <form onSubmit={submit} className="flex w-full max-w-md flex-col gap-4 rounded-2xl border bg-white p-8 shadow-sm"><h1 className="text-2xl font-bold">{mode === 'sign-up' ? 'Създай профил' : 'Вход в DanTax'}</h1>{mode === 'sign-up' && <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Име" className="h-11 rounded-lg border px-3" />}<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Имейл" className="h-11 rounded-lg border px-3" /><input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Парола" className="h-11 rounded-lg border px-3" />{error && <p className="text-sm text-destructive">{error}</p>}<button disabled={pending} className="h-11 rounded-lg bg-[#155eef] font-semibold text-white disabled:opacity-60">{pending ? 'Изчакай…' : mode === 'sign-up' ? 'Регистрация' : 'Вход'}</button><a className="text-center text-sm text-[#155eef]" href={mode === 'sign-up' ? '/sign-in' : '/sign-up'}>{mode === 'sign-up' ? 'Вече имаш профил? Вход' : 'Нямаш профил? Регистрация'}</a></form>
}
