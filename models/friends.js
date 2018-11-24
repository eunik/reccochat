module.exports = (sequelize, DataTypes) => {
  const Friends = sequelize.define('friends', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        // This is a reference to another model
        model: User,
       // This is the column name of the referenced model
        key: 'id',
       // This declares when to check the foreign key constraint. PostgreSQL only.
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
    },
    friendId: {
      type: DataTypes.INTEGER,
      references: {
        // This is a reference to another model
        model: Interests,
       // This is the column name of the referenced model
        key: 'id',
       // This declares when to check the foreign key constraint. PostgreSQL only.
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
    }
    }
  });

  return Friends;
}
