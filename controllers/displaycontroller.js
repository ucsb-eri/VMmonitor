/**
 * This controller fetches data from the database, and prepares the data to display
 */

var SQLiteAdapter = require('../models/sqliteadapter');
var LocalsFactory = require('../models/localsfactory');

var adapter = new SQLiteAdapter('data/vm.db');
var factory = new LocalsFactory();


module.exports = {

    /**
     * Generates an array of elements to show in a table
     * @returns {*}
     */
    generateTableElements: function() {
        // return adapter.getData()
        //     .then(function(VMStatus) {
        //         return factory.processVMStatus(VMStatus);
        //     });

        // return factory.processData(adapter.getData());
        console.log('called generateTableElements');
        return adapter.getData();

    },

};