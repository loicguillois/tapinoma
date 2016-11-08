"use strict";

var driver = require('./driver');

var device = driver.findAdapter();

if(device != undefined) {
    console.log("USB ANT+ ADAPTER FOUND !");

    driver.open();

    var channel = 0;
    var deviceID = 0;

    /*driver.connect(driver.types.HEART_RATE, function(heartRate) {
        console.log(heartRate + "bpm")
    });*/

    driver.connect(driver.types.CADENCE, function(cadence) {
        console.log(cadence + "rpm")
    });

    /*driver.connect(driver.types.FEC, function(cadence, power) {
        console.log(cadence + "rpm at " + power + "watts");
    });*/
} else {
    console.log("USB ANT+ ADAPTER NOT FOUND !");
}
