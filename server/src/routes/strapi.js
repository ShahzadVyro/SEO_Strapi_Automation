const express = require('express');
const multer = require('multer');
const asyncHandler = require('../middleware/asyncHandler');
const { getRelations, uploadMedia, publishCluster, getClusterPages } = require('../controllers/strapiController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.get('/relations', asyncHandler(getRelations));
router.get('/cluster-pages', asyncHandler(getClusterPages));
router.post('/upload', upload.single('file'), asyncHandler(uploadMedia));
router.post('/publish', asyncHandler(publishCluster));

module.exports = router;
