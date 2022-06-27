const schemaName = `${process.env.DB_SCHEMA}`

exports.up = knex => knex.schema.withSchema(schemaName).createTable('Video', table =>{
    table.increments('id').unique().notNullable().primary() 
    table.string('url',250)
  });

exports.down = knex => knex.schema.withSchema(schemaName).dropTable('Lesao');
