import { useEffect, useState } from 'react'
import { FileText, Clock, Trash2, Edit, Send, RefreshCw } from 'lucide-react'
import { getDrafts, deleteDraft } from '../services/api'

const statusColors = {
  draft: 'bg-yellow-500/15 text-yellow-400',
  in_review: 'bg-blue-500/15 text-blue-400',
  ready: 'bg-green-500/15 text-green-400',
  published: 'bg-violet-500/15 text-violet-400',
}

const statusLabels = {
  draft: 'Draft',
  in_review: 'In Review',
  ready: 'Ready',
  published: 'Published',
}

export default function Drafts() {
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)
  const [backendOnline, setBackendOnline] = useState(null)

  async function loadDrafts() {
    setLoading(true)
    try {
      const data = await getDrafts()
      setDrafts(data)
      setBackendOnline(true)
    } catch {
      setBackendOnline(false)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this draft?')) return
    try {
      await deleteDraft(id)
      setDrafts(prev => prev.filter(d => d._id !== id))
    } catch {
      alert('Failed to delete draft')
    }
  }

  useEffect(() => { loadDrafts() }, [])

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Drafts</h2>
          <p className="text-sm text-gray-400 mt-0.5">Cluster pages saved but not yet published</p>
        </div>
        <div className="flex items-center gap-3">
          {backendOnline !== null && (
            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${backendOnline ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-green-400' : 'bg-red-400'}`} />
              {backendOnline ? 'Backend online' : 'Backend offline'}
            </span>
          )}
          <button onClick={loadDrafts} className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1.5 rounded-full">
            {loading ? '…' : `${drafts.length} drafts`}
          </span>
        </div>
      </div>

      {!loading && !backendOnline ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-900 border border-gray-800 rounded-xl gap-3">
          <p className="text-sm text-gray-400">Backend not connected</p>
          <p className="text-xs text-gray-600">Start the server and configure your .env to manage drafts</p>
        </div>
      ) : !loading && drafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-900 border border-gray-800 rounded-xl gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
            <FileText size={20} className="text-gray-500" />
          </div>
          <p className="text-sm text-gray-400">No drafts yet</p>
          <p className="text-xs text-gray-600">Create a cluster page and save it as a draft</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-500">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium">Template</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Updated</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-gray-800/60">
                    {Array(6).fill(0).map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-gray-800 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
                : drafts.map(draft => (
                  <tr key={draft._id} className="border-b border-gray-800/60 last:border-0 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-gray-200 font-medium">{draft.title}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{draft.slug || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">{draft.template}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[draft.status] || 'bg-gray-700 text-gray-400'}`}>
                        {statusLabels[draft.status] || draft.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs flex items-center gap-1.5">
                      <Clock size={12} />
                      {new Date(draft.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-gray-500 hover:text-gray-200 hover:bg-gray-700 rounded-md transition-colors" title="Edit">
                          <Edit size={14} />
                        </button>
                        <button disabled className="p-1.5 text-gray-600 cursor-not-allowed rounded-md" title="Publish (coming soon)">
                          <Send size={14} />
                        </button>
                        <button onClick={() => handleDelete(draft._id)} className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
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
