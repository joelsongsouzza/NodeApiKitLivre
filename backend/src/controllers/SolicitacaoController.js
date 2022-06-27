const knex = require('../database')
const schemaName = `${process.env.DB_SCHEMA}`

module.exports = {
  async index(req, res, next) {
    try{
      const {dataInicial, dataFinal} = req.query
      const {campo = 'data_solicitacao'} = req.params
      const query = knex('Locacao').withSchema(schemaName) 
      query.join('Usuario','Locacao.documento','Usuario.documento')
      query.where('Locacao.devolvido',0)
      if (dataInicial){
        query.andWhere(campo,'>=',dataInicial)
      } 
      if (dataFinal){
        query.andWhere(campo,'<=',dataFinal)
      }
      query.select('Usuario.nome')
      query.select('Locacao.*')
      query.orderBy(campo, 'desc')      
      const results = await query
      res.json(results)
    }
    catch (error){
      next(error)
    }
  },
  async indexTotal(req, res, next) {
    try{
      const {dataInicial, dataFinal} = req.query
      const {campo = 'data_solicitacao'} = req.params
      const query = knex('Locacao').withSchema(schemaName) 
      .join('Usuario','Locacao.documento','Usuario.n_documento')
      if (dataInicial){
        query.where(campo,'>=',dataInicial)
      } 
      if (dataFinal){
        query.where(campo,'<=',dataFinal)
      }
      query.select('Usuario.nome')
      query.select('Locacao.*')
      query.orderBy(campo, 'desc')      
      const results = await query
      res.json(results)
    }
    catch (error){
      next(error)
    }
  },
  async create(req, res, next) {
    var Kit = parseInt(req.body.kit)
    try{      
      const query2 = knex('Estoque').withSchema(schemaName)
      query2.update('data_atualizacao',knex.fn.now())
      query2.update('ativo', 1)
      query2.update('emprestado', 1)
      query2.where('kit', Kit)
      query2.returning(['numero_serie_bateria', 'numero_serie_equipamento']); 
      const results2 = await query2;
      const query = knex('Locacao').withSchema(schemaName).insert({
        documento: req.body.documento,
        numero_serie_bateria: results2[0].numero_serie_bateria,
        numero_serie_equipamento: results2[0].numero_serie_equipamento,
        data_solicitacao: knex.fn.now(),
        kit: Kit
      }).returning('*')
      const results = await query; 
      res.json(results)
      return res.status(201).send()
    }
    catch (error){
      next(error)
    }
  },
  async update(req, res, next) {
    try {
        const { documento } = req.body.documento
        const query = knex('Locacao').withSchema(schemaName)
        query.update({
          data_devolucao: knex.fn.now(),
          status: req.body.status.toUpperCase(),
          sugestao: req.body.sugestao.toUpperCase(),
          avaliacao: req.body.avaliacao,          
          devolvido: '1',
          foto: req.body.foto          
         })
        query.where({ documento: req.body.documento,
          devolvido: '0'})
        query.returning('*')       
        const result = await query;
        /*query2 = knex('Locacao').withSchema(schemaName)
        query2.select('kit')
        query2.where('id',result.id)
        const result2 = await query2;
        query3 = knex('Estoque').withSchema(schemaName)
        query3.update({emprestado: '0'})
        query3.where('id',result)
        const result3 = await query3;*/
        return res.status(201).send()

    } catch (error) {
        next(error)
    }
  },
  async indexOpen(req, res, next) {
    try{
      const query = knex('Locacao').withSchema(schemaName) 
      .join('Usuario','Locacao.documento','Usuario.documento')      
      query.where('devolvido','=',0)
      query.select('Usuario.nome')
      query.select('Locacao.*')
      query.orderBy('data_solicitacao', 'desc')      
      const results = await query
      res.json(results)
    }
    catch (error){
      next(error)
    }
  }
}