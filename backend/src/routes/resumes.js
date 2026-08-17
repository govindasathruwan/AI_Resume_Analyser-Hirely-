const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  uploadResume, getResumes, getResumeById, deleteResume, downloadResume,
} = require('../controllers/resumeController');

const router = express.Router();

router.use(auth);

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);
router.get('/:id/download', downloadResume);

module.exports = router;
