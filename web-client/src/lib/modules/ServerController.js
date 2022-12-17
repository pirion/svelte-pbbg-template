class ServerController {

    socket;
    token;

    setAuthenticationToken(token) {
        this.token = token;
    }

    async isConnected() {

        if(this.socket && this.socket.connected) {
            return true;
        }

        return await this.connect();
    }

    
    async connect() {

        return new Promise((resolve, reject) => {
            let complete = false;
            
            let completePromise = (status) => {
                if(!complete) {
                    complete = true;
                    resolve(status);
                }
            }

            if(this.socket && this.socket.connected) {
                completePromise(false);
            }

            else {
                this.socket = io.connect(`${window.location.origin}`, {path: "/server/socket.io/", transports: ["websocket"], query: {token: this.token}});
    
                //get the connection attempt or error
                this.socket.once('connect', () => completePromise(true));
                this.socket.once('connect_error', () => completePromise(false));
            }

        });
    }



    async LoadParties() {
        try {
            let response = await Server.EmitWithAck(`/server/parties/get`); 
            console.log(response);
            if(response.success) {
                parties.update(value => value = response.payload.parties);
            }
        }
        catch {
        }
    }

    async EmitWithAck(...args) {
        return new Promise((resolve, reject) => {
            
            let acknowledgement = (error, response) => {
                if(error) {
                    reject({success: false, error: error});
                }
                else {
                    resolve(response);
                }
            }

            this.socket.timeout(5000).emit(...args, acknowledgement);
        });
    }

    async EmitWithoutAck(...args) {
        this.socket.emit(...args);
    }



}

export const Server = new ServerController();