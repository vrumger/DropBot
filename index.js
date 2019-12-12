require('dotenv').config();

const tmi = require('tmi.js');

const { TWITCH_USERNAME, TWITCH_PASSWORD, INTERVAL } = process.env;
const interval = INTERVAL || 30000; // 30 seconds
const channel = '#CodingGarden';

const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true,
    },
    identity: {
        username: TWITCH_USERNAME,
        password: TWITCH_PASSWORD,
    },
    channels: [channel],
});

client.connect();

let intervalId = null;

client.on('message', async (channel, tags, message, self) => {
    if (
        tags.username === TWITCH_USERNAME.toLowerCase() &&
        message.startsWith(`!drop `)
    ) {
        switch (true) {
            case message.endsWith(' start'):
                if (intervalId === null) {
                    intervalId = setInterval(() => {
                        client.say(channel, '!drop me');
                    }, interval);
                }
                break;

            case message.endsWith(' stop'):
                if (intervalId !== null) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
                break;
        }
    }
});

console.log('Bot started...');
