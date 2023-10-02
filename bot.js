require('dotenv').config();
const { PORT, TELEGRAM_TOKEN, SERVER_URL, TINIFY_API_KEY } = process.env;

const express = require('express');
const axios = require('axios');

// TinyPng Configuration
const tinify = require('tinify');
tinify.key = TINIFY_API_KEY;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    // ... handle the root get request
    res.send("Welcome to the bot server!");
});

const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const URI = `/webhook/${TELEGRAM_TOKEN}`;
const webhookURL = `${SERVER_URL}${URI}`;

const setupWebhook = async () => {
    try {
        const { data } = await axios.get(`${TELEGRAM_API}/setWebhook?url=${webhookURL}&drop_pending_updates=true`);
        console.log(data);
    } catch (error) {
        console.error("Error setting up the webhook:", error.message);
    }
};

const compressImage = async (bufferData) => {
    try {
        const { _url } = tinify.fromBuffer(bufferData)
        return await _url
    } catch (error) {
        return error
    }
}

// NOTE: Use URI here, not URL
app.post(URI, (req, res) => {
    console.log(req.body);
    res.status(200).send('ok');
});

app.listen(PORT, async () => {
    console.log(`Server is up and Running at PORT : ${PORT}`);
    try {
        await setupWebhook();
    } catch (error) {
        console.error("Webhook setup failed:", error.message);
    }
});
