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
      const query = knex('Funcionario').withSchema(schemaName) 
      const results = await query
      res.json(results)
    }
    catch(error){
      next(error)
    }
  },
  async indexAdmin(req, res, next) {
    try{      
      const query = knex('Funcionario').withSchema(schemaName).where('id',1)

      const results = await query
      res.json(results)
    }
    catch(error){
      next(error)
    }
  },
  async create(req, res, next) {
    var data_de_nascicmento = '';
    var hash = '';
    try{
      if (req.body.data_de_nascicmento.includes('/'))
      data_de_nascicmento = req.body.data_de_nascicmento.split('/').reverse().join('-');
      else
      data_de_nascicmento = req.body.data_de_nascicmento;
    }
    catch{
      data_de_nascicmento = '';
    }
    const {nivel} = req.body
    var acesso = 2;
    if(nivel)
      acesso = nivel;
    try{
      hash = await bcrypt.hash(req.body.senha, 10);
    }
    catch{
      hash = req.body.senha;
    }
    var numero = '';
    try{
      numero = req.body.numero.toUpperCase();
    }
    catch{
      numero = req.body.numero;
    }
    var nome,sobrenome,logradouro,complemento,bairro,cidade,estado
    try{
      nome = req.body.nome.toUpperCase();
    }
    catch{
      nome = req.body.nome;
    }
    try{
      sobrenome = req.body.sobrenome.toUpperCase();
    }
    catch{
      sobrenome = req.body.sobrenome;
    }
    try{
      logradouro = req.body.logradouro.toUpperCase();
    }
    catch{
      logradouro = req.body.logradouro;
    }
    try{
      complemento = req.body.complemento.toUpperCase();
    }
    catch{
      complemento = req.body.complemento;
    }
    try{
      bairro = req.body.bairro.toUpperCase();
    }
    catch{
      bairro = req.body.bairro;
    }
    try{
      cidade = req.body.cidade.toUpperCase();
    }
    catch{
      cidade = req.body.cidade;
    }
    try{
      estado = req.body.estado.toUpperCase();
    }
    catch{
      estado = req.body.estado;
    }
    const documento = req.body.documento;
    const token = jwt.sign({documento} , secret, {expiresIn: timer});
    try{     
        var results = await knex('Funcionario').withSchema(schemaName).insert({
        nome:  req.body.nome,
        sobrenome:  req.body.sobrenome,
        email: req.body.email.toUpperCase(),
        data_de_nascicmento:  req.body.data_de_nascicmento,
        documento: req.body.documento,
        senha:hash,
        cep: req.body.cep,
        logradouro: logradouro,
        numero:  req.body.numero,
        complemento:  req.body.complemento,
        bairro:  req.body.bairro,
        cidade:  req.body.cidade,
        estado:  req.body.estado,
        telefone: req.body.telefone,
        foto_documento: req.body.foto_documento,
        foto_documento64: req.body.foto_documento64,
        foto_com_documento: req.body.foto_com_documento,
        foto_com_documento64: req.body.foto_com_documento64,
        kitlivre:  req.body.kitlivre,
        nivel:  req.body.acesso
      }).returning(['email', 'documento']);   
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
    const result = await knex('Funcionario')
                            .withSchema(schemaName)
                            .where({ email : email})
                            .select('Funcionario.*')
                            .select('Nivel.*')
                            .join('Nivel','Nivel.id','Funcionario.nivel')
    if(!result)
      return res.status(400).send({ error: 'Funcionario não encontrado'});    
    try{
      if(!await bcrypt.compare(senha, result[0].senha))
        return res.status(400).send({error: 'Senha invalida'});
    }
    catch(error){
      console.log(error);
      return res.status(401).send({error, result});
    }
    result[0].senha = undefined;
    result[0].id = undefined;
    result[0].foto = `${process.env.APP_URL}/` + result[0].foto;
    result[0].fotoComDoc = `${process.env.APP_URL}/` + result[0].fotoComDoc;
    const documento = result[0].documento;
    const token = jwt.sign({documento} , secret, {expiresIn: timer});
    res.status(200).send({
      result, 
      token
    });
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
    await knex('Funcionario').withSchema(schemaName).where({ documento : req.body.documento})
    .update({senha: hash})
    return res.status(201).send()
    }
    catch (error){
      return res.status(500).send()
    }
  },
  async update(req, res, next) {
    /*var data_de_nascicmento = '';
    var hash = '';
    try{
      if (req.body.data_de_nascicmento.includes('/'))
      data_de_nascicmento = req.body.data_de_nascicmento.split('/').reverse().join('-');
      else
      data_de_nascicmento = req.body.data_de_nascicmento;
    }
    catch{
      data_de_nascicmento = '';
    }
    const {nivel} = req.body
    var acesso = 2;
    if(nivel)
      acesso = nivel;
    try{
      hash = await bcrypt.hash(req.body.senha, 10);
    }
    catch{
      hash = req.body.senha;
    }
    var numero = '';
    try{
      numero = req.body.numero.toUpperCase();
    }
    catch{
      numero = req.body.numero;
    }
    var nome,sobrenome,logradouro,complemento,bairro,cidade,estado,cep,email,telefone,foto_documento,foto_documento64,foto_com_documento,foto_com_documento64;
    try{
      nome = req.body.nome.toUpperCase();
    }
    catch{
      nome = req.body.nome;
    }
    try{
      sobrenome = req.body.sobrenome.toUpperCase();
    }
    catch{
      sobrenome = req.body.sobrenome;
    }
    try{
      logradouro = req.body.logradouro.toUpperCase();
    }
    catch{
      logradouro = req.body.logradouro;
    }
    try{
      complemento = req.body.complemento.toUpperCase();
    }
    catch{
      complemento = req.body.complemento;
    }
    try{
      bairro = req.body.bairro.toUpperCase();
    }
    catch{
      bairro = req.body.bairro;
    }
    try{
      cidade = req.body.cidade.toUpperCase();
    }
    catch{
      cidade = req.body.cidade;
    }
    try{
      estado = req.body.estado.toUpperCase();
    }
    catch{
      estado = req.body.estado;
    }
    try{
      cep = req.body.cep.toUpperCase();
    }
    catch{
      cep = req.body.cep;
    }
    try{
      email = req.body.email.toUpperCase();
    }
    catch{
      email = req.body.email;
    }
    try{
      telefone = req.body.telefone.toUpperCase();
    }
    catch{
      telefone = req.body.telefone;
    }
    try{
      foto_documento = req.body.foto_documento.toUpperCase();
    }
    catch{
      foto_documento = req.body.foto_documento;
    }
    try{
      foto_documento64 = req.body.foto_documento64.toUpperCase();
    }
    catch{
      foto_documento64 = req.body.foto_documento64;
    }
    try{
      foto_com_documento = req.body.foto_com_documento.toUpperCase();
    }
    catch{
      foto_com_documento = req.body.foto_com_documento;
    }
    try{
      foto_com_documento64 = req.body.foto_com_documento64.toUpperCase();
    }
    catch{
      foto_com_documento64 = req.body.foto_com_documento64;
    }*/
    const documento = req.body.documento;
    const token = jwt.sign({documento} , secret, {expiresIn: timer});
    try{     
        var results = await knex('Funcionario').withSchema(schemaName).where({ documento : req.body.documento})
        /*.update({
        nome: nome,
        sobrenome: sobrenome,
        email: email,
        data_de_nascicmento: data_de_nascicmento,
        senha:hash,
        cep: cep,
        logradouro: logradouro,
        numero: numero,
        complemento: complemento,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
        telefone: telefone,
        foto_documento: foto_documento,
        foto_documento64: foto_documento64,
        foto_com_documento: foto_com_documento,
        foto_com_documento64: foto_com_documento64,
        nivel: acesso
      })*/
      .update(req.body)
      .returning(['nome', 'email', 'documento']);     
      return res.status(201).send({results, token});
    }
    catch (error){
      next(error)
    }
  }
}