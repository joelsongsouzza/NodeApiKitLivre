const schemaName = `${process.env.DB_SCHEMA}`

exports.up = knex => knex.schema.withSchema(schemaName).createTable('Status', table =>{
    table.increments('id').unique().notNullable().primary() 
    table.string('tipo',100)
  });

exports.down = knex => knex.schema.withSchema(schemaName).dropTable('Status');