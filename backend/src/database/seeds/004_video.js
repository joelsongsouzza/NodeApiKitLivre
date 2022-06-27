const schemaName = `${process.env.DB_SCHEMA}`

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  return knex('Video').del()
    .then(function () {
    return knex('Video').withSchema(schemaName).insert([
      {
        id: 1, 
        url: 'https://www.youtube.com/watch?v=L_ZrgadAxFg'
      }
    ]);
  });
};
