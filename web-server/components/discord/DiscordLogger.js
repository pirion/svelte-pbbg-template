const axios = require('axios');

const DISCORD_SERVER_NAME = process.env.DISCORD_SERVER_NAME ? process.env.DISCORD_SERVER_NAME : 'NAME UNREGISTERED';
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

async function Write(content) {
    if(DISCORD_WEBHOOK) {
        axios.post(DISCORD_WEBHOOK, { username: DISCORD_SERVER_NAME, content});
    }
}

module.exports = {
    Write
}