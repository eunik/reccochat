'use strict';

const bcrypt = require('bcrypt-nodejs');
// sudo -u  postgres psql
// TRUNCATE "Users" RESTART IDENTITY CASCADE;
module.exports = (sequelize, DataTypes) => {
  var Users = sequelize.define('Users', {
    username: {
      type:DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true
      }
    },
    password: DataTypes.STRING
  });

  Users.beforeCreate((user) =>
    new sequelize.Promise((resolve) => {
      bcrypt.hash(user.password, null, null, (err, hashedPassword) => {
        resolve(hashedPassword);
      });
    }).then((hashedPassword) => {
      user.password = hashedPassword;
    })
  );
  return Users;
};
