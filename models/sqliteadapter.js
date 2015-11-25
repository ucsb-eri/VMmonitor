/**
 * Created by tylero on 11/24/15.
 */
var sqlite3 = require('sqlite3').verbose();

/**
 * This is an adapter for SQLite DB.
 * @param DB: The SQLite database file
 * @constructor
 */
function SQLiteAdapter(DB) {
    this.db = new sqlite3.Database(DB);
}

(function(){

    this.constructor = SQLiteAdapter;

    /**
     * Return an array contains the all hosts
     */
    this.getHosts = function() {

    };

    /**
     * Return an array contains the all VMs hosted on the host
     * @param {!string} host: The host to query about
     */
    this.getVMs = function(host) {

    };

    /**
     * Return an array of the latest status for each VM in VMs
     * @param {!Array<string>} VMs: VMs to query about
     */
    this.getLatestVMsStatus = function(VMs) {

    };

}).call(SQLiteAdapter.prototype);

module.exports = SQLiteAdapter;