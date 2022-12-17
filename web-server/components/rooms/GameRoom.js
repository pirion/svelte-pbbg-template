const shortid = require('shortid');
const GameRoomManager = require('./GameRoomManager');
const SocketController = require('../sockets/SocketController');

class GameRoom {

    members = [];
    last_tick = 0;
    tick_duration = 1;

    state = {phase: {value: 'inactive', expires: 0}};

    constructor() {
        this.id = shortid.generate()
        this.public = false;
        GameRoomManager.Register(this);
    }

    /** This is only called via script. If collected by node garbage collector this will not run. */
    deconstructor() {
        GameRoomManager.Unregister(this)
    }

    doTick(tick_id) {

        if(this.state != 'inactive' && tick_id >= this.last_tick + this.tick_duration) {
          this.last_tick = tick_id;

          if(this.state.phase.expires && this.state.phase.expires <= tick_id) {
            this.setPhase('idle');
          }

          return true;
        }
        return false;
    }

    setPhase(phase, expires=null) {
      this.state.phase = {value: phase, expires: expires};
    }

    joinRoom(user) {
        this.members.push(user);
        if(this.members.length > 0 && this.state.phase.value == 'inactive') {
            this.setPhase('idle');
        }
        return true;
    }

    leaveRoom(user_id) {
        this.members = this.members.filter(i => i.user_id != user_id);
        if(this.members.length == 0) {
            this.setPhase('inactive');
        }
        return true;
    }

    emit(event, payload) {
      this.members.forEach(member => SocketController.Emit(member.user_id, event, payload));
    }
}

module.exports = {
    GameRoom
}