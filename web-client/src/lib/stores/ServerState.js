import { writable, get } from "svelte/store";
import { Server } from "../modules/ServerController";

export const ServerState = writable({});

class ServerStateStoreController {

    async onMount() {
        this.LoadState();
        Server.socket.on('/client/update/state', ServerState.set);
    }

    async onDestory() {
    }

    async LoadState() {
    }

    async GetState() {
        return get(ServerState);
    }

    async stateUpdate() {
        Server.EmitWithoutAck('/server/update/state');
    }
}

export const ServerStateStore = new ServerStateStoreController();