const knex = require('../database')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const schemaName = `${process.env.DB_SCHEMA}`
const authConfig = require('../config/auth');

function generateToken(parms = {}){
  return jwt.sign(parms, authConfig,{
    expiresIn: 86400,
  })
}

function localizarUsuario(){
    if (window.navigator && window.navigator.geolocation) {
     var geolocation = window.navigator.geolocation;
     geolocation.getCurrentPosition(sucesso, erro);
    } else {
       return res.status(400).send({error: 'Geolocalização não suportada em seu navegador.'});
    }
    function sucesso(posicao){
      console.log(posicao);
      var nome = posicao.nome.toUpperCase();
      var latitude = posicao.coords.latitude;
      var longitude = posicao.coords.longitude;
      return res.String(`O usuário ${nome} está localizado em latitude de: ${latitude} e longitude de: ${longitude}` );
    }
    
    var movimento = window.navigator.geolocation.watchPosition(function(posicao) {
     return posicao;
   });
   //para parar de monitorar:
   window.navigator.geolocation.clearWatch(movimento);
   
    function erro(error){
        return error;
    }
}

module.exports = {
  async index(req, res, next) {
    try{      
      const {cpf} = req.query
      const {campo} = req.body
      const query = knex('Usuario').withSchema(schemaName) 
      if (cpf){
        query.where('n_documento',cpf)
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
    var latitude = '';
    var longitude = '';
    var hash = '';
    try{
      if (req.body.latitude.includes('N, S, L, O, º, ',',' ) )
          latitude = req.body.latitude.split('N, S, L, O, º, ',',' );
      else
          latitude = req.body.latitude;
    }
    catch{
          latitude = '';
    }
    try{
        if (req.body.latitude.includes('N, S, L, O, º, ',',' ) )
          longitude = req.body.longitude.split('N, S, L, O, º, ',',' );
        else
          longitude = req.body.longitude;
      }
      catch{
          longitude = '';
      }
    //era isso aqui que precisava
    const {nivel} = req.body
    var acesso = 1;
    if(nivel)
      acesso = nivel;
    try{
      hash = await bcrypt.hash(req.body.senha, 5);
    }
    catch{
      hash = req.body.senha;
    }
    try{     
        var results = await knex('Usuario').withSchema(schemaName).insert({
            nome: req.body.nome.toUpperCase(),
            latitude: req.body.latitude.toUpperCase(),
            longitude: req.body.longitude.toUpperCase(),
            email: req.body.email.toUpperCase(),
            documento: req.body.documento,
            senha:hash,
            nivel: acesso
      }).returning(['nome', 'latitude', 'longitude']);
      //result.senha = undefined;
      console.log({ token:generateToken({ n_documento: req.body.documento})});      
      return res.status(201).send(results);
      //return res.status(201).send({results, token:generateToken({ id: req.body.documento})})
    }
    catch (error){
      next(error)
    }
  },
  async indexCPF(req, res, next) {
    try {
      const results = await knex('Usuario')
                            .withSchema(schemaName)
                            .where({ n_documento : req.query.cpf})
                            .select('nome') 
      res.json(results)
    } catch (error) {
      next(error)
    }
  },
  async authenticate(req, res){
    const { email, senha, latitude, longitude } = req.body;
    // isso também o join no caso também
    const result = await knex('Usuario')
                            .withSchema(schemaName)
                            .where({ email : email})
                            .select('Usuario.*')
                            .select('Nivel.*')
                            .join('Nivel','Nivel.id','Usuario.nivel')
    const result1 = await knex('Usuario').withSchema(schemaName).select('latitude.*')
    const result2 = await knex('Usuario').withSchema(schemaName).select('longitude.*')
                            
    if(!result)
      return res.status(400).send({ error: 'Usuário não encontrado'});
    
    if(!await bcrypt.compare(latitude, result1.latitude))
      return res.status(400).send({error: 'Latitude não suportada em seu navegador.'});
      if(!await bcrypt.compare(longitude, result2.longitude))
      return res.status(400).send({error: 'Longitude não suportada em seu navegador.'});

    result.senha = undefined;
    result.latitude = undefined;
    result.longitude = undefined;

    res.send({
      result, 
      token:generateToken({ id: result.n_documento})
    });
  }
}