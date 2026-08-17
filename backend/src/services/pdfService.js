const pdfParse = require('pdf-parse');
const fs = require('fs');
const { jsPDF } = require('jspdf');

const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    try {
      const data = await pdfParse(dataBuffer);
      if (data.text && data.text.trim().length > 10) {
        return data.text.trim();
      }
    } catch (e) {
      console.warn('pdf-parse primary extraction failed, using raw stream text parser:', e.message);
    }

    // Fallback: Extract plain text strings directly from binary buffer
    const rawBufferText = fs.readFileSync(filePath, 'utf8');
    const matches = rawBufferText.match(/[a-zA-Z0-9\s.,@+\-]{4,}/g) || [];
    const extracted = matches.join(' ').replace(/\s+/g, ' ').trim();
    return extracted.length > 20 ? extracted : 'Candidate Resume Content';
  } catch (error) {
    console.error('PDF parsing error:', error);
    return 'Candidate Resume Content';
  }
};

const generatePDFReportBuffer = (analysis, user) => {
  const doc = new jsPDF();
  const report = analysis.full_report || {};
  let currentY = 15;

  const checkPageOverflow = (neededHeight = 20) => {
    if (currentY + neededHeight > 275) {
      doc.addPage();
      currentY = 20;
      // Add subtle header to new page
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 145);
      doc.text('ResumeAI - ATS Evaluation Report (Continued)', 14, 12);
      doc.setLineWidth(0.3);
      doc.setDrawColor(220, 220, 225);
      doc.line(14, 14, 196, 14);
    }
  };

  // ── Header Banner ─────────────────────────────────────────────────────────────
  doc.setFillColor(15, 23, 42); // Navy Blue
  doc.rect(0, 0, 210, 36, 'F');

  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Hirely — ATS Diagnostic Report', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  const dateStr = analysis.created_at ? new Date(analysis.created_at).toLocaleDateString() : 'Today';
  doc.text(`Candidate: ${user.name || 'User'}   |   Resume: ${analysis.resume?.original_name || 'Resume'}   |   Date: ${dateStr}`, 14, 28);

  currentY = 46;

  // ── Executive Score Summary Cards ──────────────────────────────────────────────
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Performance Scores & Grade', 14, currentY);
  currentY += 8;

  const atsScore = Math.round(analysis.ats_score || report.ats_score || 0);
  const resumeScore = Math.round(analysis.resume_score || report.resume_score || 0);
  const readabilityScore = Math.round(analysis.readability_score || report.readability_score || 0);
  const matchScore = (analysis.match_score != null || report.match_score != null)
    ? Math.round(analysis.match_score ?? report.match_score)
    : null;

  const grade = report.grade || (atsScore >= 90 ? 'A+' : atsScore >= 80 ? 'A' : atsScore >= 70 ? 'B' : atsScore >= 60 ? 'C' : 'D');

  // Draw 4 score boxes
  const boxes = [
    { label: 'ATS Score', value: `${atsScore} / 100`, color: atsScore >= 70 ? [52, 199, 89] : [239, 68, 68] },
    { label: 'Resume Score', value: `${resumeScore} / 100`, color: [0, 113, 227] },
    { label: 'Readability', value: `${readabilityScore} / 100`, color: [147, 51, 234] },
    { label: 'ATS Grade', value: grade, color: [0, 113, 227] },
  ];

  if (matchScore !== null) {
    boxes[3] = { label: 'Job Match', value: `${matchScore}%`, color: matchScore >= 70 ? [52, 199, 89] : [239, 68, 68] };
  }

  boxes.forEach((box, i) => {
    const x = 14 + (i * 46);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, currentY, 42, 22, 3, 3, 'FD');

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(box.label, x + 4, currentY + 7);

    doc.setFontSize(12);
    doc.setTextColor(box.color[0], box.color[1], box.color[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(box.value, x + 4, currentY + 17);
  });

  currentY += 30;

  // ── Executive Summary ─────────────────────────────────────────────────────────
  checkPageOverflow(30);
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', 14, currentY);
  currentY += 6;

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const summaryLines = doc.splitTextToSize(report.summary || 'Resume evaluated for ATS compatibility and alignment.', 180);
  const summaryBoxHeight = (summaryLines.length * 4.5) + 6;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, 182, summaryBoxHeight, 3, 3, 'FD');

  doc.text(summaryLines, 18, currentY + 6);
  currentY += summaryBoxHeight + 10;

  // ── Strengths & Weaknesses ───────────────────────────────────────────────────
  checkPageOverflow(40);
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Audit Findings', 14, currentY);
  currentY += 8;

  // Left Column: Strengths
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129);
  doc.setFont('helvetica', 'bold');
  doc.text('Core Strengths', 14, currentY);

  // Right Column: Weaknesses
  doc.setTextColor(239, 68, 68);
  doc.text('Areas to Improve', 106, currentY);

  currentY += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const strengths = report.strengths || [];
  const weaknesses = report.weaknesses || [];
  const maxItems = Math.max(strengths.length, weaknesses.length, 1);

  for (let i = 0; i < Math.min(maxItems, 6); i++) {
    checkPageOverflow(10);
    if (strengths[i]) {
      doc.setTextColor(16, 185, 129);
      doc.text('+', 14, currentY);
      doc.setTextColor(51, 65, 85);
      const strLines = doc.splitTextToSize(strengths[i], 80);
      doc.text(strLines, 19, currentY);
    }

    if (weaknesses[i]) {
      doc.setTextColor(239, 68, 68);
      doc.text('-', 106, currentY);
      doc.setTextColor(51, 65, 85);
      const weakLines = doc.splitTextToSize(weaknesses[i], 80);
      doc.text(weakLines, 111, currentY);
    }
    currentY += 8;
  }

  currentY += 6;

  // ── Recommended Bullet Rewrites ──────────────────────────────────────────────
  if (report.bullet_rewrites && report.bullet_rewrites.length > 0) {
    checkPageOverflow(40);
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommended Bullet Point Rewrites', 14, currentY);
    currentY += 8;

    report.bullet_rewrites.slice(0, 3).forEach((rewrite) => {
      checkPageOverflow(30);

      // Before
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(254, 202, 202);
      doc.roundedRect(14, currentY, 182, 12, 2, 2, 'FD');
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(220, 38, 38);
      doc.text('Before:', 18, currentY + 8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(127, 29, 29);
      const beforeText = doc.splitTextToSize(`"${rewrite.before}"`, 160)[0];
      doc.text(beforeText, 32, currentY + 8);
      currentY += 14;

      // After
      doc.setFillColor(236, 253, 245);
      doc.setDrawColor(167, 243, 208);
      doc.roundedRect(14, currentY, 182, 12, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(5, 150, 105);
      doc.text('Optimized:', 18, currentY + 8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(6, 78, 59);
      const afterText = doc.splitTextToSize(`"${rewrite.after}"`, 155)[0];
      doc.text(afterText, 36, currentY + 8);
      currentY += 16;
    });
  }

  // ── Missing Technical Skills ─────────────────────────────────────────────────
  if ((report.missing_technical_skills && report.missing_technical_skills.length > 0) || (report.missing_soft_skills && report.missing_soft_skills.length > 0)) {
    checkPageOverflow(30);
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('Identified Skill Gaps', 14, currentY);
    currentY += 8;

    if (report.missing_technical_skills && report.missing_technical_skills.length > 0) {
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text('Technical Skills to Add:', 14, currentY);
      currentY += 5;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const techList = report.missing_technical_skills.slice(0, 10).join('  |  ');
      doc.text(techList, 14, currentY);
      currentY += 8;
    }
  }

  // ── Footer ───────────────────────────────────────────────────────────────────
  const pageCount = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by Hirely — AI Resume & ATS Analyser', 14, 287);
    doc.text(`Page ${p} of ${pageCount}`, 180, 287);
  }

  return Buffer.from(doc.output('arraybuffer'));
};

module.exports = { extractTextFromPDF, generatePDFReportBuffer };
