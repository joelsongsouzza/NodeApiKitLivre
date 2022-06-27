/*
não precisa pos já tem no router da raiz
const routes = require('express').Router();
const UsuarioController= require('../controllers/UsuarioController')
const FuncionarioController= require('../controllers/FuncionarioController')

routes.get("/usuario", UsuarioController.index);
routes.post("/usuario", UsuarioController.create);
routes.get("/usuario-cpf", UsuarioController.indexCPF);
routes.get("/funcionario-admin", FuncionarioController.indexAdmin);



router.post('/forgot', (req, res, next) => {
    db.knex(req.body.email, (err, doc) => {
      if (err || !doc)
        res.redirect('/'); //manda pro login mesmo que não ache
      const newpass = require('../utils').generatePassword();
      db.changePassword(req.body.email, newpass);
      require('../mail')(req.body.email, 'Sua Nova Senha de Usuário ', 'Olá ' + doc.username + ', sua nova senha é ' + newpass);
      res.redirect('/');
    });
  })//nova senha enviada por e-mail(mensagem)

module.exports = routes; //busca e exportação das rotas

*/

//----------------------------------
//router.post('/forgot', function(req, res, next) {
 //   db.findUser(req.body.email, (err, doc) => {
 //     if(err || !doc) res.redirect('/')//manda pro login mesmo que não ache
 //     const newpass = require('../utils').generatePassword()
 //     db.changePassword(req.body.email, newpass)
 //     require('../mail')(req.body.email, 'Sua Nova Senha de Usuário ', 'Olá ' + doc.username + ', sua nova senha é ' + newpass)
 //     res.redirect('/')
 //   })
//})//nova senha enviada por e-mail(mensagem)
