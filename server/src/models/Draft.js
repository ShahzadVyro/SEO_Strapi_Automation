const mongoose = require('mongoose');

const draftSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String },
    template: { type: String, required: true },
    fields: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ['draft', 'in_review', 'ready', 'published'],
      default: 'draft',
    },
    createdBy: { type: String, default: 'unknown' },
    strapiId: { type: Number, default: null },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Draft', draftSchema);
