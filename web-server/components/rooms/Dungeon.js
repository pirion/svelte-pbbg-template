

Math.getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

Math.pick = (elements) => { 
    if(elements.length===0) return null
    return elements[Math.getRandomInt(0, elements.length-1)];
}

const DIRECTION = {
    NORTH: 1,
    EAST: 2,
    SOUTH: 4,
    WEST: 8
}

class DungeonRoom {
    constructor(x, y, width, height, region) {
        this.x1 = x
        this.x2 = x+width
        this.y1 = y-height
        this.y2 = y
        this.region = region;
    }
  
    overlaps(other) {
        return !(this.x1-1  > other.x2 ||
                    other.x1 > this.x2  ||
                    this.y1-1  > other.y2 ||
                    other.y1 > this.y2  );
    }

    inBounds(x, y) {
        return this.x1 > 0 && this.x2 <= x 
                && this.y1 > 0 && this.y2 <= y
    }

    hasPoint(x, y) {
        return this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2
    }
}

class DungeonFloorGenerator {
    region = 1;
    floorplan = [];
    rooms = [];

    constructor(height, width, settings) {
        this.height = height;
        this.width = width;
        this.settings = settings;


        //initialize floor
        for(let x=0; x<=this.width; x++) {
            this.floorplan[x] = [];
            for(let y=0; y<=this.height; y++)
            {
                this.floorplan[x][y] = 0;
            }
        }

        this._carveVoid();
        this._carveRooms();
        this._carvePaths();
        this._connectRegions();
        this._fillEnds();
    }

    _carveVoid() {
        if(this.settings.shape) {
            //do something here to apply shape
        }
    }

    _carveRooms() {
        const MIN_ROOM_WIDTH = this.settings.rooms.min_width;
        const MAX_ROOM_WIDTH = this.settings.rooms.max_width;
        const MIN_ROOM_HEIGHT = this.settings.rooms.min_height;
        const MAX_ROOM_HEIGHT = this.settings.rooms.max_height;

        let pickRoomAxisX = () => {
            return Math.getRandomInt(0, Math.floor(this.width/2)) * 2
        }
        
        let pickRoomAxisY = () => {
            return Math.getRandomInt(0, Math.floor(this.height/2)) * 2
        }

        let pickRoomWidth = () => {
            return Math.getRandomInt(MIN_ROOM_WIDTH, MAX_ROOM_WIDTH) * 2
        }
        
        let pickRoomHeight = () => {
            return Math.getRandomInt(MIN_ROOM_HEIGHT, MAX_ROOM_HEIGHT) * 2
        }

        let addRoom = (candidate) => {
            if(candidate.x1 < 0
                || candidate.x2 >= this.width
                || candidate.y1 < 0
                || candidate.y2 >= this.height) {
                return false;
            }

            let overlap = this.rooms.filter(room => room.overlaps(candidate) == 1)
            if(overlap.length === 0) {
                if(!this.entrypoint) {
                    this.entrypoint = candidate;
                }

                for(let x=candidate.x1; x<=candidate.x2; x++) {
                    for(let y=candidate.y1; y<=candidate.y2; y++) {
                        this.floorplan[x][y] = candidate.region;
                    }   
                }
                this.rooms.push(candidate);
            }
        }

        if(!this.settings.spawn.random) {
            let room = new DungeonRoom(spawn.x, spawn.y, spawn.width, spawn.height, this.region++);
            addRoom(room);
        }
        else {
            let room = new DungeonRoom(pickRoomAxisX(), pickRoomAxisY(), pickRoomWidth(), pickRoomHeight(), this.region++);
            addRoom(room);
        }

        for(var c=0; c<=this.settings.roomAttempts; c++) {
            let room = new DungeonRoom(pickRoomAxisX(), pickRoomAxisY(), pickRoomWidth(), pickRoomHeight(), this.region++);
            addRoom(room);
        }
    }

    _checkNeighborTile(x, y) {
        let cell = {
            x,
            y,
            region: this.floorplan[x][y],
            connections: [],
            open: []
        }

        if(y+2 < this.height) {
            if(this.floorplan[x][y+2] != 0) {
                cell.connections.push(this.floorplan[x][y+2]);
            } else {
                cell.open.push(DIRECTION.NORTH);
            }
        }
        
        if(x+2 < this.width) {
            if(this.floorplan[x+2][y] != 0) {
                cell.connections.push(this.floorplan[x+2][y]);
            } else {
                cell.open.push(DIRECTION.EAST);
            }
        } 
        
        if(y-2 >= 0) {
            if(this.floorplan[x][y-2] != 0) {
                cell.connections.push(this.floorplan[x][y-2]);
            } else {
                cell.open.push(DIRECTION.SOUTH);
            }
        } 
        
        if(x-2 >= 0) {
            if(this.floorplan[x-2][y] != 0) {
                cell.connections.push(this.floorplan[x-2][y]);
            } else {
                cell.open.push(DIRECTION.WEST);
            }
        } 

        return cell;
    }

