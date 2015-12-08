/**
 * Created by tylero on 11/30/15.
 */
var SQLiteAdapter = require('../models/sqliteadapter');
var LocalsFactory = require('../models/localsfactory');

var adapter = new SQLiteAdapter('test/VM.db');
var factory = new LocalsFactory();


module.exports = {
    generateTableElements: function() {
        return adapter.getLatestVMsStatus()
            .then(function(VMStatus) {
                return factory.processVMStatus(VMStatus);
            });
    },

    generatePiChartElements: function() {

    }

};