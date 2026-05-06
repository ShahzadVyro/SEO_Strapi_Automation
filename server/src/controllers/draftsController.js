const Draft = require('../models/Draft');
const PublishLog = require('../models/PublishLog');

// GET /api/drafts
async function getDrafts(req, res) {
  const { status, template } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (template) filter.template = template;
  const drafts = await Draft.find(filter).sort({ updatedAt: -1 });
  res.json(drafts);
}

// GET /api/drafts/:id
async function getDraft(req, res) {
  const draft = await Draft.findById(req.params.id);
  if (!draft) return res.status(404).json({ error: 'Draft not found' });
  res.json(draft);
}

// POST /api/drafts
async function createDraft(req, res) {
  const { title, slug, template, fields, createdBy } = req.body;
  if (!title || !template) return res.status(400).json({ error: 'title and template are required' });
  const draft = await Draft.create({ title, slug, template, fields, createdBy });
  res.status(201).json(draft);
}

// PUT /api/drafts/:id
async function updateDraft(req, res) {
  const draft = await Draft.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
  if (!draft) return res.status(404).json({ error: 'Draft not found' });
  res.json(draft);
}

// DELETE /api/drafts/:id
async function deleteDraft(req, res) {
  const draft = await Draft.findByIdAndDelete(req.params.id);
  if (!draft) return res.status(404).json({ error: 'Draft not found' });
  res.json({ success: true });
}

// GET /api/drafts/publish-log
async function getPublishLog(req, res) {
  const { page = 1, limit = 50 } = req.query;
  const logs = await PublishLog.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await PublishLog.countDocuments();
  res.json({ logs, total, page: Number(page) });
}

module.exports = { getDrafts, getDraft, createDraft, updateDraft, deleteDraft, getPublishLog };
