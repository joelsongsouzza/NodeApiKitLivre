const knex = require('../database')
const schemaName = `${process.env.DB_SCHEMA}`

module.exports = {
  async index(req, res, next) {
    try{      
      const {numero_serie_bateria} = req.query
      const {campo} = req.body
      const query = knex('Bateria').withSchema(schemaName) 
      if (numero_serie_bateria){
        query.where('numero_serie_bateria',numero_serie_bateria)
      }
      if (campo){
        query.select(campo)
      }
      const results = await query
      res.json(results)
    }
    catch(error){
      next(error)
    }
  },
  async create(req, res, next) {
    try{
      await knex('Bateria').withSchema(schemaName).insert(
      {
        numero_serie_bateria: req.body.numero_serie_bateria,
        bateria_status: req.body.bateria_status.toUpperCase(),
        carga: req.body.carga,
      
      })
      return res.status(201).send()
    } catch (error){
      next(error)
    }
  },
  async indexSerie(req, res, next) {
    try {
      const results = await knex('Bateria')
                            .withSchema(schemaName)
                            .leftJoin('Locacao','Bateria.numero_serie_bateria','Locacao.numero_serie_bateria')
                            .where('Bateria.bateria_status','EM FUNCIONAMENTO')
                            .andWhere('Bateria.carga', '>', 80)
                            .andWhere(function () {
                              this.orWhere({'Locacao.ativo':'1',})
                              .orWhereNull('Locacao.numero_serie_bateria')})
                            .select('Bateria.numero_serie_bateria') 
                          //  .select('Bateria.RFID_bateria') 
      res.json(results)
    } catch (error) {
      next(error)
    }
  },
  async indexSerieEstoque(req, res, next) {
    try {
      const results = await knex('Bateria')
                            .withSchema(schemaName)
                            .leftJoin('Estoque','Bateria.numero_serie_bateria','Estoque.numero_serie_bateria')
                            .where('Bateria.bateria_status','EM FUNCIONAMENTO')
                            .andWhere('Bateria.carga', '>', 80)
                            .andWhere(function () {
                              this.orWhere(knex.raw('Estoque.ativo <> ?', [1]))
                              .orWhereNull('Estoque.ativo')})
                            .select('Bateria.numero_serie_bateria') 
                          //  .select('Bateria.RFID_bateria') 
      res.json(results)
      return res.send()
    } catch (error) {
      next(error)
    }
  },
  async update(req, res, next) {
    try {
      await knex('Bateria').withSchema(schemaName)
      .update({
        bateria_status: req.body.bateria_status,
        carga: req.body.carga
      })
      .where({ numero_serie_bateria: req.body.numero_serie_bateria })
      return res.send()
    } catch (error) {
        next(error)
    }
  },
  async indexInativo(req, res, next) {
    try{
      const query = knex('Bateria').withSchema(schemaName)
      query.select('numero_serie_bateria')
      query.select('bateria_status')
      query.whereNot('status','EM FUNCIONAMENTO')          
      const results = await query
      res.json(results)
      return res.send()
    }
    catch (error){
      next(error)
    }
  },
  async indexManutencao(req, res, next) {
    try{
      const query = knex('Bateria').withSchema(schemaName)
      query.select('numero_serie_bateria')
      query.select('bateria_status')
      query.where('status','EM MANUTENÇÃO')          
      const results = await query
      res.json(results)
      return res.send()
    }
    catch (error){
      next(error)
    }
  }
}