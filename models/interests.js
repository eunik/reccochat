'use strict';

module.exports = (sequelize, DataTypes) => {
  const Interests = sequelize.define('Interests', {
    interest: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isAlphanumeric: true,
      },
    },
    interestCategory: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  });

  return Interests;
}
