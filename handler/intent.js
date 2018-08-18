"use strict";

const debug = require("debug")("clova:handler");
const cache = require("memory-cache");
const flex = require("../lib/flex");

// Setup SDK for Messaging API
/*
const bot_sdk = require("@line/bot-sdk");
const bot = new bot_sdk.Client({
    channelAccessToken: process.env.BOT_ACCESS_TOKEN,
    channelSecret: process.env.BOT_CHANNEL_SECRET
});

// Setup SDK for Pay
const pay_sdk = require("line-pay");
const pay = new pay_sdk({
    channelId: process.env.PAY_CHANNEL_ID,
    channelSecret: process.env.PAY_CHANNEL_SECRET,
    isSandbox: true
});
*/

module.exports = async (h) => {
    /**
    Define required parameters.
    */
    const params = {
        menu: {
            message: "メニューはどうしましょう？"
        },
        quantity: {
            message: "何個ですか？"
        }
    };

    /**
    Initiate context. Context is the memory of this conversation. Storing parameters confirmed or to confirm from user.
    @typedef {Object} context
    @prop {Array.<String>} to_confirm - List of parameters we need to confirm to acomplish this intent.
    @prop {Object} confirmed - Store confirmed parameter.
    */
    let context = cache.get(h.getSessionId());
    if (!context){
        context = {
            to_confirm: [],
            confirmed: {}
        }

        for (let param_key of Object.keys(params)){
            context.to_confirm.push(param_key);
        }
    }
    debug(`Currnet context follows.`);
    debug(context);

    /**
    Apply slots to parameters.
    */
    if (context.to_confirm.length > 0){
        const slots = h.getSlots();
        debug(`Received slots follows.`);
        debug(slots);

        let applied_param_keys = [];
        let index = 0;
        for (let slot_key of Object.keys(slots)){
            let applicable_param_key = context.to_confirm.find(param_key => param_key === slot_key);
            if (applicable_param_key){
                debug(`Add ${applicable_param_key} to confirmed.`);
                context.confirmed[applicable_param_key] = slots[slot_key];
                applied_param_keys.push(applicable_param_key);
            }
            index++;
        }

        let updated_to_confirm = [];
        for (let param of context.to_confirm){
            if (!applied_param_keys.includes(param)){
                updated_to_confirm.push(param);
            }
        }
        context.to_confirm = updated_to_confirm;
        debug(`Now to_confirm is ${JSON.stringify(context.to_confirm)}`);
    }

    /**
    Confirm parameters if we have.
    */
    if (context.to_confirm.length > 0){
        debug(`Going to collect ${context.to_confirm[0]}.`);
        h.setSimpleSpeech({
            lang: "ja",
            type: "PlainText",
            value: params[context.to_confirm[0]].message
        });

        debug(`Context follows.`);
        debug(context);
        cache.put(h.getSessionId(), context);
        return;
    }

    /**
    Take final action if all parameters are set.
    */
    debug(`All params have been filled. Going to take final action..`);
    // Reply via clova.
    h.setSimpleSpeech({
        lang: "ja",
        type: "PlainText",
        value: `${context.confirmed.menu}を${context.confirmed.quantity}個ですね。すぐにお届けします。家どこか知らんけど（笑`
    });

    /*
    // Reserve payment using Pay API.
    let reserve_option = {
        productName: `お好み焼`,
        amount: 600, // Should be set dynamically.
        currency: "JPY",
        orderId: `${h.getSessionId()}`,
        confirmUrl: process.env.PAY_CONFIRM_URL,
        confirmUrlType: "SERVER",
    }
    let reservation = await pay.reserve(reserve_option);
    cache.put(reservation.orderId, reservation);

    // Send message via chatbot.
    let pay_message = flex.pay_message({payment_url: reservation.info.paymentUrl.web});
    await bot.pushMessage(h.requestObject.session.user.userId, pay_message);
    */
    h.endSession();
}
