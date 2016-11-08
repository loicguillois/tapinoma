"use strict";

var usb = require('usb');
var messages = require('./messages');
var constants = require('./constants');

const GARMIN_ID = 0x0fcf;
const GARMIN_STICK_2 = 0x1008;
const GARMIN_STICK_3 = 0x1009;

//usb.setDebugLevel(4);

var device = null;
var outEndpoint = null;

// TODO : affect real channel
var channel = 0;

var write = function(buffer) {
    outEndpoint.transfer(buffer, function(err) {
        if(err) {
            console.log(err);
        }
    })
}

module.exports = {
    findAdapter: function () {
        device = usb.findByIds(GARMIN_ID, GARMIN_STICK_3);
        if (device === undefined) {
            device = usb.findByIds(GARMIN_ID, GARMIN_STICK_2);
        }
        return device;
    },

    open: function () {
        device.open();
        let iface = device.interfaces[0];

        if(iface.isKernelDriverActive()) {
            iface.detachKernelDriver();
        }

        iface.claim();
        let InEndpoint = iface.endpoints[0];
        outEndpoint = iface.endpoints[1];

        let oldCadenceCount = null;
        let oldCadenceTime = null;

        InEndpoint.on('data', (data) => {
            if(data.readUInt8(constants.BUFFER_INDEX_CHANNEL_NUM) != channel) {
                return;
            }

            switch (data.readUInt8(constants.BUFFER_INDEX_MSG_TYPE)) {
                case constants.MESSAGE_CHANNEL_BROADCAST_DATA:
                    //console.log('broadcast')
                case constants.MESSAGE_CHANNEL_ACKNOWLEDGED_DATA:
                case constants.MESSAGE_CHANNEL_BURST_DATA:
                    // send ACK
                    //write(messages.requestMessage(channel, constants.MESSAGE_CHANNEL_ID));

                    // Get HeartRate
                    /*var hrmPayload = data.slice(constants.BUFFER_INDEX_MSG_DATA + 4);
                    var beatTime = hrmPayload.readUInt16LE(0);
                    var beatCount = hrmPayload.readUInt8(2);
                    var ComputedHeartRate = hrmPayload.readUInt8(3);

                    console.log(beatTime, beatCount, ComputedHeartRate);*/

                    // Get cadence
                    let cadenceTime = data.readUInt8(constants.BUFFER_INDEX_MSG_DATA + 4);
                    cadenceTime |= data.readUInt8(constants.BUFFER_INDEX_MSG_DATA + 5) << 8;

                    let cadenceCount = data.readUInt8(constants.BUFFER_INDEX_MSG_DATA + 6);
                    cadenceCount |= data.readUInt8(constants.BUFFER_INDEX_MSG_DATA + 7) << 8;

                    if(oldCadenceCount != null) {
                        if(oldCadenceTime > cadenceTime) {
                            cadenceTime += (1024 * 64);
                        }
                        let diffCount = cadenceCount - oldCadenceCount;
                        let diffTime = cadenceTime - oldCadenceTime;
                        let rpm = 60 * diffCount / (diffTime / 1024);

                        if(rpm) {
                            console.log(rpm);
                        }
                    }
                    
                    oldCadenceCount = cadenceCount;
                    oldCadenceTime = cadenceTime;
                case constants.MESSAGE_CHANNEL_ID:
                    break;
                default:
                    break;
            }
        })

        InEndpoint.on('error', (e) => {
            console.log("error=" + e);
        })

        InEndpoint.on('end', () => {
            console.log("STOP RECIEVING");
        })

        InEndpoint.startPoll();
    },

    attach: function (channel, type, deviceID, deviceType, transmissionType, timeout, period, frequency) {
        write(messages.resetSystem());
        write(messages.requestMessage(channel));
        write(messages.setNetworkKey());
        write(messages.assignChannel(channel, type));
        write(messages.setDevice(channel, deviceID, deviceType, transmissionType));
        write(messages.searchChannel(channel, timeout));
        write(messages.setPeriod(channel, period));
        write(messages.setFrequency(channel, frequency));
        write(messages.openChannel(channel));
    }
}
