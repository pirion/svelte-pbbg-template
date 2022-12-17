const { StateCollection } = require("../StateCollection");


let n=0;
let UpdateState = (user, type="auto") => {
    StateCollection.EmitWithoutAck(user, '/client/update/state', {'n': `testing-${n++}-${type}`});
}


async function DefaultSocketRouter(socket, io) {

    socket.on('/server/update/state', () => {
       UpdateState(socket.user.id, 'manual');
    });

    setInterval(()=>{UpdateState(socket.user.id);}, 10000);

}

module.exports = DefaultSocketRouter;


