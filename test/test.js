/**
 * Created by tylero on 11/25/15.
 */

var chai = require("chai");
var expect = require('chai').expect;
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var Adapter = require('../models/SQLiteAdapter');


describe('SQLiteAdapter', function() {
    var DB = './test/VM.db';
    var adapter = new Adapter(DB);

    before(function () {

    });

    context('constructor', function () {
        it('should initialize DB', function () {
            expect(adapter.db).not.to.be.undefined;
        });
    });

    context('#getHosts()', function () {
        it('should return hosts array', function () {
            return expect(adapter.getHosts()).to.eventually.have.length(2);
        });
    });

    context('#getVMs(hosts)', function () {
        it('should return VMs array', function () {
            return expect(adapter.getVMs('legba.eri.ucsb.edu')).to.eventually.have.length(10);
        });
    });
});