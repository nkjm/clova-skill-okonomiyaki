"use strict";

const debug = require("debug")("clova:handler");

module.exports = (h) => {
    debug(h.getIntentName());
    debug(h.getSessionId());
    debug(h.getSlots());

    const intent_name = h.getIntentName();
    const intent = require(`../intent/order.js`);
    return intent(h);
}