    _checkNeighborLink(x, y) {
        let cell = {
            x,
            y,
            region: this.floorplan[x][y],
            connections: [],
            connectedCell: []
        }
        
        if(y+1 < this.height 
            && this.floorplan[x][y+1] != 0 ) {
            cell.connections.push(this.floorplan[x][y+1]);
            cell.connectedCell.push({x: x, y: y+1});
        }
        
        if(y-1 >= 0 
            && this.floorplan[x][y-1] != 0 ) {
            cell.connections.push(this.floorplan[x][y-1]);
            cell.connectedCell.push({x: x, y: y-1});
        }
        
        if(x+1 < this.width 
            && this.floorplan[x+1][y] != 0 ) {
            cell.connections.push(this.floorplan[x+1][y]);
            cell.connectedCell.push({x: x+1, y: y});
        }
        
        if(x-1 >= 0
            && this.floorplan[x-1][y] != 0 ) {
            cell.connections.push(this.floorplan[x-1][y]);
            cell.connectedCell.push({x: x-1, y: y});

        }

        return cell;
    }

    _carvePaths() {
        for (let x=0; x<=this.width; x+=2) {
            for (let y=0; y<=this.height; y+=2) {
                if(this.floorplan[x][y] > 0) continue
                this._carvePath(x, y);
            }
        }
    }

    _carvePath(x, y) {
        let region = this.region++;
        let cells = [];
        cells.push({x, y});
        this.floorplan[x][y] = region;

        let lastDirection = null;

        while(cells.length>0) {
            let cell = cells.pop();
            let links = this._checkNeighborTile(cell.x, cell.y);
            if(links.open.length > 0) {
                let x = cell.x;
                let y = cell.y;
                let nextDirection = null;
                let hasLastDirection = links.open.find(element => element === lastDirection)
                if(hasLastDirection && Math.random() < this.settings.straightPathChance) {
                    nextDirection = lastDirection;
                }
                else {
                    nextDirection = Math.pick(links.open);
                    lastDirection = nextDirection;
                }

                if(nextDirection === DIRECTION.NORTH) {
                    this.floorplan[x][y+1] = region;
                    this.floorplan[x][y+2] = region;
                    cells.push({x: x, y: y+2});
                }
                else if(nextDirection === DIRECTION.EAST) {
                    this.floorplan[x+1][y] = region;
                    this.floorplan[x+2][y] = region;
                    cells.push({x: x+2, y: y});
                    
                }
                else if(nextDirection === DIRECTION.SOUTH) {
                    this.floorplan[x][y-1] = region;
                    this.floorplan[x][y-2] = region;
                    cells.push({x: x, y: y-2});
                    
                }
                else if(nextDirection === DIRECTION.WEST) {
                    this.floorplan[x-1][y] = region;
                    this.floorplan[x-2][y] = region;
                    cells.push({x: x-2, y: y});
                }

                if(links.open.length > 1) {
                    cells.push(cell);
                }
            }
        }
    }

    _connectRegions() {
        let allRegions = [];
        let connections = [];
        let connectedRegions = [];

        for(let x=0; x<this.width; x++) {
            for(let y=0; y<this.height; y++) {
                if(this.floorplan[x][y] === 0) {
                    let link = this._checkNeighborLink(x, y);
                    if(link.connections.length === 2) {
                        connections.push(link);
                    }
                }
                else if(!allRegions.find(element => element === this.floorplan[x][y])) {
                    allRegions.push(this.floorplan[x][y]);
                }
            }
        }

        connectedRegions.push(this.entrypoint.region);

        while(connectedRegions.length < allRegions.length) {
            let neighborConnections = connections.filter(conn => conn.connections.filter(element => connectedRegions.find(item => element === item)).length === 1)
            let selectedConnection = Math.pick(neighborConnections);
            let selectedRegion = selectedConnection.connections.find(element => !connectedRegions.find(region => region === element))
            let scopedConnections =  neighborConnections.filter(conn => conn.connections.filter(element => element === selectedRegion).length == 1)
            let doors = 1;
            let roll = Math.random();
            doors += roll > 0.25 ? 1 : 0;
            doors += roll > 0.50 ? 1 : 0;
            doors += roll > 0.75 ? 1 : 0;
            console.log(doors)
            for(let d=0; d<doors; d++) {
                console.log(d)
                let newDoor = Math.pick(scopedConnections);
                this.floorplan[newDoor.x][newDoor.y] = selectedRegion;
            }
            connectedRegions.push(selectedRegion)
        }
    }

    _fillEnds() {
        let endpoints = []
        
        for(let x=0; x<this.width; x++) {
            for(let y=0; y<this.height; y++) {
                if(this.floorplan[x][y] != 0) {
                    let link = this._checkNeighborLink(x, y);
                    if(link.connections.length === 1) {
                        endpoints.push(link);
                    }
                }
            }
        }

        while(endpoints.length > 0) {
            let endpoint = endpoints.pop() 
            if(Math.random() >= this.settings.deadEndChance) {
                this.floorplan[endpoint.x][endpoint.y] = 0;
                let next = endpoint.connectedCell[0]
                let link = this._checkNeighborLink(next.x, next.y);
                
                if(link.connectedCell.length === 1) {
                    endpoints.push(link)
                }
            }
        }
    }
}


let generator = new DungeonFloorGenerator(101, 101, {shape: 0, roomAttempts: 50, spawn: {random: true}, rooms: {min_width: 2, max_width: 6, min_height: 2, max_height: 6}, deadEndChance: 0.05, straightPathChance: 0.30});
console.log(JSON.stringify(generator.floorplan));
