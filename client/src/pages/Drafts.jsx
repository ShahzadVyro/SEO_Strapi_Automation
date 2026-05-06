import { FileText, Clock, Trash2, Edit, Send } from 'lucide-react'

const mockDrafts = [
  {
    id: 1,
    title: 'AI Art Generator for Beginners',
    slug: 'ai-art-generator-beginners',
    template: 'Template 7',
    updatedAt: '—',
    status: 'Draft',
  },
  {
    id: 2,
    title: 'Video Creator Tool Overview',
    slug: 'video-creator-tool-overview',
    template: 'Video Template 1',
    updatedAt: '—',
    status: 'In Review',
  },
]

const statusColors = {
  Draft: 'bg-yellow-500/15 text-yellow-400',
  'In Review': 'bg-blue-500/15 text-blue-400',
  'Ready': 'bg-green-500/15 text-green-400',
}

export default function Drafts() {
  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Drafts</h2>
          <p className="text-sm text-gray-400 mt-0.5">Cluster pages saved but not yet published</p>
        </div>
        <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1.5 rounded-full">
          {mockDrafts.length} drafts
        </span>
      </div>

      {mockDrafts.length === 0 ? (
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
              {mockDrafts.map(draft => (
                <tr key={draft.id} className="border-b border-gray-800/60 last:border-0 hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3 text-gray-200 font-medium">{draft.title}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{draft.slug}</td>
                  <td className="px-4 py-3 text-gray-400">{draft.template}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[draft.status] || 'bg-gray-700 text-gray-400'}`}>
                      {draft.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 flex items-center gap-1.5">
                    <Clock size={12} />
                    {draft.updatedAt}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1.5 text-gray-500 hover:text-gray-200 hover:bg-gray-700 rounded-md transition-colors"
                        title="Edit draft"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        disabled
                        className="p-1.5 text-gray-600 cursor-not-allowed rounded-md"
                        title="Publish (backend required)"
                      >
                        <Send size={14} />
                      </button>
                      <button
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                        title="Delete draft"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-600">
        Draft persistence and publish actions will be enabled once the Node.js + MongoDB backend is connected.
      </p>
    </div>
  )
}
