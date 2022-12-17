class SocketServerHandle {

    handle

    SetSocketServerHandle(handle) {
        this.handle = handle
    }

    io() {
        return this.handle;
    }

}

module.exports = new SocketServerHandle()