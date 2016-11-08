"use strict";

var utils = require('./utils');
var constants = require('./constants');

module.exports = {
    resetSystem: function () {
        let payload = [];
        payload.push(0x00);
        return utils.buildMessage(payload, constants.MESSAGE_SYSTEM_RESET);
    },

    requestMessage: function (channel = 0) {
        let payload = [];
        payload = payload.concat(utils.intToLEHexArray(channel));
        // TODO: this is the Message Requested ID (might need to change based on device type, not sure)
        payload.push(constants.MESSAGE_CAPABILITIES);
        return utils.buildMessage(payload, constants.MESSAGE_CHANNEL_REQUEST);
    },

    setNetworkKey: function () {
        let payload = [];
        payload.push(constants.DEFAULT_NETWORK_NUMBER);
        payload.push(0xB9);
        payload.push(0xA5);
        payload.push(0x21);
        payload.push(0xFB);
        payload.push(0xBD);
        payload.push(0x72);
        payload.push(0xC3);
        payload.push(0x45);
        return utils.buildMessage(payload, constants.MESSAGE_NETWORK_KEY);
    },

    assignChannel: function (channel = 0, type = 'receive') {
        let payload = [];
        payload = payload.concat(utils.intToLEHexArray(channel))
        if (type === 'receive') {
            payload.push(constants.CHANNEL_TYPE_TWOWAY_RECEIVE);
        } else {
            payload.push(constants.CHANNEL_TYPE_TWOWAY_TRANSMIT);
        }
        payload.push(constants.DEFAULT_NETWORK_NUMBER);
        return utils.buildMessage(payload, constants.MESSAGE_CHANNEL_ASSIGN);
    },


    setDevice: function (channel = 0, deviceID = 0, deviceType = 0, transmissionType = 0) {
        let payload = [];
        payload = payload.concat(utils.intToLEHexArray(channel));
        payload = payload.concat(utils.intToLEHexArray(deviceID, 2));
        payload = payload.concat(utils.intToLEHexArray(deviceType));
        payload = payload.concat(utils.intToLEHexArray(transmissionType));
        return utils.buildMessage(payload, constants.MESSAGE_CHANNEL_ID);
    },

    searchChannel: function (channel = 0, timeout = 0) {
        let payload = [];
        payload = payload.concat(utils.intToLEHexArray(channel));
        payload = payload.concat(utils.intToLEHexArray(timeout));
        return utils.buildMessage(payload, constants.MESSAGE_CHANNEL_SEARCH_TIMEOUT);
    },

    setPeriod: function (channel = 0, period = 0) {
        let payload = [];
        payload = payload.concat(utils.intToLEHexArray(channel));
        payload = payload.concat(utils.intToLEHexArray(period));
        return utils.buildMessage(payload, constants.MESSAGE_CHANNEL_PERIOD);
    },

    setFrequency: function (channel = 0, frequency = 0) {
        let payload = [];
        payload = payload.concat(utils.intToLEHexArray(channel));
        payload = payload.concat(utils.intToLEHexArray(frequency));
        return utils.buildMessage(payload, constants.MESSAGE_CHANNEL_FREQUENCY);
    },

    openChannel: function (channel = 0) {
        let payload = [];
        payload = payload.concat(utils.intToLEHexArray(channel));
        return utils.buildMessage(payload, constants.MESSAGE_CHANNEL_OPEN);
    },


    /* Detachment methods */

    closeChannel: function (channel = 0) {
        let payload = [];
        payload = payload.concat(utils.intToLEHexArray(channel));
        return utils.buildMessage(payload, constants.MESSAGE_CHANNEL_CLOSE);
    },

    unassignChannel: function (channel = 0) {
        let payload = [];
        payload = payload.concat(utils.intToLEHexArray(channel));
        return utils.buildMessage(payload, constants.MESSAGE_CHANNEL_UNASSIGN);
    }
}
