/**
 * Created by tylero on 11/30/15.
 */
var SQLiteAdapter = require('../models/sqliteadapter');
var LocalsFactory = require('../models/localsfactory');

var adapter = new SQLiteAdapter('test/VM.db');
var factory = new LocalsFactory();


module.exports = {
    tableElements: function() {
        return adapter.getLatestVMsStatus()
            .then(function(VMStatus) {
                return factory.processVMStatus(VMStatus);
            });
    },

    piChartElements: function() {

    }

};