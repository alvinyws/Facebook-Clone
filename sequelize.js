const Sequelize = require('sequelize');
const UserModel = require('./models/user');
const StoryModel = require('./models/story');

const sequelize = new Sequelize('fb', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        freezeTableName: true
      }
  });


const User = UserModel(sequelize, Sequelize);
const Story = StoryModel(sequelize, Sequelize);


sequelize.sync({ force: true });
console.log("All models were synchronized successfully.");


module.exports = {
  User,
  Story
}