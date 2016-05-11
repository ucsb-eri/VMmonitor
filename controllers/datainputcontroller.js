var SQLiteAdapter = require('../models/sqliteadapter');
var adapter = new SQLiteAdapter('data/vm.db');

module.exports = {
    generateDB: function(data) {
        adapter.createTables();
        adapter.storeData(data);
        // adapter.closeDB();
    }
};