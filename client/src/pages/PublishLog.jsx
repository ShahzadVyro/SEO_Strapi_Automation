import { useEffect, useState } from 'react'
import { BookOpen, CheckCircle, XCircle, Search, RefreshCw } from 'lucide-react'
import { getPublishLog } from '../services/api'

const statusColors = {
  success: 'bg-green-500/15 text-green-400',
  failed: 'bg-red-500/15 text-red-400',
}

export default function PublishLog() {
  const [logs, setLogs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [backendOnline, setBackendOnline] = useState(null)
  const [search, setSearch] = useState('')

  async function loadLogs() {
    setLoading(true)
    try {
      const data = await getPublishLog(1)
      setLogs(data.logs || [])
      setTotal(data.total || 0)
      setBackendOnline(true)
    } catch {
      setBackendOnline(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadLogs() }, [])

  const filtered = logs.filter(
    r => r.slug?.includes(search.toLowerCase()) || r.template?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Publish Log</h2>
          <p className="text-sm text-gray-400 mt-0.5">History of all cluster pages published to Strapi</p>
        </div>
        <div className="flex items-center gap-3">
          {backendOnline !== null && (
            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${backendOnline ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-green-400' : 'bg-red-400'}`} />
              {backendOnline ? 'Backend online' : 'Backend offline'}
            </span>
          )}
          <button onClick={loadLogs} className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search slug or template..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition w-56"
            />
          </div>
        </div>
      </div>

      {!loading && !backendOnline ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-900 border border-gray-800 rounded-xl gap-3">
          <p className="text-sm text-gray-400">Backend not connected</p>
          <p className="text-xs text-gray-600">Start the server to see publish history</p>
        </div>
      ) : !loading && filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-900 border border-gray-800 rounded-xl gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
            <BookOpen size={20} className="text-gray-500" />
          </div>
          <p className="text-sm text-gray-400">No publish records found</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-500">{loading ? '…' : `${total} total records`}</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-500">
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium">Template</th>
                <th className="text-left px-4 py-3 font-medium">Published By</th>
                <th className="text-left px-4 py-3 font-medium">Strapi ID</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Published At</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(4).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-gray-800/60">
                    {Array(6).fill(0).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-gray-800 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
                : filtered.map(row => (
                  <tr key={row._id} className="border-b border-gray-800/60 last:border-0 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-gray-300 font-mono text-xs">{row.slug}</td>
                    <td className="px-4 py-3 text-gray-400">{row.template}</td>
                    <td className="px-4 py-3 text-gray-400">{row.publishedBy}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{row.strapiId ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${statusColors[row.status] || 'bg-gray-700 text-gray-400'}`}>
                        {row.status === 'success' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
