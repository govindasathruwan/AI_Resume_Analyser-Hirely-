const express = require('express');
const auth = require('../middleware/auth');
const {
  createAnalysis, getAnalyses, getAnalysisById, deleteAnalysis,
  getStats, getPublicStats, downloadAnalysisPdf, generateCoverLetterHandler,
} = require('../controllers/analysisController');

const router = express.Router();

// Public real-time statistics route (unauthenticated)
router.get('/public-stats', getPublicStats);

// Protected routes (authentication required)
router.use(auth);

router.post('/', createAnalysis);
router.get('/', getAnalyses);
router.get('/stats/overview', getStats);
router.get('/:id', getAnalysisById);
router.get('/:id/pdf', downloadAnalysisPdf);
router.delete('/:id', deleteAnalysis);
router.post('/cover-letter', generateCoverLetterHandler);

module.exports = router;
