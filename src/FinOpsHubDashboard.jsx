import React, { useMemo, useState } from 'react'
import {
  BarChart2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Filter,
  Lightbulb,
  TrendingUp,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Search,
  Home,
  Zap,
  BookOpen,
  BarChart3,
  Settings,
  ExternalLink,
} from 'lucide-react'
import {
  ComposedChart,
  Line,
  Bar as ReBar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from 'recharts'

const sidebarNav = [
  { key: 'overview', label: 'Overview', icon: Home },
  { key: 'optimizations', label: 'Optimizations', icon: Zap },
  { key: 'savings', label: 'Savings Ledger', icon: DollarSign },
  { key: 'peer', label: 'Peer Benchmarks', icon: BarChart3 },
  { key: 'recs', label: 'Recommendations', icon: Lightbulb },
  { key: 'settings', label: 'Settings', icon: Settings },
]

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function Money({ value, className = '' }) {
  return (
    <span className={`font-variant-numeric tabular-nums ${className}`}>{value}</span>
  )
}

function ScoreRing({ score, outOf = 100 }) {
  const percent = clamp((score / outOf) * 100, 0, 100)
  const r = 26
  const c = 2 * Math.PI * r
  const dashOffset = c - (percent / 100) * c

  return (
    <div className="flex items-center gap-4">
      <svg width="68" height="68" viewBox="0 0 68 68" className="-rotate-90">
        <circle
          cx="34"
          cy="34"
          r={r}
          fill="none"
          stroke="#10b981"
          strokeWidth="6"
          opacity="0.12"
        />
        <circle
          cx="34"
          cy="34"
          r={r}
          fill="none"
          stroke="#10b981"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 500ms ease' }}
        />
      </svg>
      <div>
        <div className="text-2xl font-bold text-slate-800 leading-none">{score} / {outOf}</div>
        <div className="text-sm text-emerald-500">+3 this month</div>
      </div>
    </div>
  )
}

function TypeBadge({ type }) {
  const colorMap = {
    Rate: 'bg-blue-100 text-blue-700',
    Usage: 'bg-purple-100 text-purple-700',
    Idle: 'bg-slate-100 text-slate-600',
  }
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${colorMap[type] || ''}`}>
      {type}
    </span>
  )
}

export default function FinOpsHubDashboard() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeNav, setActiveNav] = useState('overview')
  const [activeFilter, setActiveFilter] = useState('All')

  const optimizations = useMemo(
    () => [
      {
        type: 'Rate',
        service: 'Compute Engine · proj-prod-api',
        chip: 'AI',
        action:
          'Right-size e2-std-4 → e2-std-2, then 1yr CUD — sequential saves more',
        saving: '$1,240/mo',
      },
      {
        type: 'Rate',
        service: 'GKE · cluster-prod-us-central1',
        action: 'Enable Spot for batch node pool — tolerates preemption',
        saving: '$540/mo',
      },
      {
        type: 'Rate',
        service: 'Cloud SQL · analytics-db-01',
        action: '3yr CUD for db-custom-4-15360 — 180d consistent baseline',
        saving: '$780/mo',
      },
      {
        type: 'Usage',
        service: 'Compute Engine · proj-staging',
        action: 'Right-size e2-std-8 → e2-std-2 · CPU avg 12%, P95 18%',
        saving: '$450/mo',
      },
      {
        type: 'Usage',
        service: 'BigQuery · project-data-warehouse',
        action: 'Switch to flat-rate 100 slots — on-demand exceeds break-even',
        saving: '$420/mo',
      },
      {
        type: 'Idle',
        service: 'Cloud Storage · backup-archive-bucket',
        action: '4.2 TB → Coldline · last accessed 120+ days ago',
        saving: '$310/mo',
      },
      {
        type: 'Idle',
        service: 'Cloud Run · image-resize-service',
        action: 'Max instances 100 → 20 · peak observed: 8',
        saving: '$180/mo',
      },
    ],
    []
  )

  const filtered = optimizations.filter((r) =>
    activeFilter === 'All' ? true : r.type === activeFilter
  )

  const alerts = useMemo(
    () => [
      {
        title: 'Unattended project',
        tag: 'proj-legacy-analytics-04',
        desc: '0 active users · 14 days idle',
        saving: '+$2,100/mo',
        border: 'border-l-4 border-red-400',
        link: 'Investigate ↗',
      },
      {
        title: 'BigQuery cost spike',
        tag: 'marketing-pipeline',
        desc: '+340% vs 7-day avg',
        saving: '+$890',
        border: 'border-l-4 border-amber-400',
        link: 'Review ↗',
      },
      {
        title: 'CUD expires in 7 days',
        tag: 'Compute Engine · us-central1',
        desc: '64 vCPU commitment',
        saving: 'Review',
        border: 'border-l-4 border-amber-300',
        link: 'Review ↗',
        hideSaving: true,
      },
    ],
    []
  )

  const monthlyApplied = [
    { month: 'Jun', value: 7400 },
    { month: 'May', value: 7600 },
    { month: 'Apr', value: 8700 },
    { month: 'Mar', value: 10600 },
    { month: 'Feb', value: 9500 },
    { month: 'Jan', value: 11300 },
  ]

  const chartMonthly = [
    { month: 'Jul', monthly: 4000 },
    { month: 'Aug', monthly: 5000 },
    { month: 'Sep', monthly: 6000 },
    { month: 'Oct', monthly: 7000 },
    { month: 'Nov', monthly: 8000 },
    { month: 'Dec', monthly: 9000 },
    { month: 'Jan', monthly: 11000 },
    { month: 'Feb', monthly: 9500 },
    { month: 'Mar', monthly: 10600 },
    { month: 'Apr', monthly: 8700 },
    { month: 'May', monthly: 7600 },
    { month: 'Jun', monthly: 7400 },
  ]

  const chartData = useMemo(() => {
    let sum = 0
    return chartMonthly.map((d) => {
      sum += d.monthly
      return { month: d.month, monthly: d.monthly, cumulative: sum }
    })
  }, [])

  const score = 74

  const pageMeta = {
    overview: {
      title: 'Overview',
      desc: 'Snapshot of cost performance, savings, and recommendations.',
    },
    optimizations: {
      title: 'Optimizations',
      desc: 'AI-driven opportunities with matching filters and action steps.',
    },
    savings: {
      title: 'Savings Ledger',
      desc: 'Monthly savings performance and cumulative forecast in one place.',
    },
    peer: {
      title: 'Peer Benchmarks',
      desc: 'Compare your FinOps posture against anonymized industry peers.',
    },
    recs: {
      title: 'Recommendations',
      desc: 'Open recommendations, pending value, and conversion history.',
    },
    settings: {
      title: 'Settings',
      desc: 'Customize dashboard preferences and notification behavior.',
    },
  }

  const activeSection = pageMeta[activeNav] || pageMeta.overview

  function renderSectionContent() {
    if (activeNav === 'optimizations') {
      return (
        <div className="space-y-4">
          <div className="bg-white/80 rounded-3xl border border-white/70 shadow-xl backdrop-blur-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">AI-prescribed optimizations</h2>
                <p className="mt-2 text-sm text-slate-500">Review the highest impact actions and filter by type.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', 'Rate', 'Usage', 'Idle'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      activeFilter === tab
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="text-left py-3 px-3 font-semibold">TYPE</th>
                    <th className="text-left py-3 px-3 font-semibold">SERVICE · ACTION</th>
                    <th className="text-right py-3 px-3 font-semibold">SAVING</th>
                    <th className="text-center py-3 px-3 font-semibold">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <TypeBadge type={row.type} />
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{row.service}</div>
                        <div className="text-xs text-slate-500 mt-1">{row.action}</div>
                        {row.chip && (
                          <div className="mt-2 inline-block rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                            {row.chip} chip
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-800">
                        <Money value={row.saving} />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700">
                          Apply ↗
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur-xl">
              <div className="text-sm uppercase tracking-[0.18em] text-slate-400">Rate opportunities</div>
              <div className="mt-3 text-2xl font-semibold text-slate-900"><Money value="$14,200/mo" /></div>
              <p className="mt-2 text-sm text-slate-500">Most impact from right-sizing and commitment discounts.</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur-xl">
              <div className="text-sm uppercase tracking-[0.18em] text-slate-400">Usage savings</div>
              <div className="mt-3 text-2xl font-semibold text-slate-900"><Money value="$8,670/mo" /></div>
              <p className="mt-2 text-sm text-slate-500">Focus on CPU and memory headroom across heavy workloads.</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur-xl">
              <div className="text-sm uppercase tracking-[0.18em] text-slate-400">Idle cleanup</div>
              <div className="mt-3 text-2xl font-semibold text-slate-900"><Money value="$3,100/mo" /></div>
              <p className="mt-2 text-sm text-slate-500">Inactive resources and stale storage are prime candidates.</p>
            </div>
          </div>
        </div>
      )
    }

    if (activeNav === 'savings') {
      return (
        <div className="grid gap-4 lg:grid-cols-[60%_40%]">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">12-Month savings trend</h2>
                <p className="text-sm text-slate-500">Cumulative value and month-by-month performance.</p>
              </div>
              <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">Download</button>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '12px' }} label={{ value: '$0-140K', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '12px' }} label={{ value: '$0-20K', angle: 90, position: 'insideRight' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} formatter={(value) => `$${(value / 1000).toFixed(1)}K`} />
                <Legend />
                <ReBar yAxisId="left" dataKey="monthly" fill="#bfdbfe" radius={[8, 8, 0, 0]} name="Monthly applied" />
                <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#10b981" dot={{ fill: '#10b981', r: 4 }} strokeWidth={2} name="Cumulative" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur-xl">
              <h3 className="text-sm font-semibold text-slate-800">This quarter</h3>
              <div className="mt-3 text-3xl font-semibold text-emerald-600"><Money value="$47,310" /></div>
              <p className="mt-2 text-sm text-slate-500">14 actions applied, with 6 high priority follow-ups.</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur-xl">
              <h3 className="text-sm font-semibold text-slate-800">Pending value</h3>
              <div className="mt-3 text-3xl font-semibold text-slate-900"><Money value="$25,970" /></div>
              <p className="mt-2 text-sm text-slate-500">Open recommendations that can still be converted.</p>
            </div>
          </div>
        </div>
      )
    }

    if (activeNav === 'peer') {
      return (
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Peer benchmarks</h2>
                <p className="mt-2 text-sm text-slate-500">Where your team stands versus peers in key FinOps levers.</p>
              </div>
              <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">View details</button>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              { label: 'Committed use discounts', you: 82, avg: 63, top: 94 },
              { label: 'Spot / preemptible', you: 58, avg: 49, top: 87 },
              { label: 'Sustained use discounts', you: 71, avg: 67, top: 91 },
            ].map((bench, idx) => (
              <div key={idx} className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-700">{bench.label}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Top performer {bench.top}%</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="font-semibold">You:</span>
                    <span className="text-slate-900">{bench.you}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${bench.you}%` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                    <div>Peer avg: {bench.avg}%</div>
                    <div>Top: {bench.top}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (activeNav === 'recs') {
      return (
        <div className="grid gap-4 lg:grid-cols-[55%_45%]">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Recommendations</h2>
                <p className="mt-2 text-sm text-slate-500">Open actions and recent optimization history.</p>
              </div>
              <button className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">Refresh</button>
            </div>
            <div className="space-y-4">
              {optimizations.slice(0, 5).map((rec, idx) => (
                <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <TypeBadge type={rec.type} />
                    <span className="text-sm font-semibold text-slate-800">{rec.saving}</span>
                  </div>
                  <div className="mt-3 text-sm font-semibold text-slate-900">{rec.service}</div>
                  <div className="mt-2 text-sm text-slate-500">{rec.action}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur-xl">
              <h3 className="text-sm font-semibold text-slate-800">Optimization history</h3>
              <div className="mt-4 grid gap-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">This month</div>
                  <div className="mt-2 text-2xl font-semibold text-emerald-600"><Money value="$9,840" /></div>
                  <div className="text-xs text-slate-500">4 actions applied</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">Pending value</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-900"><Money value="$25,970" /></div>
                  <div className="text-xs text-slate-500">14 open recs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (activeNav === 'settings') {
      return (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-slate-900">Dashboard settings</h2>
            <p className="mt-2 text-sm text-slate-500">Fine tune notifications and dashboard preferences.</p>
            <div className="mt-6 space-y-4">
              {[
                { label: 'Show peer benchmarks', enabled: true },
                { label: 'Enable daily savings alerts', enabled: false },
                { label: 'Auto-collapse sidebar', enabled: false },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div>
                    <div className="font-medium text-slate-800">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.enabled ? 'Enabled' : 'Disabled'}</div>
                  </div>
                  <button className={`rounded-full px-4 py-2 text-sm font-semibold transition ${item.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {item.enabled ? 'On' : 'Off'}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-xl">
            <h3 className="text-sm font-semibold text-slate-800">Support & account</h3>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="font-semibold text-slate-900">Sarah Chen</div>
                <div>FinOps Lead</div>
                <div className="mt-2 text-xs text-slate-500">Manage your profile and access settings.</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="font-semibold text-slate-900">Alert settings</div>
                <div className="mt-2 text-xs text-slate-500">Email and Slack notifications for cost spikes.</div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <>
        <section className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:-translate-y-0.5 transition shadow-md cursor-pointer">
            <ScoreRing score={score} outOf={100} />
            <button className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium">View report →</button>
          </div>

          <div className="bg-white/90 rounded-xl border border-slate-100 p-5 shadow-md shadow-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800"><Money value="$127,450" /></div>
                <div className="mt-2 text-sm">
                  <span className="text-emerald-500 font-medium">$9,840 this month</span>
                  <span className="text-slate-400"> · 38 actions</span>
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            </div>
          </div>

          <div className="bg-white/90 rounded-xl border border-slate-100 p-5 shadow-md shadow-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800"><Money value="$25,970/mo" /></div>
                <div className="mt-2 text-sm flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-500 font-medium">14 recommendations</span>
                </div>
              </div>
            </div>
            <button className="mt-3 text-sm text-slate-600 hover:text-slate-800 font-medium">Learn more →</button>
          </div>

          <div className="bg-white/90 rounded-xl border border-slate-100 p-5 shadow-md shadow-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-600">+13 pts</div>
                <div className="mt-2 text-sm text-slate-500">Above industry avg <span className="font-medium">(61)</span></div>
              </div>
              <BarChart2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-[35%_65%] gap-4">
          <div className="space-y-4">
            <div className="bg-white/90 rounded-xl border border-slate-100 p-5 shadow-md shadow-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Immediate Impact</h2>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">3</span>
              </div>
              <div className="space-y-3">
                {alerts.map((alert, idx) => (
                  <div key={idx} className={`${alert.border} p-4 bg-slate-50 rounded-lg`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 text-sm">{alert.title}</div>
                        <div className="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded inline-block mt-1">{alert.tag}</div>
                        <div className="text-xs text-slate-500 mt-2">{alert.desc}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      {!alert.hideSaving && (
                        <div className="font-semibold text-emerald-600 text-sm">{alert.saving}</div>
                      )}
                      <button className="text-xs text-slate-400 hover:text-slate-600 font-medium">{alert.link}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/90 rounded-xl border border-slate-100 p-5 shadow-md shadow-slate-200">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Opportunity Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-700"><span>Rate optimizations</span><Money value="$14,200/mo" /></div>
                <div className="flex justify-between text-slate-700"><span>Usage right-sizing</span><Money value="$8,670/mo" /></div>
                <div className="flex justify-between text-slate-700"><span>Idle / waste</span><Money value="$3,100/mo" /></div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold text-slate-800"><span>Total potential</span><Money value="$25,970/mo" /></div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 rounded-xl border border-slate-100 p-5 shadow-md shadow-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">AI-Prescribed Optimizations</h2>
              <div className="flex gap-3">
                {['All', 'Rate', 'Usage', 'Idle'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`text-sm font-medium pb-2 transition-colors ${
                      activeFilter === tab
                        ? 'text-slate-800 border-b-2 border-slate-800'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">TYPE</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">SERVICE · ACTION</th>
                    <th className="text-right py-2 px-3 font-semibold text-slate-700">SAVING</th>
                    <th className="text-center py-2 px-3 font-semibold text-slate-700">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-3"><TypeBadge type={row.type} /></td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{row.service}</div>
                        <div className="text-xs text-slate-500 mt-1">{row.action}</div>
                        {row.chip && (
                          <div className="inline-block mt-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">{row.chip} chip</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-800"><Money value={row.saving} /></td>
                      <td className="py-3 px-3 text-center">
                        <button className="px-3 py-1 text-sm bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg font-medium transition-colors">Apply ↗</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-[60%_40%] gap-4">
          <div className="bg-white/90 rounded-xl border border-slate-100 p-5 shadow-md shadow-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">12-Month Savings Ledger</h2>
              <button className="text-sm text-slate-600 hover:text-slate-800 font-medium">Export ↗</button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '12px' }} label={{ value: '$0-140K', angle: -90, position: 'insideLeft' }} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '12px' }} label={{ value: '$0-20K', angle: 90, position: 'insideRight' }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }} formatter={(value) => `$${(value / 1000).toFixed(1)}K`} />
                <Legend />
                <ReBar yAxisId="left" dataKey="monthly" fill="#bfdbfe" radius={[8, 8, 0, 0]} name="Monthly applied" />
                <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#10b981" dot={{ fill: '#10b981', r: 4 }} strokeWidth={2} name="Cumulative" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <div className="bg-white/90 rounded-xl border border-slate-100 p-5 shadow-md shadow-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-800">Peer Benchmarks</h3>
                <button className="text-xs text-slate-500 hover:text-slate-700">Anonymized · opt out</button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Committed use discounts', you: 82, avg: 63, top: 94 },
                  { label: 'Spot / preemptible', you: 58, avg: 49, top: 87 },
                  { label: 'Sustained use discounts', you: 71, avg: 67, top: 91 },
                ].map((bench, idx) => (
                  <div key={idx}>
                    <div className="text-xs font-medium text-slate-700 mb-2">{bench.label}</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${bench.you}%` }} />
                        </div>
                        <span className="text-xs text-slate-600 font-medium w-8">You {bench.you}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-300 opacity-60" style={{ width: `${bench.avg}%` }} />
                        </div>
                        <span className="text-xs text-slate-600 font-medium w-8">Avg {bench.avg}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-200 opacity-40" style={{ width: `${bench.top}%` }} />
                        </div>
                        <span className="text-xs text-slate-600 font-medium w-8">Top {bench.top}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/90 rounded-xl border border-slate-100 p-5 shadow-md shadow-slate-200">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Optimization History</h3>
              <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="text-xs text-slate-500">Avg per action</div>
                  <div className="text-lg font-bold text-slate-800"><Money value="$3,354" /></div>
                  <div className="text-xs text-slate-400">across 40 total</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Pending value</div>
                  <div className="text-lg font-bold text-emerald-600"><Money value="$25,970" /></div>
                  <div className="text-xs text-slate-400">14 open recs</div>
                </div>
              </div>
              <div className="space-y-2">
                {monthlyApplied.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-600 w-8">{item.month}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: `${(item.value / 11300) * 100}%` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-800 w-14 text-right"><Money value={`$${(item.value / 1000).toFixed(1)}K`} /></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-[DM Sans]" style={{ backgroundImage: 'radial-gradient(circle at top left, rgba(16,185,129,0.12), transparent 28%), linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        `}</style>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-100 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-60'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className={`p-4 flex items-center ${collapsed ? 'flex-col gap-3 justify-center' : 'justify-between'}`}>
            <div className="flex items-center gap-2">
              <div className={`${collapsed ? 'w-12 h-12' : 'w-8 h-8'} rounded-xl bg-emerald-50 flex items-center justify-center`}>
                <svg
                  width={collapsed ? '28' : '18'}
                  height={collapsed ? '28' : '18'}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 19C5.567 19 4 17.433 4 15.5C4 13.73 5.315 12.262 7.02 12.036C7.26 9.293 9.584 7.2 12.4 7.2C15.381 7.2 17.8 9.618 17.8 12.6C17.8 12.86 17.78 13.118 17.741 13.367C18.975 13.78 20 14.926 20 16.25C20 17.768 18.768 19 17.25 19H7.5Z"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {!collapsed && <div className="font-bold text-slate-800">FinOps Hub</div>}
            </div>

            <button
              onClick={() => setCollapsed((v) => !v)}
              className={`${collapsed ? 'h-9 w-9' : 'p-1'} flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-800`}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          <nav className={`${collapsed ? 'px-3' : 'px-2'} flex-1`}>
            <div className={collapsed ? 'space-y-3' : 'space-y-1'}>
              {sidebarNav.map((item) => {
                const Icon = item.icon
                const active = activeNav === item.key
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveNav(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                      active
                        ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500'
                        : 'text-slate-500 hover:bg-slate-50'
                    } ${collapsed ? 'h-12 px-0 justify-center border-l-0 rounded-2xl' : ''}`}
                  >
                    <Icon className={collapsed ? 'w-7 h-7' : 'w-5 h-5'} />
                    {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </button>
                )
              })}
            </div>
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold">
                SC
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-800">Sarah Chen</div>
                  <div className="text-xs text-slate-500">FinOps Lead</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-60'} overflow-y-auto`}>
        <div className="p-6 gap-6 flex flex-col">
          <div className="rounded-3xl bg-white/80 border border-white/70 p-6 shadow-xl shadow-slate-200 backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  {activeSection.title}
                </div>
                <h1 className="mt-4 text-3xl font-semibold text-slate-900">{activeSection.title}</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">{activeSection.desc}</p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                <Sparkles className="w-4 h-4" />
                Fresh insights
              </button>
            </div>
          </div>
          {renderSectionContent()}
        </div>
      </main>
    </div>
  )
}
