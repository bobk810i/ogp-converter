const StormDB = require('stormdb');

// Create databases
const engine_config = new StormDB.localFileEngine("./src/database/config.stormdb");
const DB_config = new StormDB(engine_config);
DB_config.default({ config: []});

const engine_templates = new StormDB.localFileEngine("./src/database/templates.stormdb");
const DB_templates = new StormDB(engine_templates);
DB_templates.default({ templates: []});


module.exports = {DB_config, DB_templates};
