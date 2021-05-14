'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Story extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Story.belongsTo(models.User, {foreignKey: 'user_id', as: 'user'})
    }
  };
  Story.init({
    story: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Story',
  });
  return Story;
};