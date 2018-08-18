"use strict";

const debug = require("debug")("clova:handler");

module.exports = (h) => {
    h.setSimpleSpeech({
        lang: 'ja',
        type: 'PlainText',
        value: 'いらっしゃいませ。ご注文はお決まりでしょうか？',
    });
}
