"use strict";

const debug = require("debug")("clova:lib");

module.exports = class LibFlex {
    /**
    @method
    @param {Object} option
    @param {String} option.payment_url
    */
    static pay_message(option){
        const o = option;

        let message = {
            type: "flex",
            altText: "お支払いをこちらからお願いします。",
            contents: {
                type: "bubble",
                body: {
                    type: "box",
                    layout: "vertical",
                    contents: [{
                        type: "text",
                        text: "お支払いをこちらからお願いします。"
                    }]
                },
                footer: {
                    type: "box",
                    layout: "horizontal",
                    spacing: "md",
                    contents: [{
                        type: "button",
                        style: "primary",
                        color: "#ff0000",
                        height: "sm",
                        action: {
                            type: "message",
                            label: "キャンセル",
                            text: "キャンセル"
                        }
                    },{
                        type: "button",
                        style: "primary",
                        height: "sm",
                        action: {
                            type: "uri",
                            label: "会計",
                            uri: o.payment_url
                        }
                    }]
                }
            }
        }

        debug(JSON.stringify(message.contents));

        return message;
    }
}
