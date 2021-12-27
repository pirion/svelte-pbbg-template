
class UserSocket {
    userId = null;
    rooms = [];
    sockets = [];

    constructor(userId) {
        this.userId = userId;
        //add room for this user
        this.rooms.push(`users::${userId}`);
        
    }

    async AddSocket(socket) {
        this.sockets.push(socket);
        this.rooms.forEach(room => socket.join(room));
    }

    async RemoveSocket(socket) {
        this.sockets = this.sockets.filter(item => item.id != socket.id);
        this.rooms.forEach(room => socket.leave(room)); 
    }

    async AddSocketRoom(room) {
        this.rooms.push(room);
        this.sockets.forEach(socket => socket.join(room)); 
    }

    async RemoveSocketRoom(room) {
        this.rooms = this.rooms.filter(item => item != socket.room); 
        this.sockets.forEach(socket => socket.leave(room)); 
    }
}

module.exports = UserSocket;