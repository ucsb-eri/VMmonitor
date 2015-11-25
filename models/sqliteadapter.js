/**
 * Created by tylero on 11/24/15.
 */
var sqlite3 = require('sqlite3').verbose();
var Q = require('q');

/**
 * This is an adapter for SQLite DB.
 * @param DB: The SQLite database file
 * @constructor
 */
function SQLiteAdapter(DB) {
    this.db = new sqlite3.Database(DB);
    this.all = Q.nbind(this.db.all, this.db);
}

(function(){

    this.constructor = SQLiteAdapter;

    /**
     * Query for all hosts
     * @return a Q promise
     */
    this.getHosts = function() {
        return this.all('select distinct hostName from VMStatus');
    };

    /**
     * Query for all VMs hosted on the `host`
     * @param {!string} host: The host to query about
     */
    this.getVMs = function(host) {
        return this.all('select distinct name from VMStatus');
    };

    /**
     * Return an array of the latest status for each VM in VMs
     * @param {!Array<string>} VMs: VMs to query about
     */
    this.getLatestVMsStatus = function(VMs) {

    };

    /**
     * Close the database
     */
    this.closeDB = function() {
        this.db.close();
    };

}).call(SQLiteAdapter.prototype);

module.exports = SQLiteAdapter;