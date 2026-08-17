const path = require('path');
const fs = require('fs');
const { Resume } = require('../models');
const { extractTextFromPDF } = require('../services/pdfService');

// POST /api/resumes/upload
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Count existing resumes for version number
    const existingCount = await Resume.count({ where: { user_id: req.user.id } });
    const version = existingCount + 1;

    // Extract text from PDF
    let extractedText = '';
    try {
      extractedText = await extractTextFromPDF(req.file.path);
    } catch (e) {
      console.warn('Could not extract text from PDF:', e.message);
    }

    const resume = await Resume.create({
      user_id: req.user.id,
      filename: req.file.filename,
      original_name: req.file.originalname,
      file_path: req.file.path,
      file_size: req.file.size,
      version,
      extracted_text: extractedText,
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully.',
      resume,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Server error uploading resume.' });
  }
};

// GET /api/resumes
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.findAll({
      where: { user_id: req.user.id, is_active: true },
      order: [['created_at', 'DESC']],
    });
    res.json({ success: true, resumes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching resumes.' });
  }
};

// GET /api/resumes/:id
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/resumes/:id
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    // Delete file from disk
    if (fs.existsSync(resume.file_path)) {
      fs.unlinkSync(resume.file_path);
    }

    await resume.destroy();
    res.json({ success: true, message: 'Resume deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error deleting resume.' });
  }
};

// GET /api/resumes/:id/download
const downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }
    if (!fs.existsSync(resume.file_path)) {
      return res.status(404).json({ success: false, message: 'File not found on server.' });
    }
    res.download(resume.file_path, resume.original_name);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error downloading resume.' });
  }
};

module.exports = { uploadResume, getResumes, getResumeById, deleteResume, downloadResume };
