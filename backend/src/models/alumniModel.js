const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel");

const Alumni = sequelize.define("Alumni", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  graduation_year: { type: DataTypes.INTEGER, allowNull: false },
  branch: { type: DataTypes.STRING, allowNull: false },
  linkedin_url: { type: DataTypes.STRING },
  industry: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  current_company: { type: DataTypes.STRING },
  current_role: { type: DataTypes.STRING },
  skills: { type: DataTypes.JSONB, defaultValue: [] },
  areas_of_expertise: { type: DataTypes.JSONB, defaultValue: [] },
  education: { type: DataTypes.JSONB, defaultValue: [] },
  career_path: { type: DataTypes.JSONB, defaultValue: [] },
  achievements: { type: DataTypes.JSONB, defaultValue: [] },
  projects: { type: DataTypes.JSONB, defaultValue: [] },
  description: { type: DataTypes.TEXT },
  profile_completed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

User.hasOne(Alumni, { foreignKey: "user_id", onDelete: "CASCADE" });
Alumni.belongsTo(User, { foreignKey: "user_id" });

module.exports = Alumni;
