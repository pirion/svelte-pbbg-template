

const {GameRoom} = require("./GameRoom");
const SocketController = require('../sockets/SocketController');

class CombatGameRoom extends GameRoom {

    combatant_id = 0;
    player_id = 0;
    constructor(...args) {
        super(...args);
        this.state.players = [];
    }

    joinRoom(...args) {
        super.joinRoom(...args);
        console.log(args);
        let player = {};
        player.combatant_id = ++this.combatant_id;
        player.user_id = args[0].user_id;
        player.name = `P${++this.player_id} (${args[0].user_id})`
        player.tag = `P${this.player_id}`
        player.health = {value: 10, max: 10}
        player.mana = {value: 10, max: 10}
        player.experience = {value: 0, max: 100}
        player.stats = {strength: 1, speed: 6}
        player.last_tick = 0;
        player.team = 1;
        this.state.players.push(player);
    }

    leaveRoom(...args) {
        super.leaveRoom(...args);

    }

    doTick(tick_id) {
        if(!super.doTick(tick_id)) {
            return false;
        }

        if(this.state.phase.value == 'combat') {

            let actor = this.state.combat.turns.pop();
            this.sendCombatMesage(`${actor.tag} is the current actor.`);
            let actor_combatant = this.state.combat.combatants.find(item => item.combatant_id == actor.combatant_id);
            actor_combatant.last_tick = actor.tick;
            this.state.combat.tick = actor.tick;

            let opponents = this.state.combat.combatants.filter(item => item.team != actor.team && item.health.value > 0);
            let selected = Math.floor(Math.random() * opponents.length);
            let selected_combatant = this.state.combat.combatants.find(item => item.combatant_id == opponents[selected].combatant_id);
            

            
            selected_combatant.health.value -= actor_combatant.stats.strength;
    
            //after combat damage phase
            if(selected_combatant.health.value <= 0) {
                this.sendCombatMesage(`${selected_combatant.name} has been killed.`);
                if(selected_combatant.team==2) {
                    this.state.combat.rewards.experience += 2;
                }
                this.calculateTurnOrder();
            }

            if(this.state.combat.turns.length < 10) {
                this.calculateTurnOrder();
            }
                
            //after combat phase
            for(var i=0; i<this.state.combat.combatants.length; i++) {
                this.state.combat.combatants[i].health.value = Math.min(Math.max(this.state.combat.combatants[i].health.value, 0), this.state.combat.combatants[i].health.max)
            }

            //combat completed
            if(this.state.combat.combatants.filter(item => item.team == 2 && item.health.value > 0).length == 0) {
                this.setPhase('fanfare', tick_id + 5);
                let experience = this.state.combat.rewards.experience;
                this.distributeCombatReward({experience});
            }
            else if(this.state.combat.combatants.filter(item => item.team == 1 && item.health.value > 0).length == 0) {
                this.setPhase('defeat', tick_id + 20);
                this.sendCombatMesage(`Your combat has ended. You wake up in a unfamilar place.`);
            }
        }

        if(this.state.phase.value == 'idle') {
            this.setPhase('combat');
            let combat = {rewards: {experience: 0}, enemies: [], tick: 0};

            for(var i=0; i<this.state.players.length; i++) {
                this.state.players[i].health.value = this.state.players[i].health.max;
                this.state.players[i].mana.value = this.state.players[i].mana.max;
                this.state.players[i].last_tick = 0;
            }
            
            let s = Math.floor(Math.random() * 11)
            for(var i=0; i<=s; i++) {
                let enemy = {};
                enemy.combatant_id = ++this.combatant_id;
                enemy.tag = `E${i+1}`
                enemy.name = `Enemy-${i+1}`
                enemy.health = {};
                enemy.health.value = 10;
                enemy.health.max = 10;
                enemy.stats = {strength: 1, speed: 5 + Math.floor(Math.random() * 3)};
                enemy.last_tick = 0;
                enemy.team = 2;
                combat.enemies.push(enemy);
            }

            this.state.combat = combat;
            this.state.combat.combatants = [...this.state.combat.enemies, ...this.state.players];
            this.calculateTurnOrder();
            this.sendCombatMesage(`You've encounted an enemy.`);
        }

        this.sendUpdatedStats();
    }

    calculateTurnOrder() {
        let combatants = this.state.combat.combatants.filter(combatant => combatant.health.value != 0);
        let current_tick = this.state.combat.tick;
        let turns = []
        for(var i=0; i<combatants.length; i++) {
            combatants[i].next_tick = combatants[i].last_tick;
        }
        while(turns.length < 50) {
            for(var i=0; i<combatants.length; i++) {
                if(combatants[i].next_tick + (250-combatants[i].stats.speed) < current_tick) {
                    turns.push({combatant_id: combatants[i].combatant_id, tag: combatants[i].tag, team: combatants[i].team, tick: current_tick});
                    combatants[i].next_tick = current_tick;
                } 
            }
            current_tick++;
        }
        console.log(turns);
        this.state.combat.turns = turns;
    }

    distributeCombatReward({experience}) {
        for(var i=0; i<this.state.players.length; i++) {
            if(this.state.combat.combatants.find(item => item.combatant_id == this.state.players[i].combatant_id && item.team == 1 && item.health.value > 0) != null) {
                this.state.players[i].experience.value += experience;
                if(this.state.players[i].experience.value >= this.state.players[i].experience.max) {
                    this.state.players[i].experience.value = 0;
                    this.state.players[i].experience.max = Math.ceil(1.5 * this.state.players[i].experience.max);
                    this.state.players[i].stats.strength += 1;
                    this.sendCombatMesage(`${this.state.players[i].name} gained a level.`);
                }
            }
        }
    }

    sendCombatMesage(message) {
        this.emit('ChatMessage', {timestamp: `${(new Date()).toISOString()}`, user: {id: '', username: 'SYSTEM'}, channel: 'Combat', content: message});
    }

    sendUpdatedStats() {
        this.emit('Combat/Update', {player: !this.state.combat ? [] : this.state.combat.combatants.filter(item => item.team==1), enemy: !this.state.combat ? [] : this.state.combat.combatants.filter(item => item.team==2)});
    }

}

module.exports = {
    CombatGameRoom
}