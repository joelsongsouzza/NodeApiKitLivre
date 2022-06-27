const knex = require('../database')
const schemaName = `${process.env.DB_SCHEMA}`

module.exports = {
  async index(req, res, next) {
    try{      
      const {numero_serie_equipamento} = req.query
      const {campo} = req.body
      const query = knex('Equipamento').withSchema(schemaName) 
      if (numero_serie_equipamento){
        query.where('numero_serie_equipamento',numero_serie_equipamento)
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
      await knex('Equipamento').withSchema(schemaName).insert({
        numero_serie_equipamento: req.body.numero_serie_equipamento.toUpperCase(),
        equipamento_status: req.body.equipamento_status.toUpperCase(),
        nome: req.body.nome.toUpperCase(),
        foto: req.body.foto,
        foto64: req.body.foto64
      })
      return res.status(201).send()
    }
    catch (error){
      next(error)
    }
  },
  async indexSerie(req, res, next) {
    try {
      const results = await knex('Equipamento')
                            .withSchema(schemaName)
                            .leftJoin('Locacao','Locacao.numero_serie_equipamento','Equipamento.numero_serie_equipamento')
                            .where('Equipamento.equipamento_status','EM FUNCIONAMENTO')
                            .andWhere(function () {
                              this.orWhere({'Locacao.devolvido':'1',})
                              .orWhereNull('Locacao.numero_serie_equipamento')})
                            .select('Equipamento.numero_serie_equipamento') 
      res.json(results)
    } 
    catch (error) {
      next(error)
    }
  },
  async indexSerieEstoque(req, res, next) {
    try {
      const results = await knex('Equipamento')
                            .withSchema(schemaName)
                            .leftJoin('Estoque','Equipamento.numero_serie_equipamento','Estoque.numero_serie_equipamento')
                            .where('Equipamento.equipamento_status','EM FUNCIONAMENTO')
                            .andWhere(function () {
                              this.orWhere(knex.raw('Estoque.ativo <> ?', [1]))
                              .orWhereNull('Estoque.ativo')})
                            .select('Equipamento.numero_serie_equipamento') 
      res.json(results)
    } catch (error) {
      next(error)
    }
  },
  async update(req, res, next) {
    try {
      await knex('Equipamento').withSchema(schemaName)
      .update({
        equipamento_status: req.body.equipamento_status,
        foto64: req.body.foto64
      })
      .where({ numero_serie_equipamento: req.body.numero_serie_equipamento })

      return res.send()

    } catch (error) {
        next(error)
    }
  },
  async indexInativo(req, res, next) {
    try{
      const query = knex('Equipamento').withSchema(schemaName)
      query.select('numero_serie_equipamento')
      query.select('equipamento_status')
      query.whereNot('status','EM FUNCIONAMENTO')          
      const results = await query
      res.json(results)
    }
    catch (error){
      next(error)
    }
  },
  async indexInativo(req, res, next) {
    try{
      const query = knex('Equipamento').withSchema(schemaName)
      query.select('numero_serie_equipamento')
      query.select('equipamento_status')
      query.whereNot('status','EM FUNCIONAMENTO')          
      const results = await query
      res.json(results)
    }
    catch (error){
      next(error)
    }
  },
  async indexManutencao(req, res, next) {
    try{
      const query = knex('Equipamento').withSchema(schemaName)
      query.select('numero_serie_equipamento')
      query.select('equipamento_status')
      query.where('status','EM MANUTENÇÃO')          
      const results = await query
      res.json(results)
    }
    catch (error){
      next(error)
    }
  }
}