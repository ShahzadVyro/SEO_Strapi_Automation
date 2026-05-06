const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const {
  getDrafts,
  getDraft,
  createDraft,
  updateDraft,
  deleteDraft,
  getPublishLog,
} = require('../controllers/draftsController');

const router = express.Router();

router.get('/publish-log', asyncHandler(getPublishLog));
router.get('/', asyncHandler(getDrafts));
router.get('/:id', asyncHandler(getDraft));
router.post('/', asyncHandler(createDraft));
router.put('/:id', asyncHandler(updateDraft));
router.delete('/:id', asyncHandler(deleteDraft));

module.exports = router;
