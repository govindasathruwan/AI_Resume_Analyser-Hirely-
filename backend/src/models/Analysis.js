const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Analysis = sequelize.define('Analysis', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  resume_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ats_score: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  resume_score: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  match_score: {
    type: DataTypes.FLOAT,
    defaultValue: null,
    allowNull: true,
  },
  readability_score: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  job_description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  full_report: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },
}, {
  tableName: 'analyses',
});

module.exports = Analysis;
