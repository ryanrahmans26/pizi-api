const post = (sequelize, DataTypes) => {
    const post = sequelize.define('post', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
            },
            body: {
                type: DataTypes.TEXT,
            },
            photo: {
                type: DataTypes.STRING,
            }
        },
        {
            timestamps: true,
            freezeTableName: true
        }
    );

    post.associate = function(models) {
        models.post.belongsTo(models.user, {as: 'user', foreignKey: 'user_id'})
    }
    
    // post.sync();
    return post;
};

export default post