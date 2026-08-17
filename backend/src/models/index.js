const User = require('./User');
const Resume = require('./Resume');
const Analysis = require('./Analysis');

// User <-> Resume
User.hasMany(Resume, { foreignKey: 'user_id', as: 'resumes', onDelete: 'CASCADE' });
Resume.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> Analysis
User.hasMany(Analysis, { foreignKey: 'user_id', as: 'analyses', onDelete: 'CASCADE' });
Analysis.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Resume <-> Analysis
Resume.hasMany(Analysis, { foreignKey: 'resume_id', as: 'analyses', onDelete: 'CASCADE' });
Analysis.belongsTo(Resume, { foreignKey: 'resume_id', as: 'resume' });

module.exports = { User, Resume, Analysis };
