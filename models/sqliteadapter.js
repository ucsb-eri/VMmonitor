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
        return this.all('SELECT DISTINCT hostName FROM VMStatus');
    };

    /**
     * Query for all VMs hosted on the `host`
     * @param {!string} host: The host to query about
     */
    this.getVMs = function(host) {
        return this.all('SELECT DISTINCT name FROM VMStatus').then(function(VMs) {
            var results = [];
            for (var i = 0; i < VMs.length; i++) {
                results.push(VMs[i].name);
            }
            return results;
        });
    };

    /**
     * Return an array of the latest status for each VM in the table
     */
    this.getLatestVMsStatus = function() {
        return this.all('SELECT * from VMStatus t1 INNER JOIN ' +
            '(SELECT name, max(generateTime) as generateTime FROM VMStatus GROUP BY name) t2 ' +
            'ON t1.name = t2.name AND t1.generateTime = t2.generateTime');
    };

    /**
     * Close the database
     */
    this.closeDB = function() {
        var deffered = Q.defer();
        this.db.close(function(err) {
            if (err) {
                return deffered.reject(false);
            }
            deffered.resolve(true);
        });
        return deffered.promise;
    };

}).call(SQLiteAdapter.prototype);

module.exports = SQLiteAdapter;