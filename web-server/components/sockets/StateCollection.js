const StateController = require("./StateController");

class StateCollection {

    collection = [];

    async AddSocketConnection(user, socket) {
        if(!this.collection[user]) {
            let instance = new StateController(user, socket);
            this.collection[user] = instance;
        }
        else {
            this.collection[user].AddSocketConnection(socket);
        }
    }

    async RemoveSocketConnection(user, socket) {
        if(this.collection[user]) {
            this.collection[user].RemoveSocketConnection(socket);
        }
    }

    async EmitWithoutAck(user, ...args) {
        if(this.collection[user]) {
            this.collection[user].EmitWithoutAck(...args);
        }
    }

    async GetController(user) {
        return this.collection[user];
    }

}

module.exports = {
    StateCollection: new StateCollection()
}