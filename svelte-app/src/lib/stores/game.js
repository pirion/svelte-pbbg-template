import { writable } from "svelte/store";

export const actions = writable({});
export const user = writable({});

class GameStoreController {
    connectedSocket = null;

    async register(socket) {
        this.connectedSocket = socket;
        socket.on(`UpdateUserData`, (data) => SetUserData(data));
    }

    async isSocketConnected() {
        return this.connectedSocket && this.connectedSocket.connected
    }
    
    async setActionData(actionData) {
        actions.set(actionData);
    }
    
    async setUserData(userData) {
        user.set(userData);
    }
    
    async sendAction(action, component) {
        if(this.isSocketConnected()) {
            this.connectedSocket.emit(`SendAction`, {action, component}, (status) => console.log(status));
        }
    }
}

export const GameStore = new GameStoreController();