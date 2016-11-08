"use strict";

var usb = require('usb');
var messages = require('./messages');
var constants = require('./constants');

var device = null;
var outEndpoint = null;

var currentChannel = 0;

var callbacks = {};
var channelCounts = 0;
var channelTypes = [];

var write = function (buffer) {
    outEndpoint.transfer(buffer, function (err) {
        if (err) {
            console.log(err);
        }
    })
}

const types = {
    FEC: 17,
    HEART_RATE: 120,
    CADENCE: 122,
};

var connect = function (deviceType, callback) {
    let channel = channelCounts;
    let deviceID = 0;
    let period = null;
    let deviceTypeId = null;
    switch (deviceType) {
        case 17:
            period = 8182;
            deviceTypeId = "FEC";
            break;
        case 120:
            period = 8070;
            deviceTypeId = "HEART_RATE";
            break;
        case 122:
            period = 8086;
            deviceTypeId = "CADENCE";
            break;
        default:
            throw 'device type not supported';
    }

    // TODO: powermeter (need to test)
    //var deviceType = 11;
    //driver.attach(channel, 'receive', deviceID, deviceType, 5, 255, 8182, 57);

    attach(channel, 'receive', deviceID, deviceType, 0, 255, period, 57);
    callbacks[deviceTypeId] = callback;
    channelTypes[channelCounts] = deviceType;
    channelCounts++;
}

var findAdapter = function () {
    device = usb.findByIds(constants.GARMIN_ID, constants.GARMIN_STICK_3);
    if (device === undefined) {
        device = usb.findByIds(constants.GARMIN_ID, constants.GARMIN_STICK_2);
    }
    return device;
}

var open = function () {
    device.open();
    let iface = device.interfaces[0];

    if (iface.isKernelDriverActive()) {
        iface.detachKernelDriver();
    }

    iface.claim();
    let InEndpoint = iface.endpoints[0];
    outEndpoint = iface.endpoints[1];

    let oldCadenceCount = null;
    let oldCadenceTime = null;

    InEndpoint.on('data', function (data) {
        if (data.readUInt8(constants.BUFFER_INDEX_CHANNEL_NUM) != currentChannel) {
            return;
        }

        switch (data.readUInt8(constants.BUFFER_INDEX_MSG_TYPE)) {
            case constants.MESSAGE_CHANNEL_BROADCAST_DATA:
            case constants.MESSAGE_CHANNEL_ACKNOWLEDGED_DATA:
            case constants.MESSAGE_CHANNEL_BURST_DATA:
                // send ACK
                write(messages.requestMessage(currentChannel, constants.MESSAGE_CHANNEL_ID));

                switch (channelTypes[currentChannel]) {
                    case types.HEART_RATE:
                        let hrmPayload = data.slice(constants.BUFFER_INDEX_MSG_DATA + 4);
                        //var beatTime = hrmPayload.readUInt16LE(0);
                        //var beatCount = hrmPayload.readUInt8(2);
                        let computedHeartRate = hrmPayload.readUInt8(3);
                        callbacks['HEART_RATE'](computedHeartRate);
                        break;
                    case types.CADENCE:
                        let cadenceTime = data.readUInt8(constants.BUFFER_INDEX_MSG_DATA + 4);
                        cadenceTime |= data.readUInt8(constants.BUFFER_INDEX_MSG_DATA + 5) << 8;

                        let cadenceCount = data.readUInt8(constants.BUFFER_INDEX_MSG_DATA + 6);
                        cadenceCount |= data.readUInt8(constants.BUFFER_INDEX_MSG_DATA + 7) << 8;

                        if (oldCadenceCount != null) {
                            if (oldCadenceTime > cadenceTime) {
                                cadenceTime += (1024 * 64);
                            }
                            let diffCount = cadenceCount - oldCadenceCount;
                            let diffTime = cadenceTime - oldCadenceTime;
                            let rpm = 60 * diffCount / (diffTime / 1024);

                            if (rpm) {
                                callbacks['CADENCE'](rpm);
                            }
                        }

                        oldCadenceCount = cadenceCount;
                        oldCadenceTime = cadenceTime;
                        break;
                    case types.FEC:
                        var fecPayload = data.slice(constants.BUFFER_INDEX_MSG_DATA);
                        // Specific Trainer Data
                        if (fecPayload.readUInt8(0) === 0x19) {
                            let cadence = fecPayload.readUInt8(2);
                            let power = fecPayload.readUInt16LE(5);
                            callbacks['FEC'](cadence, power);
                        }
                        break;
                }
                break;
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
}

var attach = function (channel, type, deviceID, deviceType, transmissionType, timeout, period, frequency) {
    currentChannel = channel;
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

module.exports = {
    types: types,
    connect: connect,
    findAdapter: findAdapter,
    open: open,
    attach: attach
}
