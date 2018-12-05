'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserInterests = sequelize.define('UserInterests', {
    userId: {
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
    interestId: {
      type: DataTypes.INTEGER,
      references: {
        // This is a reference to another model
        model: 'Interests',
       // This is the column name of the referenced model
        key: 'id',
       // This declares when to check the foreign key constraint. PostgreSQL only.
        deferrable: sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
    }
  });

  return UserInterests;
}
