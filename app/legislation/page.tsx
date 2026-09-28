import Link from 'next/link'
import { ArrowLeft, Calculator, ExternalLink, Landmark } from 'lucide-react'

const sections = [
  {
    title: 'Заплата и осигуровки',
    purpose: 'Показва как брутното възнаграждение се преобразува в нетна заплата и каква е пълната цена на труда за работодателя.',
    laws: 'Кодекс за социално осигуряване (КСО), Закон за здравното осигуряване (ЗЗО) и Закон за данъците върху доходите на физическите лица (ЗДДФЛ).',
  },
  {
    title: 'ДДС калкулатор',
    purpose: 'Добавя 20% ДДС към нетна сума или отделя включения ДДС от крайна цена.',
    laws: 'Закон за данък върху добавената стойност (ЗДДС), който определя облагаемите доставки, ставките и правилата за начисляване.',
  },
  {
    title: 'Лев ↔ Евро',
    purpose: 'Превалутира суми между левове и евро по фиксирания официален курс за ориентировъчни сравнения.',
    laws: 'Закон за Българската народна банка и правилата за фиксирания курс 1 EUR = 1.95583 BGN.',
  },
  {
    title: 'Лихва към НАП',
    purpose: 'Изчислява ориентировъчната законна лихва върху просрочено публично задължение според главницата, периода и годишната ставка.',
    laws: 'Данъчно-осигурителен процесуален кодекс (ДОПК) и приложимите нормативни актове за законната лихва при просрочени публични задължения.',
  },
  {
    title: 'Данък МПС',
    purpose: 'Дава ориентировъчна годишна стойност според мощността на двигателя и екологичната категория на автомобила.',
    laws: 'Закон за местните данъци и такси (ЗМДТ). Точната ставка се определя с наредба на съответната община и може да се променя.',
  },
  {
    title: 'Самоосигуряване',
    purpose: 'Изчислява месечните авансови осигурителни вноски и годишния им размер за самоосигуряващи се лица.',
    laws: 'Кодекс за социално осигуряване (КСО), Закон за здравното осигуряване (ЗЗО) и ЗДДФЛ. Окончателният размер се определя след годишното изравняване.',
  },
]

export default function LegislationPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] text-[#17243a]">
      <header className="border-b border-[#e5eaf1] bg-white">
        <div className="mx-auto flex h-[76px] max-w-[1120px] items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Към началната страница">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#155eef] text-white shadow-[0_7px_18px_rgba(21,94,239,.22)]"><Calculator className="size-5" /></span>
            <span><span className="block text-[19px] font-bold tracking-[-.03em]">DanTax</span><span className="hidden text-[10px] font-semibold uppercase tracking-[.16em] text-[#8a96a8] sm:block">Финансови калкулатори</span></span>
          </Link>
          <Link href="/" className="flex items-center gap-2 rounded-lg border border-[#dce3ec] bg-white px-3 py-2 text-sm font-semibold text-[#536277] hover:bg-[#f4f7fb]"><ArrowLeft className="size-4" /> Към калкулаторите</Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1120px] px-5 py-10 lg:px-8 lg:py-14">
        <div className="max-w-3xl">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[#eaf2ff] text-[#155eef]"><Landmark className="size-6" /></div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#155eef]">Правна рамка</p>
          <h1 className="mt-3 text-[34px] font-bold tracking-[-.04em] lg:text-[46px]">Законодателство и предназначение</h1>
          <p className="mt-4 text-base leading-7 text-[#718096]">Подробно обяснение какво изчислява всеки инструмент, кога е полезен и кои основни нормативни актове стоят зад него.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-[#dce6f5] bg-white p-6 shadow-[0_8px_28px_rgba(35,55,90,.04)]">
              <h2 className="text-xl font-bold">{section.title}</h2>
              <div className="mt-5 grid gap-4 text-sm leading-6">
                <div><p className="mb-1 text-xs font-bold uppercase tracking-[.1em] text-[#155eef]">За какво служи</p><p className="text-[#5f6f84]">{section.purpose}</p></div>
                <div className="border-t border-[#edf0f4] pt-4"><p className="mb-1 text-xs font-bold uppercase tracking-[.1em] text-[#155eef]">Основни закони</p><p className="text-[#5f6f84]">{section.laws}</p></div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-[#dce6f5] bg-[#17243a] p-6 text-white lg:p-8">
          <h2 className="text-xl font-bold">Важно уточнение</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#b2bfd1]">Страницата има информативен характер и не представлява данъчен или правен съвет. Ставките, общинските наредби и сроковете могат да се променят. За официална справка проверявай актуалните публикации на НАП, Министерството на финансите и своята община.</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold"><a href="https://nra.bg/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#9fc0ff] hover:text-white">НАП <ExternalLink className="size-3.5" /></a><a href="https://www.minfin.bg/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[#9fc0ff] hover:text-white">Министерство на финансите <ExternalLink className="size-3.5" /></a></div>
        </section>
      </div>
    </main>
  )
}
