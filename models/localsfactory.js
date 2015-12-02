/**
 * Created by tylero on 11/24/15.
 */

function LocalsFactory() {

}

(function() {

    this.constructor = LocalsFactory;

    this.processVMStatus = function(VMStatus) {
        for (var i = 0; i < VMStatus.length; i++) {
            var status = VMStatus[i]
            var fromTime = status.generateTime;
            status.generateTime = this.toHumanReadableTime(fromTime);
            this.addColor(status);
        }
        return VMStatus;
    };

    this.toHumanReadableTime = function(fromTime) {
        return new Date(fromTime*1000).toLocaleString();
    };

    this.addColor = function(status) {
        switch (status.state) {
            case 'SHUTOFF':
                status.color = 'red';
                break;
            case 'RUNNING':
                status.color = 'green';
                break;
            case 'PAUSED':
                status.color = 'orange';
                break;
            default:
                status.color = 'grey';
        }
    }

}).call(LocalsFactory.prototype);

module.exports = LocalsFactory;

//[ { generateTime: 1447877294,R
//    name: 'xarray',
//    OSType: 'hvm',
//    path: '/vm/xarray.img',
//    FSType: 'ext2/ext3',
//    cpuTime: 0,
//    maxMem: 2097152,
//    memoryUsed: 0,
//    numOfCpu: 1,
//    state: 'SHUTOFF',
//    hostName: 'legba.eri.ucsb.edu' },
//    { generateTime: 1447877294,
//        name: 'blownaway',
//        OSType: 'hvm',
//        path: '/vm/blownaway.img',
//        FSType: 'ext2/ext3',
//        cpuTime: 1435120000000,
//        maxMem: 2097152,
//        memoryUsed: 2097152,
//        numOfCpu: 1,
//        state: 'RUNNING',
//        hostName: 'legba.eri.ucsb.edu' },
//    { generateTime: 1447877294,
//        name: 'lic-matlab',
//        OSType: 'hvm',
//        path: '/net/ojo/raid/vms/lic-matlab/lic-matlab.img',
//        FSType: 'nfs',
//        cpuTime: 5588080000000,
//        maxMem: 2097152,
//        memoryUsed: 2097152,
//        numOfCpu: 1,
//        state: 'RUNNING',
//        hostName: 'legba.eri.ucsb.edu' }]