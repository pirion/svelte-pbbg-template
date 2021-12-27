import { writable } from "svelte/store";

export const messages = writable([]);

class ChatStoreController {
    connectedSocket = null;

    async register(socket) {
        this.connectedSocket = socket;
        socket.on(`ChatMessage`, (data) => this.appendMessage(data));
    }

    async isSocketConnected() {
        return this.connectedSocket && this.connectedSocket.connected
    }
    
    async appendMessage(message) {
        messages.update(value => {
            let result = [message, ...value];
            while(result.length > 100) {
                result.pop();
            }
            return result;
        });
    }

    async sendMessage(channel, content) {
        if(this.isSocketConnected()) {
            this.connectedSocket.emit(`SendChatMessage`, {channel, content});
        }
    }
}

export const ChatStore = new ChatStoreController();