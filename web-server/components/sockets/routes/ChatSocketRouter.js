
async function ConfigureChatRoutes(socket, io) {

    socket.on('SendChatMessage', (data) => {
        io.emit('ChatMessage', {timestamp: `${(new Date()).toISOString()}`, user: {id: socket.user.id, username: socket.user.username}, channel: data.channel, content: data.content});
    });
}

module.exports = ConfigureChatRoutes;