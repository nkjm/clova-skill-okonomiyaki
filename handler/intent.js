"use strict";

const debug = require("debug")("clova:*");

module.exports = (h) => {
    debug(h.getIntentName());
    debug(h.getSessionId());
}
