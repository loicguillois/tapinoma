"use strict";

var usb = require('usb');

const GARMIN_ID = 0x0fcf;
const GARMIN_STICK_2 = 0x1008;
const GARMIN_STICK_3 = 0x1009;

usb.setDebugLevel(4);

var device = usb.findByIds(GARMIN_ID, GARMIN_STICK_3);
if(device === undefined) {
    device = usb.findByIds(GARMIN_ID, GARMIN_STICK_2);
}

if(device != undefined) {
    console.log("USB ANT+ ADAPTER FOUND !");
    device.open();
    let iface = device.interfaces[0];

    if(iface.isKernelDriverActive()) {
        iface.detachKernelDriver();
    }

    iface.claim();
    let InEndpoint = iface.endpoints[0];

    InEndpoint.on('data', (d) => {
        console.log("data=" + d);
    })

    InEndpoint.on('error', (e) => {
        console.log("error=" + e);
    })

    InEndpoint.on('end', () => {
        console.log("STOP RECIEVING");
    })

    InEndpoint.startPoll();
} else {
    console.log("USB ANT+ ADAPTER NOT FOUND !");
}