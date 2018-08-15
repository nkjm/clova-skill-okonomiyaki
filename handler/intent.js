"use strict";

const debug = require("debug")("clova:handler");

module.exports = (h) => {
    const intent_name = h.getIntentName();
    const intent = require(`../intent/order.js`);
    return intent(h);
}
