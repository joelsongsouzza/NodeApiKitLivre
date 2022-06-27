const schemaName = `${process.env.DB_SCHEMA}`

exports.up = knex => knex.schema.withSchema(schemaName).createTable('Usuario', table =>{
    table.string('n_documento',25).unique().notNullable().primary()
    table.string('nome',250)
    table.string('email',300)
    table.date('data_de_nasicmento')
    table.string('endereco',500)
    table.string('situacao_lesao',20)
    table.string('nivel_lesao',25)
    table.string('detalhe_lesao',500)
    table.string('foto_documento',300)
    table.string('foto_com_documento',300)
    table.string('foto_reconhecimento',300)
    table;timestamp('created_at').defaultTo(knex.fn.now())
    table;timestamp('updated_at').defaultTo(knex.fn.now())
  });

exports.down = knex => knex.schema.withSchema(schemaName).dropTable('Usuario');
