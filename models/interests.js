'use strict';

module.exports = (sequelize, DataTypes) => {
  const Interests = sequelize.define('Interests', {
    interest: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      },
    },
    interestCategory: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    }
  });

  return Interests;
}
