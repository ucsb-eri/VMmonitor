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
    this.run = Q.nbind(this.db.run, this.db);
}

(function(){

    this.constructor = SQLiteAdapter;

    //================================================================================
    // data manipulation and input
    //================================================================================

    this.createTables = function() {
        var host_schema = 'host TEXT unique, ds TEXT, cpu INTEGER, fqdn TEXT, ctime INTEGER, mem INTEGER';
        var g_schema='guest TEXT, host TEXT, ds TEXT, ctime INTEGER, osType TEXT, fsType TEXT, path TEXT, cpuTime INTEGER, memMax INTEGER default 0, memUsed INTEGER default 0, cpuMax INTEGER default 1, cpuUsed INTEGER default 1, state TEXT';
        var latest_schema=g_schema+', UNIQUE(guest, host) ON CONFLICT REPLACE';
        var guest_schema=g_schema;

        this.db.run('CREATE TABLE IF NOT EXISTS hosts (' + host_schema + ')');
        this.db.run('CREATE TABLE IF NOT EXISTS guests (' + guest_schema + ')');
        this.db.run('CREATE TABLE IF NOT EXISTS latest (' + latest_schema + ')');
    };

    // storeData
    // processes json data, and stores it into db
    this.storeData = function(json) {
        // store host data
        // use try block because not all requests contain host data
        try {
            var hostdata = json['hostData'];
            // convert unixtime to yyyy-mm-dd
            var dt = new Date(hostdata['generateTime']*1000);
            var datestamp = [dt.getUTCFullYear(), dt.getUTCMonth()+1, dt.getUTCDate()].join('-');
            // save hostdata
            this.run('INSERT OR REPLACE INTO hosts VALUES (?, ?, ?, ?, ?, ?)', 
                hostdata['host'],
                datestamp,
                hostdata['cpuCount'],
                hostdata['fqdn'],
                hostdata['generateTime'],
                hostdata['memoryBytes']
            );
        }
        catch (e) {
            console.error(e);
        }
        

        //save guest and latest data
        var guests = [];
        for(i=0; i<json['inactiveVMs'].length; i++) {
            guests.push(json['inactiveVMs'][i]);
        }
        for(i=0; i<json['activeVMs'].length; i++) {
            guests.push(json['activeVMs'][i]);
        }
        
        for(i=0; i<guests.length; i++) {
            var VM = guests[i];
            var res = [
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
                VM['state']                 //state
            ];
            this.run('INSERT INTO guests VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', res);
            this.run('INSERT OR REPLACE INTO latest VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', res);
        }
    };

    //might not even have to ever close the db
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
    
    //================================================================================
    // data display
    //================================================================================

    // this.getGuests = function(host) {
    //     return this.all('SELECT * FROM guests WHERE host = ? ORDER BY guest', host);
    // };

    // this.getGuestData = function(guest, host) {
    //     return this.all('SELECT * FROM guests WHERE guest=? AND host=?', guest, host);
    // };

    // this.getHosts = function() {
    //     return this.all('SELECT * FROM hosts ORDER BY host');
    // };

    // this.getLatest = function(host) {
    //     return this.all('SELECT * FROM latest WHERE host = ?', host);
    // };

    // getData should return a Q promise object
    this.getData = function() {
        // data
        /*{
            'hosts[i]': {
                'hostdata' : 
                        // host        ds          cpu         fqdn                ctime       mem         
                        // ----------  ----------  ----------  ------------------  ----------  ------------
                        // zippy       2016-3-10   16          zippy.chg.ucsb.edu  1457605528  169212813312

                'guestdata' : ['guesta', 'guestb', etc. where guesta etc are js objects
            },
            'legba': {
                'hostdata' : {  cpu: 12 / 32  2x8*2@1.4GHz Intel        // hostdata: obj
                                mem: 27 / 62 Gb
                                rack: nhdc-r2.28.1u
                                acqdate: 2015-09-18
                                OS: CentOS-7.2.1511},
                'guestdata' : [{name: bouytalk, Sponsor: davey          // guestdata: array of objs
                                IP: 128.111.100.135
                                CPU: 1 / 1
                                Mem: 2 / 2 Gb
                                OS: CentOS-6.7
                                Services: glider comms
                                Path: /vm/bouytalk.img}]
            }
        }*/
        return this.all('SELECT host FROM hosts ORDER BY host DESC', function(err, rows) {
                // rows:  [ { host: 'z' }, { host: 'a' } ]
                // transform into hosts: ['a','z']
            // get list of all hosts, desc because array pop and push later
            var hosts = [];
            
            for (var i=0; i<rows.length; i++) {
                hosts.push(rows.pop().host);
            }
            // hosts = ['a','b', ... 'z']

            return hosts;
        }).then(function(hosts) {
            var data = {};
            // for each host, store hostdata and guestdata
            for (var i=0; i<hosts.length; i++) {
                data[hosts[i]] = {};
                this.all('SELECT ds, cpu, fqdn, ctime, mem FROM hosts WHERE host=?', hosts[i], function(err, rows) {
                    // rows: [ { ds: '...', cpu: '', fqdn: '', ...}, { host: 'zippy', ... etc.}]
                    data[hosts[i]]['hostdata'] = rows[0];
                    console.log('stored ', hosts[i], ' \'s hostdata');

                    //TODO might add union, select sum for cpuMax and cpuUsed based on state (shutoff or running)
                    this.all('SELECT guest, ds, ctime, osType, path, cpuTime, memUsed, memMax, cpuUsed, cpuMax, state FROM latest WHERE host=? ORDER BY guest', hosts[i], function(err, rows) {
                        // rows: [ { guest: 'chg-ewx', ... etc}, { guest: 'fez', ... }, { guest: '...', ... etc. }]
                        data[hosts[i]]['guestdata'] = rows;
                        console.log('stored ', hosts[i], '\'s guestdata');
                    });
                });
            }   //end for
            return data;
        });
    };

}).call(SQLiteAdapter.prototype);

module.exports = SQLiteAdapter;