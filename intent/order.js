"use strict";

const debug = require("debug")("clova:intent");
const cache = require("memory-cache");

module.exports = (h) => {
    const memory = cache.get(h.getSessionId());

    debug(memory);

    let params;

    if (memory){
        params = memory;
    } else {
        params = [{
            name: "menu",
            message: "メニューはどうしましょう？"
        },{
            name: "quantity",
            message: "何個ですか？"
        }];
    }

    const slots = h.getSlots();

    debug(slots);

    for (let p of params){
        for (let slot_name of Object.keys(slots)){
            if (p.name === slot_name){
                debug(`${p.name} has been filled.`);
                p.value = slots[slot_name];
            }
        }
    }

    let complete = true;

    for (let p of params){
        if (!p.value){
            complete = false;
            debug(`Going to collect ${p.name}.`);
            h.setSimpleSpeech({
                lang: "ja",
                type: "PlainText",
                value: p.message
            });
            break;
        }
    }

    if (complete){
        h.setSimpleSpeech({
            lang: "ja",
            type: "PlainText",
            value: "了解しました。"
        });
    }

    cache.put(h.getSessionId(), params);
}
