"use strict";

require("dotenv").config();

const express = require("express");
const server = express();
const debug = require("debug")("clova:*");
const clova = require("@line/clova-cek-sdk-nodejs");
const launch_handler = require("./handler/launch");
const intent_handler = require("./handler/intent");
const session_end_handler = require("./handler/session_end");

// Setup SDK for Pay
const pay_sdk = require("line-pay");
const pay = new pay_sdk({
    channelId: process.env.PAY_CHANNEL_ID,
    channelSecret: process.env.PAY_CHANNEL_SECRET,
    isSandbox: true
});

server.listen(process.env.PORT || 5000, () => {
    console.log("Server is running...");
});

const handler = clova.Client
.configureSkill()
.onLaunchRequest(launch_handler)
.onIntentRequest(intent_handler)
.onSessionEndedRequest(session_end_handler)
.handle();

const clovaMiddleware = clova.Middleware({ applicationId: process.env.CLOVA_APP_ID });

/**
Router configuration
*/
server.post('/clova/webhook', clovaMiddleware, handler);

server.get('/pay/confirm', (req, res, next) => {
    if (!req.query.transactionId || !req.query.orderId){
        // Required query string not found.
        return res.sendStatus(400);
    }

    // Get reserved info
    let order;
    debug(`Transaction Id is ${req.query.transactionId}`);
    debug(`Order Id is ${req.query.orderId}`);

    // Get reservation from db.
    let reservation = cache.get(req.query.orderId);

    // Confirm & Capture the payment.
    debug(`Going to confirm/capture payment of following reservation..`);
    debug(reservation);

    return pay.confirm({
        transactionId: req.query.transactionId,
        amount: reservation.amount,
        currency: reservation.currency
    }).then((response) => {
        debug("Succeeed to capture payment.");
        res.sendStatus(200);
    });
});
