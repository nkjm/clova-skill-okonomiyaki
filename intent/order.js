"use strict";

const debug = require("debug")("clova:intent");
const cache = require("memory-cache");

module.exports = (h) => {
    const params = {
        menu: {
            message: "メニューはどうしましょう？"
        },
        quantity: {
            message: "何個ですか？"
        }
    };

    let context = cache.get(h.getSessionId());
    debug(`Currnet context follows.`);
    debug(context);

    // Initiate context
    if (!context){
        context = {
            to_confirm: [],
            confirming: null,
            confirmed: {}
        }

        for (let param_key of Object.keys(params)){
            context.to_confirm.push(param_key);
        }
    }

    const slots = h.getSlots();
    debug(`Received slots follows.`);
    debug(slots);

    // Apply parameters
    let index = 0;
    if (context.to_confirm.length > 0){
        for (let slot_key of Object.keys(slots)){
            let applicable_param_key = context.to_confirm.find(param_key => param_key === slot_key);
            if (applicable_param){
                debug(`Add ${applicable_param_key} to confirmed.`);
                context.confirmed[applicable_param_key] = slots[slot_key];
                debug(`Removing ${applicable_param_key} from to_confirm.`);
                context.to_confirm.splice(index, 1);
                debug(`Now to_confirm is ${JSON.stringify(context.to_confirm)}.`);
            }
        }
        index++;
    }

    // Collect slot or finish
    if (context.to_confirm.length > 0){
        debug(`Going to collect ${context.to_confirm[0]}.`);
        h.setSimpleSpeech({
            lang: "ja",
            type: "PlainText",
            value: params[context.to_confirm[0]].message
        });
    } else {
        debug(`All params have been filled. Going to take final action..`);
        h.setSimpleSpeech({
            lang: "ja",
            type: "PlainText",
            value: `${context.confirmed.menu}を${context.confirmed.quantity}個ですね。すぐにお届けします。家どこか知らんけど（笑`
        });
    }

    debug(`Context follows.`);
    debug(context);
    cache.put(h.getSessionId(), context);
}
