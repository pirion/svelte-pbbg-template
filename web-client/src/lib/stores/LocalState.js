import { writable, get} from "svelte/store";


export const LocalState = writable({});

class LocalStateStoreController {

    async onMount() {
    }

    async onDestroy() {
    }

    SetState(key, value) {
        LocalState.update(state => {
            state[key] = value;
            return state;
        });
    }

    GetState() {
        return get(LocalState);
    }
}

export const LocalStateStore = new LocalStateStoreController();