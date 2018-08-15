"use strict";

const debug = require("debug")("clova:*");

module.exports = (h) => {
    debug(h.getIntentName());
    debug(h.getSessionId());
    debug(h.getSlots());

    h.setSimpleSpeech({
        lang: 'ja',
        type: 'PlainText',
        value: 'ご注文はどうしましょう？',
    });
}
