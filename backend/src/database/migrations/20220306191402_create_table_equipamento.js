const schemaName = `${process.env.DB_SCHEMA}`

exports.up = knex => knex.schema.withSchema(schemaName).createTable('Equipamento', table =>{
    table.string('numero_serie',25).unique().notNullable().primary()
    table.string('nome',250)
    table.string('status',300)
    table.string('foto',300)
    table;timestamp('created_at').defaultTo(knex.fn.now())
    table;timestamp('updated_at').defaultTo(knex.fn.now())
  });

exports.down = knex => knex.schema.withSchema(schemaName).dropTable('Equipamento');
