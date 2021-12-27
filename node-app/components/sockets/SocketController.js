const UserSocket = require("./UserSocket");

const userSocket = [];

async function RegisterSocket(socket) {
    let currentUserSocket = userSocket.find(item => item.userId == socket.user.id);
    if(!currentUserSocket) {
        currentUserSocket = new UserSocket(socket.user.id);
        userSocket.push(currentUserSocket);
    }
    currentUserSocket.AddSocket(socket);
}

async function UnregisterSocket(socket) {
    let currentUserSocket = userSocket.find(item => item.userId == socket.user.id);
    if(currentUserSocket) {
        currentUserSocket.RemoveSocket(socket);
    }
}

module.exports = {
    RegisterSocket,
    UnregisterSocket
}