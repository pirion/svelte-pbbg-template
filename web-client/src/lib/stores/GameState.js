import { writable, get } from "svelte/store";
import { Server } from "../modules/ServerController";
import { LocalStateStore } from "./LocalState";
import { ServerStateStore } from "./ServerState";


export const GameState = writable({state: 'LOADING'});

class GameStoreController {
    context;

    async onMount(context) {
        this.context = context;

        if(!context.authenticated) {
            return;
        }

        Server.setAuthenticationToken(this.context.token);

        if(await Server.isConnected()) {
            console.info(`Client has successfully connected to the server.`)
            LocalStateStore.onMount();
            ServerStateStore.onMount();
            this.SetState('state', 'CONNECTED');
        }
        else {
            this.SetState('state', 'ERROR');
        }
    }

    async onDestory() {

    }

    SetState(key, value) {
        GameState.update(state => {
            state[key] = value;
            return state;
        });
    }

    GetState() {
        return get(GameState);
    }
    
}

export const GameStore = new GameStoreController();