import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  Layers,
  Target,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { modelMetrics } from '@/lib/mock-data'

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="glass rounded-2xl p-6 text-center transition-transform duration-200 hover:-translate-y-1">
      <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
        <Icon className="size-5" />
      </span>
      <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight text-primary">
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  )
}

function ArchLayer({
  title,
  subtitle,
  tone,
}: {
  title: string
  subtitle: string
  tone: 'input' | 'cnn' | 'lstm' | 'output'
}) {
  const tones = {
    input: 'bg-muted text-foreground ring-border',
    cnn: 'bg-primary/15 text-primary ring-primary/30',
    lstm: 'bg-safe/15 text-safe ring-safe/30',
    output: 'bg-danger/15 text-danger ring-danger/30',
  }[tone]

  return (
    <div
      className={`flex min-w-[120px] flex-1 flex-col items-center gap-1 rounded-xl px-4 py-4 text-center ring-1 ${tones}`}
    >
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-[11px] opacity-80">{subtitle}</span>
    </div>
  )
}

export function ModelInfoView() {
  const layers = [
    { title: 'Input', subtitle: 'URL Tokenization', tone: 'input' as const },
    { title: 'Embedding', subtitle: 'Char / Word vectors', tone: 'input' as const },
    { title: 'CNN', subtitle: 'Conv1D + Pooling', tone: 'cnn' as const },
    { title: 'LSTM', subtitle: 'Sequence memory', tone: 'lstm' as const },
    { title: 'Dense', subtitle: 'Sigmoid output', tone: 'output' as const },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-foreground/90 ring-1 ring-primary/30">
          <BrainCircuit className="size-3.5" />
          Dokumentasi Model
        </div>
        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          Informasi Model
        </h1>
        <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
          PhishGuard menggunakan arsitektur hibrida CNN-LSTM. Lapisan konvolusi
          mengekstraksi pola lokal dari karakter URL, sementara lapisan LSTM menangkap
          ketergantungan berurutan, menghasilkan klasifikasi phishing yang akurat.
        </p>
      </header>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard icon={Target} label="Accuracy" value={`${modelMetrics.accuracy}%`} />
        <MetricCard icon={Layers} label="F1-Score" value={`${modelMetrics.f1}%`} />
        <MetricCard icon={TrendingUp} label="Recall" value={`${modelMetrics.recall}%`} />
      </div>

      {/* Architecture diagram */}
      <section className="glass-strong rounded-2xl p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Boxes className="size-5 text-primary" />
          <h2 className="text-base font-semibold">Arsitektur CNN-LSTM</h2>
        </div>

        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
          {layers.map((layer, i) => (
            <div
              key={layer.title}
              className="flex flex-col items-center gap-3 md:flex-1 md:flex-row"
            >
              <ArchLayer {...layer} />
              {i < layers.length - 1 && (
                <ArrowRight className="size-5 shrink-0 rotate-90 text-muted-foreground md:rotate-0" />
              )}
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          Teks URL dipecah menjadi token dan di-embedding, lalu dilewatkan melalui
          pengekstraksi fitur konvolusional (CNN), kemudian lapisan LSTM memodelkan
          struktur urutannya sebelum lapisan dense sigmoid mengeluarkan persentase probabilitas phishing.
        </p>
      </section>

      {/* Details */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold">Data Pelatihan</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Dilatih menggunakan 88.000+ URL berlabel yang seimbang antara domain
            phishing dan domain sah/aman, yang bersumber dari PhishTank dan Common Crawl.
          </p>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold">Inferensi</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Rata-rata kecepatan klasifikasi di bawah 40ms per URL, memungkinkan
            perlindungan real-time dalam skala besar tanpa waktu tunggu yang terasa lambat.
          </p>
        </div>
      </section>
    </div>
  )
}
