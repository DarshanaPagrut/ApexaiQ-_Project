const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./userModel");

const Student = sequelize.define("Student", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  college_id: { type: DataTypes.STRING, allowNull: false },
  year_of_study: { type: DataTypes.INTEGER, allowNull: false },
  branch: { type: DataTypes.STRING, allowNull: false },
  linkedin_url: { type: DataTypes.STRING },
  skills: { type: DataTypes.JSONB, defaultValue: [] },
  areas_of_interest: { type: DataTypes.JSONB, defaultValue: [] },
  education: { type: DataTypes.JSONB, defaultValue: [] },
  achievements: { type: DataTypes.JSONB, defaultValue: [] },
  projects: { type: DataTypes.JSONB, defaultValue: [] },
  internships: { type: DataTypes.JSONB, defaultValue: [] },
  co_curricular: { type: DataTypes.JSONB, defaultValue: [] },
  description: { type: DataTypes.TEXT },
  profile_completed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

User.hasOne(Student, { foreignKey: "user_id", onDelete: "CASCADE" });
Student.belongsTo(User, { foreignKey: "user_id" });

module.exports = Student;
