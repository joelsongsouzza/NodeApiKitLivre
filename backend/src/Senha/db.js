const knex = require('../database')
const schemaName = `${process.env.DB_SCHEMA}`

exports.user = knex => knex.schema.withSchema(schemaName).selectTable('Usuario', table =>{
    table.string('email',300)
});//busca do usuário por e-mail
exports.adm = knex => knex.schema.withSchema(schemaName).selectTable('Funcionario', table =>{
    table.string('email',300)
});//busca do funcionário por e-mail

exports.seu = knex => knex.schema.withSchema(schemaName).alterTable('Usuario', table =>{
    table.string('senha', 5)
});//alteração ou digitação de senha nova pelo usuário para seguir com as modificações
exports.seadm = knex => knex.schema.withSchema(schemaName).alterTable('Funcionario', table =>{
    table.string('senha', 5)
});//alteração ou digitação de senha nova pelo funcionário para seguir com as modificações


//-----------------
//function findUser(email, callback){
//    global.db.collection("users").findOne({email}, callback)
//} //busca do usuário por e-mail
//
//function changePassword(email, password){
//    const cryptPwd = bcrypt.hashSync(password, 10)
//    global.db.collection("users").updateOne({email}, {$set:{password: cryptPwd}})
//}//alteração ou digitação de senha nova pelo usuário

//export default { createUser, findUser, changePassword } //seguir para as modificações