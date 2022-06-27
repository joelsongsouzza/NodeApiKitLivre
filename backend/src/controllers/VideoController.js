const knex = require('../database')
const schemaName = `${process.env.DB_SCHEMA}`

module.exports = {
  async index(req, res, next) {
    try{      
      const query = knex('Video').withSchema(schemaName) 
      const results = await query
      res.json(results)
    }
    catch(error){
      next(error)
    }
  }
}