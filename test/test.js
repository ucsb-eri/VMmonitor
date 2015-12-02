/**
 * Created by tylero on 11/25/15.
 */

var chai = require("chai");
var expect = require('chai').expect;
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var Adapter = require('../models/SQLiteAdapter');
var LocalsFactory = require('../models/localsfactory');


describe('SQLiteAdapter', function() {
    var DB = './test/VM.db';
    var adapter = null;

    before(function() {
        adapter = new Adapter(DB)
    });

    context('constructor', function() {
        it('should initialize DB', function () {
            expect(adapter.db.open).to.be.true;
        });
    });

    context('#getHosts()', function() {
        it('should return hosts array', function () {
            return expect(adapter.getHosts()).to.eventually.have.length(2);
        });
    });

    context('#getVMs(hosts)', function() {
        it('should return VMs array with length 10', function() {
            return expect(adapter.getVMs('legba.eri.ucsb.edu')).to.eventually.have.length(10);
        });
        it('should return VMs array with "tlapa"', function() {
            return expect(adapter.getVMs('legba.eri.ucsb.edu')).to.eventually.include('tlapa');
        });
    });

    context('#getLatestVMsStatus(VMs)', function() {
        it('should return an array of the latest status for each VM in VMs', function () {
            adapter.getLatestVMsStatus().then(function(re) {
                console.log(re);
            });
            return expect(adapter.getLatestVMsStatus()).to.eventually.have.length(10);
        });
    });

    context('#clodeDB()', function() {
        it('should close the database', function() {
            return expect(adapter.closeDB()).to.eventually.be.true;
        });
    });
});

describe('LocalsFactory', function() {
    var factory = null;
    before(function() {
        factory = new LocalsFactory();
    });

    context('#toHumanReadbleTime(fromTime)', function() {
        it('should convert UTC (in second) to readable text', function() {
            var UTC = 1447877294;
            var expected = '11/18/2015, 12:08:14 PM';
            expect(factory.toHumanReadableTime(UTC)).to.be.equal(expected);
        });
    });

    context('#addColor(status)', function() {
        it('should convert UTC (in second) to readable text', function() {
            var status = {state:'RUNNING'};
            factory.addColor(status);
            expect(status.color).to.be.equal('green');
        });
    });
});