/**
 * This controller fetches data from the database, and prepare the data to display
 */

var SQLiteAdapter = require('../models/sqliteadapter');
var LocalsFactory = require('../models/localsfactory');

var adapter = new SQLiteAdapter('test/VM.db');
var factory = new LocalsFactory();


module.exports = {

    /**
     * Generates an array of elements to show in a table
     * @returns {*}
     */
    generateTableElements: function() {
        return adapter.getLatestVMsStatus()
            .then(function(VMStatus) {
                return factory.processVMStatus(VMStatus);
            });
    },

    /**
     * Generates an array of elements to show in a pie chart
     * @returns {*}
     */
    generatePiChartElements: function() {

    }

};