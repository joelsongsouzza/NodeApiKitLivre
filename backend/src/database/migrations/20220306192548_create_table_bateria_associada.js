const schemaName = `${process.env.DB_SCHEMA}`

exports.up = knex => knex.schema.withSchema(schemaName).createTable('Bateria_associada', table =>{
    table.increments('id').unique().notNullable().primary() 
    table.string('numero_serie_equipamento',25).references('numero_serie').inTable('Equipamento')
    table.string('numero_serie_bateria',25).references('numero_serie').inTable('Bateria')
    table;timestamp('created_at').defaultTo(knex.fn.now())
    table;timestamp('updated_at').defaultTo(knex.fn.now())
  });

exports.down = knex => knex.schema.withSchema(schemaName).dropTable('Bateria_associada');