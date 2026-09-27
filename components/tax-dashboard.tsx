'use client'

import { useMemo, useState } from 'react'
import { saveCalculation } from '@/app/actions/calculations'
import {
  ArrowDownToLine,
  ArrowRight,
  Bell,
  Calculator,
  ChevronDown,
  Clock3,
  Euro,
  FileText,
  History,
  Landmark,
  Mail,
  Menu,
  MoreHorizontal,
  ReceiptText,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react'

type CalculatorId = 'salary' | 'vat' | 'currency' | 'late-interest' | 'vehicle' | 'self-employed'

const calculators = [
  { id: 'salary' as CalculatorId, label: 'Заплата и осигуровки', description: 'Нето, бруто и цена за работодателя', icon: WalletCards },
  { id: 'vat' as CalculatorId, label: 'ДДС калкулатор', description: 'Добавяне или премахване на 20% ДДС', icon: ReceiptText },
  { id: 'currency' as CalculatorId, label: 'Лев ↔ Евро', description: 'Фиксиран курс 1 EUR = 1.95583 BGN', icon: Euro },
  { id: 'late-interest' as CalculatorId, label: 'Лихва към НАП', description: 'Изчисли лихва за просрочие', icon: Clock3 },
  { id: 'vehicle' as CalculatorId, label: 'Данък МПС', description: 'Мощност и екологична категория', icon: Landmark },
  { id: 'self-employed' as CalculatorId, label: 'Самоосигуряване', description: 'Авансови вноски и изравняване', icon: ShieldCheck },
]

const recent = [
  { name: 'Нетна заплата', date: 'Днес, 10:42', amount: '1 842.40 €', type: 'Заплати' },
  { name: 'ДДС върху фактура', date: 'Вчера, 16:18', amount: '240.00 €', type: 'ДДС' },
  { name: 'Превалутиране', date: '12 юни 2025', amount: '1 955.83 лв.', type: 'Валута' },
]

function formatMoney(value: number, currency = '€') {
  return `${value.toLocaleString('bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`
}

export function TaxDashboard() {
  const [active, setActive] = useState<CalculatorId>('salary')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [gross, setGross] = useState('2400')
  const [vatAmount, setVatAmount] = useState('1200')
  const [currencyAmount, setCurrencyAmount] = useState('1955.83')
  const [currencyDirection, setCurrencyDirection] = useState<'to-euro' | 'to-lev'>('to-euro')
  const [interestPrincipal, setInterestPrincipal] = useState('1000')
  const [interestRate, setInterestRate] = useState('10.15')
  const [interestFrom, setInterestFrom] = useState('2025-01-01')
  const [interestTo, setInterestTo] = useState('2025-06-30')
  const [vehicleKw, setVehicleKw] = useState('85')
  const [vehicleCategory, setVehicleCategory] = useState('Euro 6')
  const [selfIncome, setSelfIncome] = useState('2000')
  const [selfRate, setSelfRate] = useState('27.8')
  const [saved, setSaved] = useState(false)

  const salary = useMemo(() => {
    const grossValue = Number(gross) || 0
    const employeeContributions = grossValue * 0.1378
    const taxable = Math.max(0, grossValue - employeeContributions)
    const tax = taxable * 0.1
    const net = grossValue - employeeContributions - tax
    const employerContributions = grossValue * 0.1892
    return { net, employeeContributions, tax, employerCost: grossValue + employerContributions }
  }, [gross])

  const vat = useMemo(() => {
    const value = Number(vatAmount) || 0
    return { net: value / 1.2, tax: value - value / 1.2, gross: value * 1.2 }
  }, [vatAmount])

  const converted = useMemo(() => {
    const value = Number(currencyAmount) || 0
    return currencyDirection === 'to-euro' ? value / 1.95583 : value * 1.95583
  }, [currencyAmount, currencyDirection])

  const interest = useMemo(() => { const days = Math.max(0, Math.ceil((new Date(interestTo).getTime() - new Date(interestFrom).getTime()) / 86400000)); const principal = Number(interestPrincipal) || 0; const rate = Number(interestRate) || 0; return { days, amount: principal * rate / 100 * days / 365, total: principal + principal * rate / 100 * days / 365 } }, [interestPrincipal, interestRate, interestFrom, interestTo])
  const vehicle = useMemo(() => { const kw = Number(vehicleKw) || 0; const base = kw <= 55 ? 0.34 * kw : kw <= 74 ? 0.54 * kw : kw <= 110 ? 1.21 * kw : 2.42 * kw; const eco = vehicleCategory === 'Euro 6' ? 0.5 : vehicleCategory === 'Euro 5' ? 0.6 : vehicleCategory === 'Euro 4' ? 0.8 : 1; return base * eco }, [vehicleKw, vehicleCategory])
  const selfEmployed = useMemo(() => { const income = Number(selfIncome) || 0; const contributions = income * (Number(selfRate) || 0) / 100; return { monthly: contributions, annual: contributions * 12, finalTaxBase: income * 12 * 0.9 } }, [selfIncome, selfRate])
  async function handleSave(type: string, title: string, inputs: Record<string, unknown>, result: Record<string, unknown>) { try { await saveCalculation({ type, title, inputs, result }); setSaved(true); setTimeout(() => setSaved(false), 2500) } catch { window.location.href = '/sign-in' } }
  const activeCalculator = calculators.find((item) => item.id === active) ?? calculators[0]
  const ActiveIcon = activeCalculator.icon

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#17243a]">
      <header className="sticky top-0 z-20 border-b border-[#e5eaf1] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
          <div className="flex items-center gap-3">
            <button className="rounded-lg p-2 lg:hidden" aria-label="Отвори меню" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button>
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#155eef] text-white shadow-[0_7px_18px_rgba(21,94,239,.22)]"><Calculator className="size-5" /></div>
            <div><p className="text-[19px] font-bold tracking-[-.03em]">DanTax</p><p className="hidden text-[10px] font-semibold uppercase tracking-[.16em] text-[#8a96a8] sm:block">Финансови калкулатори</p></div>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-[#69778b] lg:flex"><a className="text-[#155eef]" href="#calculators">Калкулатори</a><a href="#history">История</a><a href="#deadlines">Срокове</a></div>
          <div className="flex items-center gap-3"><button className="relative rounded-lg p-2 text-[#718096] hover:bg-[#f4f7fb]" aria-label="Известия"><Bell className="size-5" /><span className="absolute right-1 top-1 size-2 rounded-full bg-[#f04438] ring-2 ring-white" /></button><button className="hidden items-center gap-2 rounded-lg border border-[#e3e8ef] px-3 py-2 text-sm font-semibold text-[#506075] sm:flex"><UserRound className="size-4" /> Моят профил <ChevronDown className="size-3.5" /></button></div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        <aside className={`${mobileOpen ? 'block' : 'hidden'} fixed inset-x-0 top-[76px] z-10 bg-white p-5 shadow-lg lg:static lg:block lg:w-[286px] lg:shrink-0 lg:bg-transparent lg:p-8 lg:pr-5 lg:shadow-none`}>
          <div className="mb-7"><p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[.14em] text-[#9aa6b7]">Работно пространство</p><button className="flex w-full items-center justify-between rounded-xl border border-[#dce6f5] bg-white px-3.5 py-3 text-left shadow-sm"><span><span className="block text-sm font-semibold">Личен профил</span><span className="block text-xs text-[#8a96a8]">Иван Петров</span></span><ChevronDown className="size-4 text-[#8a96a8]" /></button></div>
          <nav id="calculators" className="flex flex-col gap-1.5"><p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[.14em] text-[#9aa6b7]">Инструменти</p>{calculators.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => { setActive(item.id); setMobileOpen(false) }} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active === item.id ? 'bg-[#eaf2ff] text-[#155eef]' : 'text-[#66758a] hover:bg-white hover:text-[#17243a]'}`}><Icon className="size-[18px] shrink-0" /><span className="min-w-0"><span className="block truncate text-[13px] font-semibold">{item.label}</span><span className="block truncate text-[11px] opacity-70">{item.description}</span></span>{active === item.id && <ArrowRight className="ml-auto size-4" />}</button> })}</nav>
          <div className="mt-8 border-t border-[#e5eaf1] pt-6"><button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#66758a] hover:bg-white"><History className="size-[18px]" /> История на изчисленията</button><button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#66758a] hover:bg-white"><Bell className="size-[18px]" /> Моите напомняния</button><button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#66758a] hover:bg-white"><Settings2 className="size-[18px]" /> Настройки</button></div>
          <div className="mt-8 rounded-2xl bg-[#17243a] p-4 text-white"><Sparkles className="mb-5 size-5 text-[#7aa7ff]" /><p className="mb-1 text-sm font-bold">Всичко на едно място</p><p className="mb-4 text-xs leading-5 text-[#b2bfd1]">Запазвай изчисления и получавай напомняния за важни срокове.</p><button className="text-xs font-bold text-[#9fc0ff]">Научи повече <ArrowRight className="ml-1 inline size-3" /></button></div>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-8 lg:px-10 lg:py-10">
          <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-sm font-semibold text-[#155eef]">Добре дошъл, Иван</p><h1 className="text-[30px] font-bold tracking-[-.04em] text-[#17243a] lg:text-[36px]">Сметни. Разбери. Спести.</h1><p className="mt-2 max-w-xl text-sm text-[#718096]">Точни финансови калкулации с актуални правила за България.</p></div><button className="flex w-fit items-center gap-2 rounded-lg border border-[#dce3ec] bg-white px-4 py-2.5 text-sm font-semibold text-[#536277] shadow-sm"><FileText className="size-4" /> Виж сроковете за 2025 <ArrowRight className="size-4" /></button></div>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,.75fr)]">
            <div className="rounded-2xl border border-[#dce6f5] bg-white p-6 shadow-[0_8px_28px_rgba(35,55,90,.04)] lg:p-8"><div className="mb-7 flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#155eef]"><ActiveIcon className="size-5" /></div><div><h2 className="text-lg font-bold">{activeCalculator.label}</h2><p className="text-xs text-[#8290a4]">{activeCalculator.description}</p></div></div><button className="rounded-lg p-2 text-[#8b98aa] hover:bg-[#f5f7fa]" aria-label="Още опции"><MoreHorizontal className="size-5" /></button></div>
              {active === 'salary' && <div className="grid gap-8 lg:grid-cols-[1fr_1fr]"><div><label className="mb-2 block text-xs font-bold text-[#526177]">Брутна месечна заплата</label><div className="relative"><input value={gross} onChange={(e) => setGross(e.target.value)} className="h-12 w-full rounded-lg border border-[#dce3ec] bg-white px-4 pr-12 text-lg font-bold outline-none transition focus:border-[#155eef] focus:ring-4 focus:ring-[#155eef]/10" inputMode="decimal" /><span className="absolute right-4 top-3.5 text-sm font-semibold text-[#91a0b4]">€</span></div><p className="mt-2 text-[11px] text-[#8a96a8]">Въведи брутното си възнаграждение</p><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#f7f9fc] p-3"><p className="text-[11px] text-[#8794a8]">Лични осигуровки</p><p className="mt-1 text-sm font-bold">{formatMoney(salary.employeeContributions)}</p></div><div className="rounded-xl bg-[#f7f9fc] p-3"><p className="text-[11px] text-[#8794a8]">Данък общ доход</p><p className="mt-1 text-sm font-bold">{formatMoney(salary.tax)}</p></div></div></div><div className="rounded-2xl bg-[#f1f6ff] p-5"><p className="text-xs font-semibold text-[#5e7190]">Очаквана нетна заплата</p><p className="mt-2 text-[34px] font-bold tracking-[-.04em] text-[#155eef]">{formatMoney(salary.net)}</p><div className="mt-5 flex items-center justify-between border-t border-[#dce8fb] pt-4 text-xs"><span className="text-[#72829a]">Пълна цена за работодателя</span><strong>{formatMoney(salary.employerCost)}</strong></div><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#155eef] py-3 text-sm font-bold text-white shadow-[0_7px_15px_rgba(21,94,239,.2)] hover:bg-[#0f4fd3]"><Calculator className="size-4" /> Изчисли и запази</button></div></div>}
              {active === 'vat' && <div className="grid gap-8 lg:grid-cols-2"><div><label className="mb-2 block text-xs font-bold text-[#526177]">Сума с включен ДДС</label><input value={vatAmount} onChange={(e) => setVatAmount(e.target.value)} className="h-12 w-full rounded-lg border border-[#dce3ec] px-4 text-lg font-bold outline-none focus:border-[#155eef]" inputMode="decimal" /><p className="mt-2 text-[11px] text-[#8a96a8]">Ставка на ДДС: 20%</p></div><div className="rounded-2xl bg-[#f1f6ff] p-5"><p className="text-xs text-[#5e7190]">Сума без ДДС</p><p className="mt-2 text-[34px] font-bold text-[#155eef]">{formatMoney(vat.net)}</p><div className="mt-4 flex justify-between border-t border-[#dce8fb] pt-3 text-xs"><span className="text-[#72829a]">Размер на ДДС</span><strong>{formatMoney(vat.tax)}</strong></div></div></div>}
              {active === 'currency' && <div className="grid gap-8 lg:grid-cols-2"><div><label className="mb-2 block text-xs font-bold text-[#526177]">Сума за превалутиране</label><div className="flex gap-2"><input value={currencyAmount} onChange={(e) => setCurrencyAmount(e.target.value)} className="h-12 min-w-0 flex-1 rounded-lg border border-[#dce3ec] px-4 text-lg font-bold outline-none focus:border-[#155eef]" inputMode="decimal" /><button onClick={() => setCurrencyDirection(currencyDirection === 'to-euro' ? 'to-lev' : 'to-euro')} className="flex h-12 items-center gap-2 rounded-lg border border-[#dce3ec] bg-[#f7f9fc] px-3 text-sm font-bold">{currencyDirection === 'to-euro' ? 'лв → €' : '€ → лв'} <ArrowRight className="size-4" /></button></div><p className="mt-2 text-[11px] text-[#8a96a8]">Фиксиран курс: 1 EUR = 1.95583 BGN</p></div><div className="rounded-2xl bg-[#f1f6ff] p-5"><p className="text-xs text-[#5e7190]">Резултат</p><p className="mt-2 text-[34px] font-bold text-[#155eef]">{formatMoney(converted, currencyDirection === 'to-euro' ? '€' : 'лв.')}</p><p className="mt-4 text-xs text-[#72829a]">Изчислението е по официалния фиксиран курс.</p></div></div>}
              {active === 'late-interest' && <div className="grid gap-6 lg:grid-cols-2"><div className="grid gap-3"><label className="text-xs font-bold text-[#526177]">Главница</label><input value={interestPrincipal} onChange={(e) => setInterestPrincipal(e.target.value)} className="h-11 rounded-lg border px-3" inputMode="decimal" /><label className="text-xs font-bold text-[#526177]">Годишна законна лихва (%)</label><input value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="h-11 rounded-lg border px-3" inputMode="decimal" /><div className="grid grid-cols-2 gap-3"><input type="date" value={interestFrom} onChange={(e) => setInterestFrom(e.target.value)} className="h-11 rounded-lg border px-3" /><input type="date" value={interestTo} onChange={(e) => setInterestTo(e.target.value)} className="h-11 rounded-lg border px-3" /></div></div><div className="rounded-2xl bg-[#f1f6ff] p-5"><p className="text-xs text-[#5e7190]">{interest.days} дни просрочие</p><p className="mt-2 text-[34px] font-bold text-[#155eef]">{formatMoney(interest.amount, 'лв.')}</p><p className="text-xs text-[#72829a]">Общо с лихва: {formatMoney(interest.total, 'лв.')}</p><button onClick={() => handleSave('late-interest', 'Лихва към НАП', { interestPrincipal, interestRate, interestFrom, interestTo }, interest)} className="mt-5 w-full rounded-lg bg-[#155eef] py-3 text-sm font-bold text-white">Изчисли и запази</button></div></div>}
              {active === 'vehicle' && <div className="grid gap-6 lg:grid-cols-2"><div className="grid gap-3"><label className="text-xs font-bold text-[#526177]">Мощност (kW)</label><input value={vehicleKw} onChange={(e) => setVehicleKw(e.target.value)} className="h-11 rounded-lg border px-3" inputMode="decimal" /><label className="text-xs font-bold text-[#526177]">Екологична категория</label><select value={vehicleCategory} onChange={(e) => setVehicleCategory(e.target.value)} className="h-11 rounded-lg border px-3"><option>Euro 6</option><option>Euro 5</option><option>Euro 4</option><option>Euro 3</option><option>Без категория</option></select></div><div className="rounded-2xl bg-[#f1f6ff] p-5"><p className="text-xs text-[#5e7190]">Ориентировъчен годишен данък</p><p className="mt-2 text-[34px] font-bold text-[#155eef]">{formatMoney(vehicle, 'лв.')}</p><p className="text-xs text-[#72829a]">Ставките зависят от общината и годината.</p><button onClick={() => handleSave('vehicle', 'Данък МПС', { vehicleKw, vehicleCategory }, { annualTax: vehicle })} className="mt-5 w-full rounded-lg bg-[#155eef] py-3 text-sm font-bold text-white">Изчисли и запази</button></div></div>}
              {active === 'self-employed' && <div className="grid gap-6 lg:grid-cols-2"><div className="grid gap-3"><label className="text-xs font-bold text-[#526177]">Осигурителен доход</label><input value={selfIncome} onChange={(e) => setSelfIncome(e.target.value)} className="h-11 rounded-lg border px-3" inputMode="decimal" /><label className="text-xs font-bold text-[#526177]">Обща ставка (%)</label><input value={selfRate} onChange={(e) => setSelfRate(e.target.value)} className="h-11 rounded-lg border px-3" inputMode="decimal" /></div><div className="rounded-2xl bg-[#f1f6ff] p-5"><p className="text-xs text-[#5e7190]">Месечни авансови вноски</p><p className="mt-2 text-[34px] font-bold text-[#155eef]">{formatMoney(selfEmployed.monthly, 'лв.')}</p><div className="mt-4 flex justify-between border-t border-[#dce8fb] pt-3 text-xs"><span className="text-[#72829a]">Годишно</span><strong>{formatMoney(selfEmployed.annual, 'лв.')}</strong></div><button onClick={() => handleSave('self-employed', 'Самоосигуряване', { selfIncome, selfRate }, selfEmployed)} className="mt-5 w-full rounded-lg bg-[#155eef] py-3 text-sm font-bold text-white">Изчисли и запази</button></div></div>}
            </div>
            <div id="deadlines" className="rounded-2xl border border-[#dce6f5] bg-[#17243a] p-6 text-white shadow-[0_8px_28px_rgba(35,55,90,.08)]"><div className="flex items-center justify-between"><div className="flex size-10 items-center justify-center rounded-xl bg-white/10"><Bell className="size-5 text-[#9fc0ff]" /></div><span className="rounded-full bg-[#294463] px-2.5 py-1 text-[10px] font-bold text-[#bcd2ff]">ПРЕДСТОИ</span></div><p className="mt-7 text-xs font-semibold text-[#9aaec9]">Следващ важен срок</p><h3 className="mt-2 text-[20px] font-bold">Годишна данъчна декларация</h3><div className="mt-5 flex items-end justify-between"><div><p className="text-[30px] font-bold">30 апр</p><p className="text-xs text-[#9aaec9]">Остават 28 дни</p></div><button className="rounded-lg bg-white/10 p-2.5 text-white hover:bg-white/15" aria-label="Добави напомняне"><ArrowRight className="size-4" /></button></div><div className="mt-6 border-t border-white/10 pt-4 text-xs text-[#aabbd2]">Добави сроковете към твоите напомняния</div></div>
          </section>

          <section id="history" className="mt-10 rounded-2xl border border-[#e1e7ef] bg-white shadow-[0_8px_28px_rgba(35,55,90,.03)]"><div className="flex flex-col gap-3 border-b border-[#edf0f4] p-6 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold">Последни изчисления</h2><p className="mt-1 text-xs text-[#8290a4]">Запазените резултати от твоя профил</p></div><button className="flex items-center gap-2 text-xs font-bold text-[#155eef]">Виж цялата история <ArrowRight className="size-3.5" /></button></div><div className="divide-y divide-[#edf0f4]">{recent.map((item) => <div key={item.name} className="flex items-center justify-between gap-4 px-6 py-4"><div className="flex min-w-0 items-center gap-3"><div className="hidden size-9 items-center justify-center rounded-lg bg-[#f3f6fa] text-[#75859a] sm:flex"><FileText className="size-4" /></div><div className="min-w-0"><p className="truncate text-sm font-semibold">{item.name}</p><p className="mt-0.5 text-[11px] text-[#8a96a8]">{item.type} · {item.date}</p></div></div><div className="flex items-center gap-4"><strong className="whitespace-nowrap text-sm">{item.amount}</strong><button className="hidden rounded-md p-1.5 text-[#9aa6b7] hover:bg-[#f4f7fb] sm:block" aria-label={`Експорт на ${item.name}`}><ArrowDownToLine className="size-4" /></button></div></div>)}</div></section>
          <footer className="mt-10 flex flex-col gap-3 border-t border-[#e1e7ef] py-6 text-xs text-[#8a96a8] sm:flex-row sm:items-center sm:justify-between"><span>© 2025 DanTax · Информацията е с информативна цел.</span><span className="flex gap-4"><a href="#">За нас</a><a href="#">Контакти</a><a href="#">Поверителност</a></span></footer>
        </main>
      </div>
    </div>
  )
}

export function SearchIcon() { return <Search className="size-4" /> }
export function MailIcon() { return <Mail className="size-4" /> }
