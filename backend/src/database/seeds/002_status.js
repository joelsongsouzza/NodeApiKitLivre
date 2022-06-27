const schemaName = `${process.env.DB_SCHEMA}`

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('Status').withSchema(schemaName).del()
  await knex('Status').withSchema(schemaName).insert([
    {id: 1, tipo: 'EM FUNCIONAMENTO'},
    {id: 2, tipo: 'EM MANUTENÇÃO'},
    {id: 3, tipo: 'COM DEFEITO'}
  ]);
};
