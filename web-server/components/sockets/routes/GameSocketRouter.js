
let rooms = [];

let findRoomByUserId= (user_id) =>  {
    return rooms.find(room => room.members.find(member => member.user_id == user_id) != null);
}
let findRoomById = (room_id) => {
    return rooms.find(room => room.id == room_id);
}

const SocketController = require("../SocketController");
const {CombatGameRoom} = require("../../rooms/CombatGameRoom");
const GameRoomManager = require("../../rooms/GameRoomManager");

async function ConfigureChatRoutes(socket, io) {

    console.info(`⚡︎ GameSocket Initialize: ${socket.user.id} (${socket.id})`);

    let sendUpdatedUser = (global=true) => {
        let room = findRoomByUserId(socket.user.id);
        if(global) {
            SocketController.Emit(socket.user.id, 'User/Update', {user_id: socket.user.id, party: room ? room.id : null})
        }
        else {
            socket.emit('User/Update', {user_id: socket.user.id, party: room ? room.id : null})
        }
        //test
    }

    sendUpdatedUser(false);
    

    socket.on('User/CreateParty', () => {
        if(!findRoomByUserId(socket.user.id)) {
            console.log(`User room not found, creating a new room for user ${socket.user.id}.`)
            let room = new CombatGameRoom();
            room.joinRoom({name: socket.user.username, user_id: socket.user.id})
            rooms.push(room);
            sendUpdatedUser();
        } else {
            console.log(`User room found, no action for user ${socket.user.id}.`)
        }
    })

    socket.on('User/JoinParty', ({party_id}) => {
        if(!findRoomByUserId(socket.user.id)) {
            console.log(`User room not found, adding to existing room for user ${socket.user.id}.`)
            let room = findRoomById(party_id)
            console.log(room); 
            room.joinRoom({name: socket.user.username, user_id: socket.user.id})
            sendUpdatedUser();
        } else {
            console.log(`User room found, no action for user ${socket.user.id}.`)
        }
    })

    socket.on('User/LeaveParty', () => {
        let room = findRoomByUserId(socket.user.id)
        if(room) {
            room.leaveRoom(socket.user.id);
            sendUpdatedUser();
        }
    })

    socket.on('Party/List', (acknowledgement) => {
        let success = false;
        let payload = {};

        try {
            payload.parties = GameRoomManager.rooms.filter(item => item.state.phase != 'inactive');
            success = true;
        }
        catch {
            success = false;
        }

        acknowledgement({
            success,
            payload
        });
    });

    socket.on('/profile', (acknowledgement) => {
        let success = false;
        let payload = {};

        try {
            payload = {};
            success = true;
        }
        catch {
            success = false;
        }

        acknowledgement({
            success,
            payload
        });
    });

    socket.on('/profile/create', (acknowledgement) => {
        let success = false;
        let payload = {};

        try {
            payload = {};
            success = true;
        }
        catch {
            success = false;
        }

        acknowledgement({
            success,
            payload
        });
    });

}

module.exports = ConfigureChatRoutes;



