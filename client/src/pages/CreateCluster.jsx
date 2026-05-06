import { useState } from 'react'
import { ChevronRight, Image, Video, Music, Scissors, Lightbulb, CheckCircle } from 'lucide-react'

const TEMPLATES = [
  {
    id: 'template-7',
    label: 'Template 7',
    desc: 'Text-to-image generation pages',
    icon: Image,
    color: 'violet',
    status: 'active',
    fields: ['Page Title', 'Slug', 'Meta Title', 'Meta Description', 'Author', 'Reviewer', 'Hero Heading', 'Hero Subheading', 'Blog Post', 'Studio'],
  },
  {
    id: 'video-template-1',
    label: 'Video Template 1',
    desc: 'Video generation cluster pages',
    icon: Video,
    color: 'blue',
    status: 'active',
    fields: ['Page Title', 'Slug', 'Meta Title', 'Meta Description', 'Author', 'Reviewer', 'Hero Heading', 'Hero Subheading', 'Blog Post', 'Studio'],
  },
  {
    id: 'music-template-1',
    label: 'Music Template 1',
    desc: 'Music generation cluster pages',
    icon: Music,
    color: 'pink',
    status: 'soon',
    fields: [],
  },
  {
    id: 'shorts-template-1',
    label: 'Shorts Template 1',
    desc: 'Shorts cluster pages',
    icon: Scissors,
    color: 'orange',
    status: 'soon',
    fields: [],
  },
  {
    id: 'ideate-template-1',
    label: 'Ideate Template 1',
    desc: 'Ideate cluster pages',
    icon: Lightbulb,
    color: 'yellow',
    status: 'soon',
    fields: [],
  },
]

const colorMap = {
  violet: { ring: 'ring-violet-500', bg: 'bg-violet-600/10', icon: 'text-violet-400', badge: 'bg-violet-500/15 text-violet-300' },
  blue: { ring: 'ring-blue-500', bg: 'bg-blue-600/10', icon: 'text-blue-400', badge: 'bg-blue-500/15 text-blue-300' },
  pink: { ring: 'ring-pink-500', bg: 'bg-pink-600/10', icon: 'text-pink-400', badge: 'bg-pink-500/15 text-pink-300' },
  orange: { ring: 'ring-orange-500', bg: 'bg-orange-600/10', icon: 'text-orange-400', badge: 'bg-orange-500/15 text-orange-300' },
  yellow: { ring: 'ring-yellow-500', bg: 'bg-yellow-600/10', icon: 'text-yellow-400', badge: 'bg-yellow-500/15 text-yellow-300' },
}

function TemplateForm({ template, onBack }) {
  const [form, setForm] = useState(() =>
    Object.fromEntries(template.fields.map(f => [f, '']))
  )
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center">
          <CheckCircle size={28} className="text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Saved as Draft</h3>
        <p className="text-sm text-gray-400">Backend not connected yet — full publish coming in Phase 2.</p>
        <button
          onClick={() => { setSubmitted(false); onBack() }}
          className="mt-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm text-gray-200 rounded-lg transition-colors"
        >
          Back to templates
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors mb-5"
      >
        ← Back to template selection
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className={`w-9 h-9 rounded-lg ${colorMap[template.color].bg} flex items-center justify-center`}>
          <template.icon size={16} className={colorMap[template.color].icon} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">{template.label}</h3>
          <p className="text-xs text-gray-400">{template.desc}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        {template.fields.map(field => (
          <div key={field}>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">{field}</label>
            {field === 'Meta Description' || field === 'Hero Subheading' ? (
              <textarea
                rows={3}
                value={form[field]}
                onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none transition"
                placeholder={`Enter ${field.toLowerCase()}...`}
              />
            ) : (
              <input
                type="text"
                value={form[field]}
                onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                placeholder={`Enter ${field.toLowerCase()}...`}
              />
            )}
          </div>
        ))}

        {/* Media upload placeholder */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Hero Image / Video</label>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-gray-600 transition-colors cursor-pointer">
            <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
            <p className="text-xs text-gray-600 mt-1">Media upload connects to Strapi in Phase 2</p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled
            className="px-5 py-2 bg-gray-700 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
            title="Backend required for publish"
          >
            Publish to Strapi
          </button>
        </div>
        <p className="text-xs text-gray-600">Publish to Strapi will be enabled once the Node.js backend is connected.</p>
      </form>
    </div>
  )
}

export default function CreateCluster() {
  const [selected, setSelected] = useState(null)

  if (selected) {
    return <TemplateForm template={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="max-w-4xl space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Select a Template</h2>
        <p className="text-sm text-gray-400 mt-0.5">Choose a cluster page template to begin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map(t => {
          const c = colorMap[t.color]
          const isActive = t.status === 'active'
          return (
            <button
              key={t.id}
              onClick={() => isActive && setSelected(t)}
              disabled={!isActive}
              className={`group text-left bg-gray-900 border rounded-xl p-4 transition-all ${
                isActive
                  ? `border-gray-800 hover:border-gray-600 hover:ring-1 ${c.ring} cursor-pointer`
                  : 'border-gray-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>
                <t.icon size={18} className={c.icon} />
              </div>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-white">{t.label}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  isActive ? `${c.badge}` : 'bg-gray-700 text-gray-500'
                }`}>
                  {isActive ? 'Active' : 'Soon'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{t.desc}</p>
              {isActive && (
                <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-gray-300 mt-3 transition-colors">
                  Start <ChevronRight size={12} />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
