import { BookOpen, CheckCircle, ExternalLink, Search } from 'lucide-react'
import { useState } from 'react'

const mockLog = [
  {
    id: 1,
    slug: 'ai-image-generator',
    template: 'Template 7',
    publishedBy: 'Shahzad',
    publishedAt: '—',
    strapiId: '—',
    status: 'Success',
  },
  {
    id: 2,
    slug: 'anime-art-generator',
    template: 'Template 7',
    publishedBy: 'Shahzad',
    publishedAt: '—',
    strapiId: '—',
    status: 'Success',
  },
  {
    id: 3,
    slug: 'video-creator-pro',
    template: 'Video Template 1',
    publishedBy: 'Shahzad',
    publishedAt: '—',
    strapiId: '—',
    status: 'Failed',
  },
]

const statusColors = {
  Success: 'bg-green-500/15 text-green-400',
  Failed: 'bg-red-500/15 text-red-400',
  Pending: 'bg-yellow-500/15 text-yellow-400',
}

export default function PublishLog() {
  const [search, setSearch] = useState('')

  const filtered = mockLog.filter(
    r => r.slug.includes(search.toLowerCase()) || r.template.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Publish Log</h2>
          <p className="text-sm text-gray-400 mt-0.5">History of all cluster pages published to Strapi</p>
        </div>
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

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-900 border border-gray-800 rounded-xl gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
            <BookOpen size={20} className="text-gray-500" />
          </div>
          <p className="text-sm text-gray-400">No publish records found</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-500">
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium">Template</th>
                <th className="text-left px-4 py-3 font-medium">Published By</th>
                <th className="text-left px-4 py-3 font-medium">Strapi ID</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Published At</th>
                <th className="text-right px-4 py-3 font-medium">View</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-gray-800/60 last:border-0 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3 text-gray-300 font-mono text-xs">{row.slug}</td>
                  <td className="px-4 py-3 text-gray-400">{row.template}</td>
                  <td className="px-4 py-3 text-gray-400">{row.publishedBy}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{row.strapiId}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${statusColors[row.status] || 'bg-gray-700 text-gray-400'}`}>
                      {row.status === 'Success' && <CheckCircle size={10} />}
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{row.publishedAt}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      disabled
                      className="p-1.5 text-gray-600 cursor-not-allowed rounded-md"
                      title="View on Strapi (backend required)"
                    >
                      <ExternalLink size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-600">
        Live publish history will be stored in MongoDB and appear here once the backend is connected.
      </p>
    </div>
  )
}
