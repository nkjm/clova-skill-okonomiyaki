"use strict";

const debug = require("debug")("clova:*");

module.exports = (h) => {
    debug(h.getIntentName());
    debug(h.getSessionId());
    
    h.setSimpleSpeech({
        lang: 'ja',
        type: 'PlainText',
        value: 'いらっしゃいませ。',
    });
}
