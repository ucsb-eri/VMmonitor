/**
 * This a factory to make jade-render ready js objects.
 * @constructor
 */
function LocalsFactory() {

}

(function() {

    this.constructor = LocalsFactory;

    /**
     * A function to process VMStatus object
     * @param VMStatus: An array of VMStatus objects
     * @returns {*}: An array of jade-render ready js objects
     */
    // this.processVMStatus = function(VMStatus) {
    //     for (var i = 0; i < VMStatus.length; i++) {
    //         var status = VMStatus[i];
    //         var fromTime = status.generateTime;
    //         status.generateTime = this.toHumanReadableTime(fromTime);
    //         status.maxMem /= 1024*1024;
    //         this.addColor(status);
    //     }
    //     return VMStatus;
    // };

    // this.toHumanReadableTime = function(fromTime) {
    //     return new Date(fromTime*1000).toLocaleString();
    // };

    // *
    //  * Adds color to a status object based on the state of the object
    //  * @param status: Reference to the status object
     
    // this.addColor = function(status) {
    //     switch (status.state) {
    //         case 'SHUTOFF':
    //             status.color = 'red';
    //             break;
    //         case 'RUNNING':
    //             status.color = 'green';
    //             break;
    //         case 'PAUSED':
    //             status.color = 'orange';
    //             break;
    //         default:
    //             status.color = 'grey';
    //     }
    // }

    this.processData = function(data) {
        console.log('data to render: ', data);
    };
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
}).call(LocalsFactory.prototype);

module.exports = LocalsFactory;
