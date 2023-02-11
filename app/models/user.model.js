module.exports = (sequelize, Sequelize) => {
  return sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    identifier: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING
    },
    accessToken: {
      type: Sequelize.STRING
    },
    refreshToken: {
      type: Sequelize.STRING
    },

  });
};
