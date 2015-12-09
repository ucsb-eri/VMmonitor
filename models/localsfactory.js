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
    this.processVMStatus = function(VMStatus) {
        for (var i = 0; i < VMStatus.length; i++) {
            var status = VMStatus[i];
            var fromTime = status.generateTime;
            status.generateTime = this.toHumanReadableTime(fromTime);
            status.maxMem /= 1024*1024;
            this.addColor(status);
        }
        return VMStatus;
    };

    this.toHumanReadableTime = function(fromTime) {
        return new Date(fromTime*1000).toLocaleString();
    };

    /**
     * Adds color to a status object based on the state of the object
     * @param status: Reference to the status object
     */
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
