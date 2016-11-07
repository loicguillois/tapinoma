var usb = require('usb');

var devices = usb.getDeviceList();

const GARMIN_ID = 0x0fcf;
const GARMIN_STICK_2 = 0x1008;
const GARMIN_STICK_3 = 0x1009;

for(var idx in devices) {
    if(devices[idx].deviceDescriptor.idVendor === GARMIN_ID) {
        if(devices[idx].deviceDescriptor.idProduct === GARMIN_STICK_2 || devices[idx].deviceDescriptor.idProduct === GARMIN_STICK_3) {
            console.log("USB ANT+ ADAPTER FOUND !")
        }
    }
}