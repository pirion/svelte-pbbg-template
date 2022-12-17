
class GameRoomManager {
    tick_id = 0;
    rooms = [];

    constructor() {
    }

    Register(room) {
        this.rooms.push(room);
    }

    Unregister(room) {
        this.rooms = this.rooms.filter(item => item.id != room.id);
    }

    Tick() {
        this.tick_id++
        this.rooms.forEach(room => room.doTick(this.tick_id));
    }
}

let instance = new GameRoomManager();

setInterval(()=>{instance.Tick();}, 1000);

module.exports = instance;