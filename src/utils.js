"use strict";

var constants = require('./constants');

var buildMessage = function(payload = [], msgID = 0x00) {
    let m = []
    m.push(constants.MESSAGE_TX_SYNC);
    m.push(payload.length);
    m.push(msgID);
    for(let idx in payload) {
      m.push(payload[idx]);
    }
    m.push(getChecksum(m));

    return new Buffer(m);
}
  
var intToLEHexArray = function(int, numBytes) {
    if(typeof(numBytes) === "undefined" || numBytes === null) {
        numBytes = 1;
    }
    let a = [];
    let b = new Buffer(decimalToHex(int, numBytes * 2), 'hex');
    let i = b.length - 1;
    while(i >= 0) {
      a.push(b[i]);
      i--;
    }
    return a;
}
    
var decimalToHex = function(d, numDigits) {
    let hex = Number(d).toString(16);
    if(typeof(numDigits) === "undefined" || numDigits === null) {
        numDigits = 2;
    }
    while(hex.length < numDigits) {
        hex = "0" + hex;
    }
    return hex;
}

var getChecksum = function(message) {
    var checksum = 0;
    for(let idx in message) {
      checksum = (checksum ^ message[idx]) % 0xFF;
    }
    return checksum;
}

module.exports = {
    buildMessage : buildMessage,
    intToLEHexArray : intToLEHexArray,
    decimalToHex : decimalToHex
}
