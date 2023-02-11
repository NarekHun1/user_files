module.exports = (sequelize, Sequelize) => {
    return sequelize.define("files", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        size: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        originalName: {
            type: Sequelize.STRING
        },
        mimeType: {
            type: Sequelize.STRING
        },
       extension: {
            type: Sequelize.STRING
        },
        createdAt: {
          type: Sequelize.DATE
        }
    });
};
