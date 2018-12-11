'use strict';

module.exports = (sequelize, DataTypes) => {
  var MatchRelation = sequelize.define('MatchRelation', {
    matchPercentage: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true
      }
    },
    firstUserId: {
      type: DataTypes.INTEGER,
      references: {
        // This is a reference to another model
        model: 'Users',
       // This is the column name of the referenced model
        key: 'id',
       // This declares when to check the foreign key constraint. PostgreSQL only.
        deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
    },
    secondUserId: {
      type: DataTypes.INTEGER,
      references: {
        // This is a reference to another model
        model: 'Users',
       // This is the column name of the referenced model
        key: 'id',
       // This declares when to check the foreign key constraint. PostgreSQL only.
        deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
    }
  });

  return MatchRelation;
}
