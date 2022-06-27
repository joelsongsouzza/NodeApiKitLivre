const schemaName = `${process.env.DB_SCHEMA}`

exports.up = knex => knex.schema.withSchema(schemaName).createTable('Funcionario', table =>{
    table.increments('id').unique().notNullable().primary()
    table.string('n_documento',25)
    table.string('nome',250)
    table.string('email',300)
    table.date('data_de_nasicmento')
    table.string('endereco',500)
    table.string('senha',100)
    table.string('cargo',25)
    table.string('foto_documento',300)
    table;timestamp('created_at').defaultTo(knex.fn.now())
    table;timestamp('updated_at').defaultTo(knex.fn.now())
  });

exports.down = knex => knex.schema.withSchema(schemaName).dropTable('Funcionario');
