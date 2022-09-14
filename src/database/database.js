const StormDB = require('stormdb');

// Create databases
const engine_config = new StormDB.localFileEngine("./src/database/config.stormdb");
const DB_config = new StormDB(engine_config);
DB_config.default({ config: []});


module.exports = {DB_config};
