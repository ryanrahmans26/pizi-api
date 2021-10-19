const user = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING,
                unique: true
            },
            password: {
                type: DataTypes.STRING
            },
            token: {
                type: DataTypes.STRING
            },

        },
        {
            timestamps: true,
            freezeTableName: true
        }
    );

    user.associate = function(models) {
        models.user.hasMany(models.post, {as: 'user', foreignKey: 'user_id'})
    }

    user.sync();
    return user;
};

export default user