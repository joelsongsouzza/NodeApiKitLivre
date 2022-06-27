const schemaName = `${process.env.DB_SCHEMA}`

exports.up = knex => knex.schema.withSchema(schemaName).createTable('Locacao', table =>{
    table.increments('id').unique().notNullable().primary()
    table.date('data_solicitacao')
    table.date('data_devolucao')
    table.decimal('tempo_espera',8, 2)
    table.integer('avaliacao')
    table.string('status',100)
    table.string('sugestao',500)
    table.string('numero_serie_equipamento',25).references('numero_serie').inTable('Equipamento')
    table.string('numero_serie_bateria',25).references('numero_serie').inTable('Bateria')
    table.string('documento',25).references('n_documento').inTable('Usuario')
    table.boolean('devolvido')
    table.string('foto',300)
    table;timestamp('created_at').defaultTo(knex.fn.now())
    table;timestamp('updated_at').defaultTo(knex.fn.now())
  });

exports.down = knex => knex.schema.withSchema(schemaName).dropTable('Locacao');