"use strict";

require("dotenv").config();

const express = require("express");
const server = express();
const debug = require("debug")("clova:*");
const clova = require("@line/clova-cek-sdk-nodejs");
const launch_handler = require("./handler/launch");
const intent_handler = require("./handler/intent");
const session_end_handler = require("./handler/session_end");

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
