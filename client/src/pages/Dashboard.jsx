import { useEffect, useState } from 'react'
import { FileText, CheckCircle, Clock, AlertCircle, TrendingUp, FilePlus, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getClusterPages, getDrafts, getPublishLog } from '../services/api'

const TEMPLATES = [
  { id: 'template-7', label: 'Template 7', desc: 'Text-to-image generation pages', badge: 'Active' },
  { id: 'video-template-1', label: 'Video Template 1', desc: 'Video generation cluster pages', badge: 'Active' },
  { id: 'music-template-1', label: 'Music Template 1', desc: 'Music generation cluster pages', badge: 'Soon' },
  { id: 'shorts-template-1', label: 'Shorts Template 1', desc: 'Shorts cluster pages', badge: 'Soon' },
  { id: 'ideate-template-1', label: 'Ideate Template 1', desc: 'Ideate cluster pages', badge: 'Soon' },
]

const statusColors = {
  Published: 'bg-green-500/15 text-green-400',
  Draft: 'bg-yellow-500/15 text-yellow-400',
  Review: 'bg-blue-500/15 text-blue-400',
  success: 'bg-green-500/15 text-green-400',
  failed: 'bg-red-500/15 text-red-400',
}

export default function Dashboard() {
  const [clusterTotal, setClusterTotal] = useState('—')
  const [draftCount, setDraftCount] = useState('—')
  const [reviewCount, setReviewCount] = useState('—')
  const [recentLogs, setRecentLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [backendOnline, setBackendOnline] = useState(null)

  async function loadData() {
    setLoading(true)
    try {
      const [pages, drafts, inReview, logs] = await Promise.all([
        getClusterPages(1),
        getDrafts({ status: 'draft' }),
        getDrafts({ status: 'in_review' }),
        getPublishLog(1),
      ])
      setClusterTotal(pages?.meta?.pagination?.total ?? '—')
      setDraftCount(drafts?.length ?? '—')
      setReviewCount(inReview?.length ?? '—')
      setRecentLogs(logs?.logs?.slice(0, 5) ?? [])
      setBackendOnline(true)
    } catch {
      setBackendOnline(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const stats = [
    { label: 'Total Cluster Pages', value: clusterTotal, icon: FileText, color: 'text-violet-400', bg: 'bg-violet-600/10' },
    { label: 'Published', value: clusterTotal, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-600/10' },
    { label: 'Drafts', value: draftCount, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-600/10' },
    { label: 'In Review', value: reviewCount, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-600/10' },
  ]

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Overview</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage and publish Strapi cluster pages for imagine.art</p>
        </div>
        <div className="flex items-center gap-3">
          {backendOnline !== null && (
            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${backendOnline ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-green-400' : 'bg-red-400'}`} />
              {backendOnline ? 'Backend online' : 'Backend offline'}
            </span>
          )}
          <button
            onClick={loadData}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/create"
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <FilePlus size={15} />
            New Cluster Page
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{loading ? '…' : value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template types */}
        <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={15} className="text-violet-400" />
            <h3 className="text-sm font-semibold text-white">Template Types</h3>
          </div>
          <div className="space-y-2">
            {TEMPLATES.map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-sm text-gray-200">{t.label}</p>
                  <p className="text-xs text-gray-500">{t.desc}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${t.badge === 'Active' ? 'bg-green-500/15 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                  {t.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent publish log */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Publish Activity</h3>
          {!backendOnline ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">Backend not connected</p>
              <p className="text-xs text-gray-600 mt-1">Start the server and add your .env to see live data</p>
            </div>
          ) : recentLogs.length === 0 && !loading ? (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">No publish activity yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-800">
                  <th className="text-left pb-2 font-medium">Slug</th>
                  <th className="text-left pb-2 font-medium">Template</th>
                  <th className="text-left pb-2 font-medium">Status</th>
                  <th className="text-left pb-2 font-medium">By</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800/60">
                      <td colSpan={4} className="py-3">
                        <div className="h-3 bg-gray-800 rounded animate-pulse w-3/4" />
                      </td>
                    </tr>
                  ))
                  : recentLogs.map(row => (
                    <tr key={row._id} className="border-b border-gray-800/60 last:border-0">
                      <td className="py-2.5 text-gray-300 font-mono text-xs">{row.slug}</td>
                      <td className="py-2.5 text-gray-400">{row.template}</td>
                      <td className="py-2.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[row.status] || 'bg-gray-700 text-gray-400'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-gray-500">{row.publishedBy}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
