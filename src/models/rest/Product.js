const product = (sequelize, DataTypes) => {
    const product = sequelize.define('product', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
            },
            title: {
                type: DataTypes.TEXT,
            },
            description: {
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

    product.associate = function(models) {
        models.product.belongsTo(models.user, {as: 'user', foreignKey: 'user_id'})
    }
    
    // post.sync();
    return product;
};

export default product