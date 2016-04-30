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
    this.hostData = [];
    this.guestData = [];
}

(function(){

    this.constructor = SQLiteAdapter;

    this.createTables = function() {
        var host_schema = 'host TEXT unique, ds TEXT, cpu INTEGER, fqdn TEXT, ctime INTEGER, mem INTEGER';
        var g_schema='host TEXT, ds TEXT, ctime INTEGER, osType TEXT, fsType TEXT, path TEXT, cpuTime INTEGER, memMax INTEGER default 0, memUsed INTEGER default 0, cpuMax INTEGER default 1, cpuUsed INTEGER default 1, state TEXT';
        var latest_schema='guest TEXT unique, '+g_schema;
        var guest_schema='guest TEXT, '+g_schema;

        this.db.run('CREATE TABLE IF NOT EXISTS hosts (' + host_schema + ')');
        this.db.run('CREATE TABLE IF NOT EXISTS guests (' + guest_schema + ')');
        this.db.run('CREATE TABLE IF NOT EXISTS latest (' + latest_schema + ')');
    };

    this.saveData = function(json) {
        var hostdata = json['hostData'];
        //convert unixtime to yyyy-mm-dd
        var dt = new Date(hostdata['generateTime']*1000);
        var datestamp = [dt.getUTCFullYear(), dt.getUTCMonth()+1, dt.getUTCDate()].join('-');
        //save hostdata
        this.hostData = [
            hostdata['host'],
            datestamp,
            hostdata['cpuCount'],
            hostdata['fqdn'],
            hostdata['generateTime'],
            hostdata['memoryBytes'],
        ];

        //save guest and latest data
        var guests = [];
        for(i=0; i<json['inactiveVMs'].length; i++) {
            guests.push(json['inactiveVMs'][i]);
        }
        for(i=0; i<json['activeVMs'].length; i++) {
            guests.push(json['activeVMs'][i]);
        }
        
        for(i=0; i<guests.length; i++) {
            var VM = guests[i]  
            this.guestData.push([
                VM['name'],                 //guest vm name
                hostdata['host'],           //host name
                datestamp,                  //datestamp
                hostdata['generateTime'],   //ctime,
                VM['OSType'],               //osType
                VM['FSType'],               //fsType
                VM['path'],                 //path
                VM['cpuTime'],              //cpuTime
                VM['maxMem'],               //memMax
                VM['memoryUsed'],           //memUsed
                VM['numOfCpu'],             //cpuMax
                VM['numOfCpu'],             //cpuUsed
                VM['state'],                //state
            ]);
        }
    };

    this.insertHostData = function() {
        var hostdata = json['hostData'];
        //convert unixtime to yyyy-mm-dd
        var dt = new Date(hostdata['generateTime']*1000);
        var datestamp = [dt.getUTCFullYear(), dt.getUTCMonth()+1, dt.getUTCDate()].join('-');
        var data = [
            hostdata['host'],
            datestamp,
            hostdata['cpuCount'],
            hostdata['fqdn'],
            hostdata['generateTime'],
            hostdata['memoryBytes'],
        ];
        this.db.run('INSERT OR IGNORE INTO hosts VALUES (?, ?, ?, ?, ?, ?)', data);
    };

    this.insertGuestData = function() {
        for(var i=0; i<this.guestData.length; i++) {
            this.db.run('INSERT INTO guests VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', this.guestData[i]);
        }
    };

    this.insertLatestData = function() {
        for(var i=0; i<this.guestData.length; i++) {
            db.run('INSERT OR REPLACE INTO latest VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', this.guestData[i]);
        }
    };
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
        return this.all('SELECT DISTINCT name FROM VMStatus ' +
            'WHERE hostName = ?', host).then(function(VMs) {
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
        var deferred = Q.defer();
        this.db.close(function(err) {
            if (err) {
                return deferred.reject(false);
            }
            deferred.resolve(true);
        });
        return deferred.promise;
    };

}).call(SQLiteAdapter.prototype);

module.exports = SQLiteAdapter;