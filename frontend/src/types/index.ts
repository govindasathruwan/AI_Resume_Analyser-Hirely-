export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  job_title?: string;
  bio?: string;
  created_at: string;
}

export interface Resume {
  id: number;
  user_id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  version: number;
  extracted_text?: string;
  parsed_data?: {
    skills?: string[];
    experience?: any[];
    education?: any[];
  };
  is_active: boolean;
  created_at: string;
}

export interface SkillCategory {
  existing: string[];
  missing: string[];
}

export interface SkillGap {
  programming_languages: SkillCategory;
  frameworks: SkillCategory;
  databases: SkillCategory;
  cloud_platforms: SkillCategory;
  tools: SkillCategory;
  soft_skills: SkillCategory;
}

export interface KeywordAnalysis {
  present_keywords: string[];
  missing_keywords: string[];
  overused_words: string[];
  action_verbs: string[];
  technologies: string[];
  industry_terms: string[];
}

export interface AiSuggestion {
  category: string;
  suggestion: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface AtsRisk {
  risk: string;
  severity: 'High' | 'Medium' | 'Low';
  why_it_matters: string;
  fix_action: string;
}

export interface BulletRewrite {
  before: string;
  after: string;
  improvement_reason: string;
}

export interface SectionScoreDetail {
  score: number;
  status: string;
  feedback: string;
}

export interface SectionScores {
  contact_info: SectionScoreDetail;
  work_experience: SectionScoreDetail;
  skills_keywords: SectionScoreDetail;
  formatting_readability: SectionScoreDetail;
  education_credentials: SectionScoreDetail;
}

export interface LearningResource {
  skill: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  resources: string[];
}

export interface JobMatch {
  match_percentage: number;
  missing_keywords: string[];
  missing_skills: string[];
  missing_experience: string[];
  missing_certifications: string[];
  recommended_improvements: string[];
}

export interface FullReport {
  ats_score: number;
  resume_score: number;
  readability_score: number;
  match_score: number | null;
  grade?: string;
  summary: string;
  overall_rating: 'Excellent' | 'Good' | 'Average' | 'Below Average' | 'Poor';
  strengths: string[];
  weaknesses: string[];
  grammar_formatting_suggestions: string[];
  missing_technical_skills: string[];
  missing_soft_skills: string[];
  ai_suggestions: AiSuggestion[];
  ats_risks?: AtsRisk[];
  bullet_rewrites?: BulletRewrite[];
  section_scores?: SectionScores;
  keyword_analysis: KeywordAnalysis;
  skill_gap: SkillGap;
  learning_roadmap: LearningResource[];
  job_match: JobMatch | null;
  contact_info_complete: boolean;
  has_summary: boolean;
  has_education: boolean;
  has_experience: boolean;
  has_skills_section: boolean;
  estimated_experience_years: number;
}

export interface Analysis {
  id: number;
  user_id: number;
  resume_id: number;
  ats_score: number;
  resume_score: number;
  match_score: number | null;
  readability_score: number;
  job_title?: string;
  job_description?: string;
  full_report: FullReport;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  resume?: Resume;
}

export interface Stats {
  totalAnalyses: number;
  latestAtsScore: number;
  latestResumeScore: number;
  latestMatchScore: number | null;
  avgAtsScore: number;
  trend: Array<{ date: string; ats_score: number; resume_score: number }>;
}

export type ScoreColor = 'emerald' | 'blue' | 'yellow' | 'orange' | 'red';
