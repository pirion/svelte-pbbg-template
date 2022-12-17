const SocketServerHandle = require("./SocketServerHandle");

class StateController {
    user;
    state = {};
    sockets = [];
    rooms = [];

    constructor(user, socket) {
        this.user = user;
        this.JoinRoom(`**/players/**::${this.user}`);
        this.AddSocketConnection(socket);
    }

    AddSocketConnection(socket) {
        let found = this.sockets.find(instance => socket.id == instance.id);
        if(!found) {
            this.sockets.push(socket);
            this.rooms.forEach(instance => {socket.join(instance)});
        }
    }

    RemoveSocketConnection(socket) {
        let found = this.sockets.find(instance => socket.id == instance.id);
        if(found) {
            this.sockets = this.sockets.filter(instance => socket.id != instance.id);
            this.rooms.forEach(instance => socket.leave(instance));
        }
    }

    JoinRoom(room) {
        let found = this.rooms.find(instance => room == instance);
        if(!found) {
            this.rooms.push(room);
            this.sockets.forEach(instance => instance.join(room));
        }
    }

    LeaveRoom(room) {
        let found = this.rooms.find(instance => room == instance);
        if(!found) {
            this.rooms = this.rooms.filter(instance => room != instance);
            this.sockets.forEach(instance => instance.leave(room));
        }
    }

    async EmitWithoutAck(...args) {
        SocketServerHandle.io().to(`**/players/**::${this.user}`).emit(...args);
    }
}

module.exports = StateController;