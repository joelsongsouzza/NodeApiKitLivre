module.exports = {
  development: {
    client: 'mssql',
    connection: {
      host : process.env.DB_SERVER,
      user : process.env.DB_USER,
      password : process.env.DB_PWD,
      database : process.env.DB_NAME
    },
    migrations:{
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/database/migrations`
    },
    seeds:{
      directory: `${__dirname}/src/database/seeds`
    }
  }
};
