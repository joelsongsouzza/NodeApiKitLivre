const knex = require('../database')
const schemaName = `${process.env.DB_SCHEMA}`

module.exports = {
  async index(req, res, next) {
    try{
      const query = knex('Estoque').withSchema(schemaName)       
      query.join('Equipamento','Equipamento.numero_serie_equipamento','Estoque.numero_serie_equipamento')   
      query.join('Bateria','Bateria.numero_serie_bateria','Estoque.numero_serie_bateria')
      query.leftJoin('Locacao','Locacao.kit','Estoque.kit')
      query.where('Estoque.ativo',1)  
      query.andWhere('Bateria.bateria_status','EM FUNCIONAMENTO')
      query.andWhere('Equipamento.equipamento_status','EM FUNCIONAMENTO')      
      query.andWhere('Bateria.carga', '>', 80)
      query.andWhere(function () {
        this.orWhere(knex.raw('Locacao.devolvido <> ?', [0]))
        this.orWhereNull('Locacao.devolvido')})  
      query.select('Estoque.numero_serie_equipamento') 
      query.select('Estoque.numero_serie_bateria') 
      query.select('Bateria.bateria_status') 
      query.select('Bateria.carga')
      query.select('Equipamento.equipamento_status')
      query.select('Estoque.kit') 
      query.select('Estoque.parceiro')      
      query.select('Estoque.qr')   
      query.select('Estoque.qr64') 
      query.select('Estoque.ativo')           
      const results = await query
      res.json(results)
    }
    catch (error){
      next(error)
    }
  },
  async indexTotal(req, res, next) {
    try{
      const query = knex('Estoque').withSchema(schemaName)       
      query.join('Equipamento','Equipamento.numero_serie_equipamento','Estoque.numero_serie_equipamento')   
      query.join('Bateria','Bateria.numero_serie_bateria','Estoque.numero_serie_bateria')
      query.leftJoin('Locacao','Locacao.kit','Estoque.kit')
      query.where('Estoque.ativo',1) 
      query.select('Estoque.numero_serie_equipamento') 
      query.select('Estoque.numero_serie_bateria') 
      query.select('Bateria.bateria_status') 
      query.select('Bateria.carga')
      query.select('Equipamento.equipamento_status')
      query.select('Estoque.kit')  
      query.select('Estoque.parceiro')
      query.select('Estoque.qr')   
      query.select('Estoque.qr64')     
      query.select('Estoque.ativo')     
      const results = await query
      res.json(results)
    }
    catch (error){
      next(error)
    }
  },
  async create(req, res, next) {
    console.log(req.body)
    try{
      /*const idParceiro =  await knex('Parceiro').withSchema(schemaName)
      .where('razao_social',req.body.parceiro)
      .select('Parceiro.documento');*/      
      var result = await knex('Estoque').withSchema(schemaName).insert({
        numero_serie_bateria: req.body.numero_serie_bateria,
        numero_serie_equipamento: req.body.numero_serie_equipamento,
        ativo:1,
        data_atualizacao: knex.fn.now(),
        qr:req.body.qr,
        qr64:req.body.qr64,
        //parceiro:idParceiro[0].documento
        parceiro:req.body.parceiro
      }).returning(['kit','numero_serie_equipamento'])
      return res.status(201).send(result)
    }
    catch (error){
      next(error)
    }
  },
  async update(req, res, next) {
    try {
      const { kit } = req.body
      var result = await knex('Estoque').withSchema(schemaName)
      .update('data_atualizacao',knex.fn.now())
      .update('ativo', 0)
      .where('kit',kit).returning(['kit','numero_serie_equipamento'])
      return res.status(201).send(result)
    } catch (error) {
        next(error)
    }
  },
  async updateTotal(req, res, next) {
    try {
      const {numero_serie_bateria,numero_serie_equipamento,ativo,tempo_utilizacao,qr,qr64,parceiro} = req.body
      const query = knex('Estoque').withSchema(schemaName)
      query.update('data_atualizacao',knex.fn.now())
      if (tempo_utilizacao){
      query.update('tempo_utilizacao', tempo_utilização)
      }       
      if (ativo){
        query.update('ativo', ativo)
      }
      if (numero_serie_bateria){
        query.update('numero_serie_bateria',numero_serie_bateria)
      }
      if (qr){
        query.update('qr',qr)
      }
      if (qr64){
        query.update('qr64',qr64)
      }
      if (parceiro){
        query.update('parceiro',parceiro)
      }
      if (numero_serie_equipamento){
        query.update('numero_serie_equipamento',numero_serie_equipamento)
      }
      query.where('numero_serie_bateria',numero_serie_bateria)
      query.andWhere('numero_serie_equipamento', numero_serie_equipamento)
      return res.send()
    } catch (error) {
        next(error)
    }
  },
   async delete(req, res, next) {
      try {
        await knex('Estoque').withSchema(schemaName)
        .update({
          data_atualizacao: knex.fn.now(),       
          ativo: 0
        })
        .where({ numero_serie_bateria: req.body.numero_serie_bateria,
        numero_serie_equipamento: req.body.numero_serie_equipamento})
        return res.send()
      } catch (error) {
        next(error)
      }
  },
  async indexInativo(req, res, next) {
    try{
      const query = knex('Equipamento').withSchema(schemaName)
      query.select('Equipamento.numero_serie_equipamento')
      query.select('Equipamento.status')
      query.whereNot('Equipamento.status','EM FUNCIONAMENTO') 
      query.union([knex
        .withSchema(schemaName)
        .select('Bateria.numero_serie')
        .select('Bateria.bateria_status')
        .select('Estoque.parceiro')         
        .select('Estoque.qr')   
        .select('Estoque.qr64') 
        .from('Bateria')
        .whereNot('Bateria.bateria_status','EM FUNCIONAMENTO')])           
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
      query.select('Equipamento.numero_serie_equipamento')
      query.select('Equipamento.status')
      query.where('Equipamento.status','EM MANUTENÇÃO') 
      query.union([knex
        .withSchema(schemaName)
        .select('Bateria.numero_serie')
        .select('Bateria.bateria_status')
        .select('Estoque.parceiro')         
        .select('Estoque.qr')   
        .select('Estoque.qr64') 
        .from('Bateria')
        .where('Bateria.bateria_status','EM MANUTENÇÃO')])           
      const results = await query
      res.json(results)
    }
    catch (error){
      next(error)
    }
  }
}