const mongoose = require('mongoose');

const publishLogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    template: { type: String, required: true },
    publishedBy: { type: String, default: 'unknown' },
    strapiId: { type: Number },
    payload: { type: mongoose.Schema.Types.Mixed },
    strapiResponse: { type: mongoose.Schema.Types.Mixed },
    status: { type: String, enum: ['success', 'failed'], required: true },
    errorMessage: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PublishLog', publishLogSchema);
