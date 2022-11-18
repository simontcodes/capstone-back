/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("client", function (table) {
      table.uuid("id").primary().defaultTo(knex.raw("(UUID())"));
      table.string("firstName", 30).notNullable();
      table.string("lastName", 30).notNullable();
      table.string("email", 100).notNullable();
      table.string("phoneNumber").notNullable();
      table.string("password").notNullable();
      table.string("educationLevel");
      table.string("canadaVisitor");
      table.string("canadaStudent", 50);
      table.string("canadaYearsOfExpirience");
      table.string("canadaWorker", 50);
      table.string("englishTest", 10);
      table.integer("englishSpeaking").unsigned();
      table.integer("englishWriting").unsigned();
      table.integer("englishReading").unsigned();
      table.integer("englishListening").unsigned();
      table.string("provinceOfPreference", 30);
      table.string("cityOfPreference", 30);
      table.string("studyInCanada");
    })
    .createTable("workExp", function (table) {
      table.increments("id");
      // table.string("client_id").notNullable();
      table.string("jobTitle", 50).notNullable();
      table.string("yearsOfExperience").notNullable();
      table
        .uuid("client_id")
        .references("id")
        .inTable("client")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .defaultTo(knex.raw("(UUID())"));
    })
    .createTable("appointment", function (table) {
      table.increments("id");
      table.string("client_id").notNullable();
      table.string("dateOfAppointment").notNullable();
      table.string("timeOfAppointment").notNullable();
      //make this nullable later
      table.integer("typeOfService").unsigned();
      table
        .foreign("client_id")
        .references("id")
        .inTable("client")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  // delete the two tables
  return knex.schema
    .dropTable("appointment")
    .dropTable("workExp")
    .dropTable("client");
};
