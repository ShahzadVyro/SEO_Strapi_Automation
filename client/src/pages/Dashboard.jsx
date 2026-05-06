import { FileText, CheckCircle, Clock, AlertCircle, TrendingUp, FilePlus } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'Total Cluster Pages', value: '—', icon: FileText, color: 'text-violet-400', bg: 'bg-violet-600/10' },
  { label: 'Published', value: '—', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-600/10' },
  { label: 'Drafts', value: '—', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-600/10' },
  { label: 'Needs Review', value: '—', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-600/10' },
]

const templates = [
  { id: 'template-7', label: 'Template 7', desc: 'Text-to-image cluster pages', badge: 'Active' },
  { id: 'video-template-1', label: 'Video Template 1', desc: 'Video generation cluster pages', badge: 'Active' },
  { id: 'music-template-1', label: 'Music Template 1', desc: 'Music generation cluster pages', badge: 'Soon' },
  { id: 'shorts-template-1', label: 'Shorts Template 1', desc: 'Shorts cluster pages', badge: 'Soon' },
  { id: 'ideate-template-1', label: 'Ideate Template 1', desc: 'Ideate cluster pages', badge: 'Soon' },
]

const recentActivity = [
  { slug: 'ai-image-generator', template: 'Template 7', status: 'Published', time: '—' },
  { slug: 'video-creator-tool', template: 'Video Template 1', status: 'Draft', time: '—' },
  { slug: 'anime-art-generator', template: 'Template 7', status: 'Published', time: '—' },
]

const statusColors = {
  Published: 'bg-green-500/15 text-green-400',
  Draft: 'bg-yellow-500/15 text-yellow-400',
  Review: 'bg-blue-500/15 text-blue-400',
}

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Overview</h2>
          <p className="text-sm text-gray-400 mt-0.5">Manage and publish Strapi cluster pages for imagine.art</p>
        </div>
        <Link
          to="/create"
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <FilePlus size={15} />
          New Cluster Page
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
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
            {templates.map(t => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div>
                  <p className="text-sm text-gray-200">{t.label}</p>
                  <p className="text-xs text-gray-500">{t.desc}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  t.badge === 'Active'
                    ? 'bg-green-500/15 text-green-400'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {t.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-800">
                <th className="text-left pb-2 font-medium">Slug</th>
                <th className="text-left pb-2 font-medium">Template</th>
                <th className="text-left pb-2 font-medium">Status</th>
                <th className="text-left pb-2 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map(row => (
                <tr key={row.slug} className="border-b border-gray-800/60 last:border-0">
                  <td className="py-2.5 text-gray-300 font-mono text-xs">{row.slug}</td>
                  <td className="py-2.5 text-gray-400">{row.template}</td>
                  <td className="py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[row.status] || 'bg-gray-700 text-gray-400'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-gray-500">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-600 mt-3">Live data will appear once the backend is connected.</p>
        </div>
      </div>
    </div>
  )
}
