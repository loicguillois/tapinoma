"use strict";

var driver = require('./driver');

var device = driver.findAdapter();

if(device != undefined) {
    console.log("USB ANT+ ADAPTER FOUND !");
    driver.open();
} else {
    console.log("USB ANT+ ADAPTER NOT FOUND !");
}