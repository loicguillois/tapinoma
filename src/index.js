"use strict";

var driver = require('./driver');

var device = driver.findAdapter();

if(device != undefined) {
    console.log("USB ANT+ ADAPTER FOUND !");

    driver.open();

    var channel = 0;
    var deviceID = 0;

    // powermeter
    // var deviceType = 11;
    //driver.attach(channel, 'receive', deviceID, deviceType, 5, 255, 8182, 57);

    // heart
    let deviceType = 120;
    driver.attach(channel, 'receive', deviceID, deviceType, 0, 255, 8070, 57);
} else {
    console.log("USB ANT+ ADAPTER NOT FOUND !");
}
