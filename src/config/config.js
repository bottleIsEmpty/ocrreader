module.exports = {
    db: {
        database: process.env.DB_NAME || 'radio',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'admin',
        options: {
            dialect: process.env.DIALECT || 'postgres',
            host: process.env.host || 'localhost'
        }
    },

    logger: {
        appenders: {
            console: {
                type: 'console'
            }
        },
        categories: {
            default: {
                appenders: ['console'],
                level: 'all'
            }
        }
    },

    directories: {
        images: 'images'
    }
}