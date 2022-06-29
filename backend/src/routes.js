const jwt = require("jsonwebtoken");
const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");
const knex = require("./database");
const schemaName = `${process.env.DB_SCHEMA}`;

const SolicitacaoController = require("./controllers/SolicitacaoController");
const EquipamentoController = require("./controllers/EquipamentoController");
const BateriaController = require("./controllers/BateriaController");
const UsuarioController = require("./controllers/UsuarioController");
const FuncionarioController = require("./controllers/FuncionarioController");
const ParceiroController = require("./controllers/ParceiroController");
const EstoqueController = require("./controllers/EstoqueController");

const LesaoController = require("./controllers/LesaoController");
const StatusController = require("./controllers/StatusController");
const VideoController = require("./controllers/VideoController");

const secret = `${process.env.SECRET}`;

const authMiddleware = async (req, res, next) => {
  try {
    const [, token] = req.headers.authorization.split(" ");
    var documento;
    jwt.verify(token, secret, (error, decode) => {
      documento = decode.documento;
    });
    const resultUser = await knex("Usuario").withSchema(schemaName).where({ documento: documento });
    if (!resultUser) {
      const resultPar = await knex("Parceiro")
        .withSchema(schemaName)
        .where({ documento: documento });
      if (!resultPar) {
        const resultFun = await knex("Funcionario")
          .withSchema(schemaName)
          .where({ documento: documento });
        if (!resultFun) {
          return res.status(400).send({ error: "Usuário não encontrado" });
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

routes.get("/equipamento", EquipamentoController.index);
routes.get("/equipamento-liberado", EquipamentoController.indexSerie);
routes.post("/equipamento", EquipamentoController.create);
routes.put("/equipamento", EquipamentoController.update);
routes.get("/equipamento-inativo", EquipamentoController.indexSerieEstoque);
routes.get("/equipamento-manutencao", EquipamentoController.indexManutencao);
routes.get("/bateria", BateriaController.index);
routes.get("/bateria-liberado", BateriaController.indexSerieEstoque);
routes.post("/bateria", BateriaController.create);
routes.get("/bateria-inativo", BateriaController.indexInativo);
routes.get("/bateria-manutencao", BateriaController.indexManutencao);
routes.put("/bateria", BateriaController.update);
routes.get("/usuario-teste", UsuarioController.index);
routes.get("/usuario", UsuarioController.index);
routes.post("/usuario", UsuarioController.create);
routes.post("/usuario-admin", UsuarioController.createADM);
routes.post("/usuario-admin-sem", UsuarioController.createADMNoPass);
routes.put("/usuario", UsuarioController.update);
routes.put("/usuario-senha", UsuarioController.update_senha);
routes.put("/ativar-usuario", UsuarioController.updateAtivo);
routes.get("/activate-user/:document", UsuarioController.activateUser);
routes.put("/troca-senha-usuario", UsuarioController.updateSenha);
routes.get("/usuario-cpf", UsuarioController.indexCPF);
routes.get("/autenticacao", UsuarioController.authenticate);
routes.get("/autenticacaosimples", UsuarioController.authenticatesimples);
routes.get("/funcionario", FuncionarioController.index);
routes.post("/funcionario", FuncionarioController.create);
routes.put("/funcionario", FuncionarioController.update);
routes.put("/funcionario-senha", FuncionarioController.update_senha);
routes.get("/autenticacao-funcionario", FuncionarioController.authenticate);
routes.get("/parceiro", ParceiroController.index);
routes.post("/parceiro", ParceiroController.create);
routes.put("/parceiro", ParceiroController.update);
routes.put("/parceiro-senha", ParceiroController.update_senha);
routes.get("/parceiro-lista", ParceiroController.indexParceiros);
routes.get("/autenticacao-parceiro", ParceiroController.authenticate);
routes.get("/solicitacao", SolicitacaoController.index);
routes.get("/solicitacao-completo", SolicitacaoController.indexTotal);
routes.get("/solicitacao-andamento", SolicitacaoController.index);
routes.get("/solicitacao/:campo", SolicitacaoController.index);
routes.post("/solicitacao", SolicitacaoController.create);
routes.put("/solicitacao", SolicitacaoController.update);
routes.get("/estoque", EstoqueController.index);
routes.get("/estoque-completo", EstoqueController.indexTotal);
routes.post("/estoque", EstoqueController.create);
routes.put("/estoque", EstoqueController.update);
routes.put("/estoque-completo", EstoqueController.updateTotal);
routes.delete("/estoque", EstoqueController.delete);
routes.get("/estoque-inativo", EstoqueController.indexInativo);
routes.get("/estoque-manutencao", EstoqueController.indexManutencao);
routes.get("/lesao", LesaoController.index);
routes.get("/status", StatusController.index);
routes.get("/funcionario-admin", FuncionarioController.indexAdmin);
routes.get("/videos", VideoController.index);

routes.post("/images", multer(multerConfig).single("file"), (req, res) => {
  return res.json(req.file.url);
});

const db = require("./Senha/db");
/*
não faz sentido
const utils = require('./Senha/utils')
const routs_users = require('./Senha/routs.users')

routes.get("/db", db.index);
routes.post("/db", db.create);
routes.put("/db", db.update);

routes.get("/utils", utils.index);
routes.post("/utils", utils.create);
routes.put("/utils", utils.update);

routes.get("/routs.users", routs_users.index);
routes.post("/routs.users", routs_users.create);
routes.put("/routs.users", routs_users.update);
*/

routes.post("/forgot", (req, res, next) => {
  db.knex(req.body.email, (err, doc) => {
    if (err || !doc) res.redirect("/"); //manda pro login mesmo que não ache
    const newpass = require("../utils").generatePassword();
    db.changePassword(req.body.email, newpass);
    require("../mail")(
      req.body.email,
      "Sua Nova Senha de Usuário ",
      "Olá " + doc.username + ", sua nova senha é " + newpass
    );
    res.redirect("/");
  });
}); //nova senha enviada por e-mail(mensagem)

module.exports = routes;
