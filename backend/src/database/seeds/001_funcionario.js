const schemaName = `${process.env.DB_SCHEMA}`

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('Funcionario').withSchema(schemaName).del()
  await knex('Funcionario').withSchema(schemaName).insert([
    {
      id: 1, 
      nome: 'Admin',
      senha: 'MOBLIVRE'
    }
  ]);
};
