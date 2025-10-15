const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AlumniMaster = sequelize.define("AlumniMaster", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  graduation_year: { type: DataTypes.INTEGER, allowNull: false },
  branch: { type: DataTypes.STRING, allowNull: false },
  normalized_name: { type: DataTypes.STRING },
});

module.exports = AlumniMaster;
