//const jwt = require('../config/jwt');
const jwt = require('jsonwebtoken');
const knex = require('../database');
const bcrypt = require('bcryptjs');
const schemaName = `${process.env.DB_SCHEMA}`;
const secret = `${process.env.SECRET}`;
const timer = `${process.env.TEMPO}`;

module.exports = {
  async index(req, res, next) {
    try{      
      const query = knex('Parceiro').withSchema(schemaName) 
      const results = await query
      res.json(results)
    }
    catch(error){
      next(error)
    }
  },
  async indexAdmin(req, res, next) {
    try{      
      const query = knex('Parceiro').withSchema(schemaName).where('id',1)

      const results = await query
      res.json(results)
    }
    catch(error){
      next(error)
    }
  },
  async update_senha(req, res) {
    var hash = '';
    try{
      hash = await bcrypt.hash(req.body.senha, 10);
    }
    catch{
      hash = req.body.senha;
    }
    try{
    await knex('Parceiro').withSchema(schemaName).where({ documento : req.body.documento})
    .update({senha: hash})
    return res.status(201).send()
    }
    catch (error){
      return res.status(500).send()
    }
  },
  async create(req, res, next) {    
    const documento_empresa = req.body.documento_empresa;
    const token = jwt.sign({documento_empresa} , secret, {expiresIn: timer});
    try{     
        var results = await knex('Parceiro').withSchema(schemaName).insert({
        //nome: req.body.nome.toUpperCase(),
        //sobrenome: req.body.sobrenome.toUpperCase(),
        //email_principal: req.body.email.toUpperCase(),
        email: req.body.email,
        //data_de_nascicmento: data_de_nascicmento,
        //documento: req.body.documento,
        //senha:hash,
        cep: req.body.cep,
        logradouro: req.body.logradouro,
        numero: req.body.numero,
        complemento: req.body.complemento,
        bairro: req.body.bairro,
        cidade: req.body.cidade,
        estado: req.body.estado,
        nome_fantasia: req.body.nome_fantasia,
        razao_social: req.body.razao_social,
        inscricao_estadual: req.body.inscricao_estadual,
        tipo_de_servico: req.body.tipo_de_servico,
        documento_empresa: req.body.documento_empresa,
        telefone: req.body.telefone,
        //telefone_usuario: req.body.telefone_usuario,
        //foto_documento: req.body.foto_documento,
        //foto_documento64: req.body.foto_documento64,
        foto: req.body.foto,
        foto64: req.body.foto64,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        nivel: req.body.acesso
      }).returning(['email', 'documento_empresa']);     
      return res.status(201).send({results, token});
    }
    catch (error){
      next(error)
    }
  },
  async authenticate(req, res){
    var authheader = req.headers.authorization; 
    if (!authheader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err)
    } 
    var auth = new Buffer.from(authheader.split(' ')[1],
    'base64').toString().split(':');
    var email = auth[0];
    var senha = auth[1];
    const result = await knex('Parceiro')
                            .withSchema(schemaName)
                            .where({ email : email})
                            .select('Parceiro.*')
                            .select('Nivel.*')
                            .join('Nivel','Nivel.id','Parceiro.nivel')
    console.log(result)
    if(!result)
      return res.status(400).send({ error: 'Parceiro não encontrado'});
    try{
      if(!await bcrypt.compare(senha, result[0].senha))
        return res.status(400).send({error: 'Senha invalida'});
    }
    catch(error){
      return res.status(401).send({error, result});
    }
    result[0].foto = `${process.env.APP_URL}/` + result[0].foto;
    const documento_empresa = result[0].documento_empresa;
    const token = jwt.sign({documento_empresa} , secret, {expiresIn: timer});
    res.status(200).send({
      result, 
      token
    });
  },
  async update(req, res, next) {  

    const documento_empresa = req.body.documento_empresa;
    //const token = jwt.sign({documento_empresa} , secret, {expiresIn: timer});
    try{     
        var results = await knex('Parceiro').withSchema(schemaName).where({ documento_empresa : req.body.documento_empresa})
        .update(req.body)
        .returning(['email', 'documento_empresa']);    
      return res.status(201).send({results});
    }
    catch (error){
      next(error)
    }
  },
  async indexParceiros(req, res, next) {
    try {
      const results = await knex('Parceiro')
                            .withSchema(schemaName)
                            .select('razao_social') 
                            .select('documento') 
      res.json(results)
    } 
    catch (error) {
      next(error)
    }
  }
}