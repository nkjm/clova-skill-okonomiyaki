"use strict";

const debug = require("debug")("clova:*");

module.exports = (h) => {
    const params = [{
        name: "menu",
        message: "メニューはどうしましょう？"
    },{
        name: "quantity",
        message: "何個ですか？"
    }];

    const slots = h.getSlots();

    debug(slots);

    for (let p of params){
        for (let slot_name of Object.keys(slots)){
            if (p.name === slot_name){
                debug(`${p.name} has been filled.`);
                p.value = slots[slot_name];
            } else {
                debug(`Going to collect ${p.name}.`);
                h.setSimpleSpeech({
                    lang: "ja",
                    type: "PlainText",
                    value: p.message,
                });
            }
        }
    }
}
