/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("client", function (table) {
      table.increments("id");
      table.string("firstName", 30).notNullable();
      table.string("lastName", 30).notNullable();
      table.string("email", 100).notNullable();
      table.string("phoneNumber").notNullable();
      table.date("canadaVisitor");
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
      table.boolean("studyInCanada");
    })
    .createTable("workExp", function (table) {
      table.increments("id");
      table.integer("client_id").unsigned().notNullable();
      table.string("jobTitle", 50).notNullable();
      table.integer("yearsOfExperince").unsigned().notNullable();
      table
        .foreign("client_id")
        .references("id")
        .inTable("client")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("appointment", function (table) {
      table.increments("id");
      table.integer("client_id").unsigned().notNullable();
      table.date("dateOfAppointment").notNullable();
      table.time("timeOfAppointment").notNullable();
      //make this nullable later
      table.integer("payment").unsigned();
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
      return knex.schema.dropTable("workExp").dropTable("appointment").dropTable("client");
};
