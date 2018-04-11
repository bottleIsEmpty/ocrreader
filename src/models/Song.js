module.exports = (sequelize, DataTypes) => {
    const Song = sequelize.define('Song', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        singer: DataTypes.STRING,
        year: DataTypes.DATEONLY
    })

    return Song;
}