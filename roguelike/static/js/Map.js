/*
This handles level generation, and everything that persists within a level.
*/

var Map = {
    _engine: null, // stop and start this to make actors act
    _scheduler: null, // add actors to this to give them a chance to act; remove them when they die.
    _player:null,
    _level: 0,
    generateMap: function() {
        //ROT.RNG.setSeed(1407692687798);
        this.entities = {}; // this will contain all entities on the map. Not directly, but via co-ordinate objects. E.g,: this.entities["4","3"] will yield an object with all entities at x=4, y=3.
        this._scheduler = (new ROT.Scheduler.Simple());
        this._engine = new ROT.Engine(this._scheduler);
        this._grid = new ROT.Map.Digger(); // Digger is a type of ROT.js Map.
        var oDirs = ['N', 'NW', 'W', 'SW'];
        var thsDirs = ['S', 'SE', 'E', 'NE'];
        var offset = [[0, -1], [-1, -1], [-1, 0], [-1, 1]];
        var digCallback = function(x, y, value) {
            var key = x + ',' + y;
            if (value) {
                var wall = new Game.Entity({template: Game.Templates.TileTemplates.WallTile, x_coord: x, y_coord: y, kind: 'Concrete'});

                for (i = 0; i < 4; i++)
                {
                    var nCoord = (x + offset[i][0]) + ',' + (y + offset[i][1]);
                    wall.updateNeighbour(key, nCoord, oDirs[i], thsDirs[i]);
                }
            }
            else
                new Game.Entity({template: Game.Templates.TileTemplates.FloorTile, x_coord: x, y_coord: y, kind: 'Concrete'});

        };// this callback is used to build the floors and walls of the level: adds a wall if we encounter a 1; a floor if we encounter a 0. updateNeighbour() notifies a wall of its neghbours and the neighbours of that wall: this allows wall-graphics to be rendered properly.

        this._grid.create(digCallback); //callback is used here

        var setDoor = function(x, y) {
            new Game.Entity({template: Game.Templates.DoorTemplates.Door, x_coord: x, y_coord: y});
        }
        var rooms = this._grid.getRooms();
        for (var i = 0; i < rooms.length; i++) {
            rooms[i].getDoors(setDoor);

        }//we use another callback to place the doors
        this.setAllWalls();
        this.sortRooms();
    },
    /*
    A cumbersome method: interprets the contents of a wall-tile's neghbour array and assigns it the appropriate tile. Does this by handling special cases.
    */
    setWallTile: function(key) {
        var tile = this.entities[key]['Wall'];
        var len = tile.getSize();
        if (len === 8)
            tile.setTile('#');
        else if (len === 7)
        {
            if (tile.doesContainNumber('N', 'S') == 1)
                tile.setTile(tile.getType() + '_Horizontal_Wall');
            else if (tile.doesContainNumber('W', 'E') == 1)
                tile.setTile(tile.getType() + '_Vertical_Wall');
            else if (!tile.doesContain('NE'))
                tile.setTile(tile.getType() + '_SW_Corner');
            else if (!tile.doesContain('NW'))
                tile.setTile(tile.getType() + '_SE_Corner');
            else if (!tile.doesContain('SE'))
                tile.setTile(tile.getType() + '_NW_Corner');
            else if (!tile.doesContain('SW'))
                tile.setTile(tile.getType() + '_NE_Corner');
        }
        else if (len === 6)
        {
            if (tile.doesContain('W', 'S', 'E', 'N'))
            {
                if (tile.doesContain('NW', 'NE'))
                    tile.setTile(tile.getType() + '_South_Cross'); //y is down cross
                else if (tile.doesContain('SW', 'SE'))
                    tile.setTile(tile.getType() + '_North_Cross'); //t is up cross
                else if (tile.doesContain('NE', 'SE'))
                    tile.setTile(tile.getType() + '_West_Cross'); //r is right cross
                else if (tile.doesContain('NW', 'SW'))
                    tile.setTile(tile.getType() + '_East_Cross'); //l is left cross
                else
                    tile.setTile(tile.getType() + '_Omni_Cross'); //C is  cross
            }
            else if (tile.doesContain('S', 'W', 'N') || tile.doesContain('S', 'E', 'N'))
                tile.setTile(tile.getType() + '_Vertical_Wall');
            else if (tile.doesContain('W', 'N', 'E') || tile.doesContain('W', 'E', 'S'))
                tile.setTile(tile.getType() + '_Horizontal_Wall');
        }
        else if (len === 5)
        {
            if (tile.doesContain('W', 'E'))
            {
                if (tile.doesContain('S', 'SW', 'SE') || tile.doesContain('N', 'NW', 'NE'))
                    tile.setTile(tile.getType() + '_Horizontal_Wall');
                else if (tile.doesContain('N', 'S'))
                    tile.setTile(tile.getType() + '_Omni_Cross');
                else if (tile.doesContainNumber('N', 'NW', 'NE') === 2)
                    tile.setTile(tile.getType() + '_North_Cross');
                else if (tile.doesContainNumber('S', 'SW', 'SE') === 2)
                    tile.setTile(tile.getType() + '_South_Cross');
            }
            else if (tile.doesContain('N', 'S'))
            {
                if (tile.doesContain('NW', 'W', 'SW') || tile.doesContain('NE', 'E', 'SE'))
                    tile.setTile(tile.getType() + '_Vertical_Wall');
                else if (tile.doesContain('W', 'E'))
                    tile.setTile(tile.getType() + '_Omni_Cross');//
                else if (tile.doesContainNumber('NW', 'W', 'SW') === 2)
                    tile.setTile(tile.getType() + '_West_Cross');
                else if (tile.doesContainNumber('NE', 'E', 'SE') === 2)
                    tile.setTile(tile.getType() + '_East_Cross');
            }
        }
        else if (len === 4)
        {

            if (tile.doesContain('N', 'S', 'E', 'W'))
                tile.setTile(tile.getType() + '_Omni_Cross');
            else if (tile.doesContain('NE', 'NW', 'SW', 'SE'))
                tile.setTile('Q');
            else if (tile.doesContain('E', 'W'))
            {
                if (tile.doesContain('N'))
                    tile.setTile(tile.getType() + '_North_Cross');
                else if (tile.doesContain('S'))
                    tile.setTile(tile.getType() + '_South_Cross');
                else
                    tile.setTile(tile.getType() + '_Horizontal_Wall');
            }
            else if (tile.doesContain('N', 'S'))
            {
                if (tile.doesContain('E'))
                    tile.setTile(tile.getType() + '_East_Cross');
                else if (tile.doesContain('W'))
                    tile.setTile(tile.getType() + '_West_Cross');
                else
                    tile.setTile(tile.getType() + '_Vertical_Wall');
            }
            else if (tile.doesContain('N', 'W'))
                tile.setTile(tile.getType() + '_SE_Corner');//corner
            else if (tile.doesContain('N', 'E'))
                tile.setTile(tile.getType() + '_SW_Corner');//corner
            else if (tile.doesContain('S', 'W'))
                tile.setTile(tile.getType() + '_NE_Corner');//corner
            else if (tile.doesContain('S', 'E'))
                tile.setTile(tile.getType() + '_NW_Corner');//corner
        }
        else if (len === 3)
        {
            if (tile.doesContain('W', 'E'))
            {
                if (tile.doesContain('N'))
                    tile.setTile(tile.getType() + '_North_Cross');//corner
                else if (tile.doesContain('S'))
                    tile.setTile(tile.getType() + '_South_Cross');//corner
                else
                    tile.setTile(tile.getType() + '_Horizontal_Wall');//corner
            }
            else if (tile.doesContain('N', 'S'))
            {
                if (tile.doesContain('E'))
                    tile.setTile(tile.getType() + '_East_Cross');//corner
                else if (tile.doesContain('W'))
                    tile.setTile(tile.getType() + '_West_Cross');//corner
                else
                    tile.setTile(tile.getType() + '_Vertical_Wall');//corner
            }
            else if (tile.doesContain('N', 'E'))
                tile.setTile(tile.getType() + '_SW_Corner');//corner
            else if (tile.doesContain('S', 'E'))
                tile.setTile(tile.getType() + '_NW_Corner');//corner
            else if (tile.doesContain('N', 'W'))
                tile.setTile(tile.getType() + '_SE_Corner');//corner
            else if (tile.doesContain('S', 'W'))
                tile.setTile(tile.getType() + '_NE_Corner');//corner
            else if (tile.doesContainNumber('E', 'W'))
                tile.setTile(tile.getType() + '_Horizontal_Wall');//corner
            else if (tile.doesContainNumber('N', 'S'))
                tile.setTile(tile.getType() + '_Vertical_Wall');//corner
        }
        else if (len < 3 && len > 0)
        {
            if (tile.doesContain('W', 'N'))
                tile.setTile(tile.getType() + '_SE_Corner');//corner
            else if (tile.doesContain('W', 'S'))
                tile.setTile(tile.getType() + '_NE_Corner');//corner
            else if (tile.doesContain('E', 'N'))
                tile.setTile(tile.getType() + '_SW_Corner');//corner
            else if (tile.doesContain('E', 'S'))
                tile.setTile(tile.getType() + '_NW_Corner');//corner
            else if (tile.doesContainNumber('W', 'E'))
                tile.setTile(tile.getType() + '_Horizontal_Wall');//corner
            else if (tile.doesContainNumber('N', 'S'))
                tile.setTile(tile.getType() + '_Vertical_Wall');//corner
        }
        else if (len === 0)
            tile.setTile('Q');
    },
    getEntities: function() {
        return this.entities;
    },
    getGrid: function() {
        return this._grid;
    },
    getEngine: function() {
        return this._engine;
    },
    addToSchedule: function(actor) {
        this._scheduler.add(actor, true);
    },
        clearSchedule: function(actor) {
        this._scheduler.clear();
    },
    takeFromSchedule: function(actor) {
        this._scheduler.remove(actor);
    },
    setAllWalls: function() {
        for (var key in this.entities) {
            if (this.entities[key]['Wall'])
                Map.setWallTile(key);

        }
    },
    /*
    Can be used to check the status of all entities at a tile, depending on the callback passed. Use it to, e.g., check if a co-ordinate on the map is empty.
    */
    isClear: function(coord, callback) {
        var clear = true;
        var ents = this.entities[coord];
        for (key in ents)
        {
            if (callback.bind(ents[key])())
            {
                clear = false;
                break;
            }
        }
        return clear;
    },
    setLevel: function(number) {
	this._level=number;
    },
    // Returns all graphical tiles at a co-ordinate.
    getCoordTiles: function(key) {
        var ents = this.entities[key];
        var entityTiles = []
        for (key2 in ents)
            entityTiles.push(ents[key2].getTile());
        return entityTiles;
    },
    // returns an array containing all adjacent co-ordinated to the co-ordinate passed. Callback can be used to filter these. Usefull to check, e.g., all adjacent co-ordinates which can be moved to.
    getNeighbCoords: function(x, y, callback) {
        var coords = {};
        for (i = 0; i < 8; i++)
        {
            var boolean = true;
            var xcoord = ROT.DIRS[8][i][0] + parseInt(x);
            var ycoord = ROT.DIRS[8][i][1] + parseInt(y);
            if (callback)
            {
                if (callback(xcoord, ycoord))
                    boolean = false;
            }
            if (boolean)
                coords[xcoord + ',' + ycoord] = true;
        }
        return coords;
    },
    /*
    This function creates all rooms. By which I mean, creates their contents.
    */
    sortRooms: function() {
        var rooms = this._grid.getRooms();
        // get center of first room (to put the player in)
        var center = rooms[0].getCenter();
        var x = center[0], y = center[1];
        var level = Game.Levels[this._level++];
        // for each room on the map other than the first or last, create a room picked randomly from the current level template.
        for (var i = 1; i < rooms.length-1; i++) {
            new Game.Room({Room: rooms[i], template: level[Math.floor(Math.random() * level.length)]});
        }
        // last room should have down-stairs if we are not on the last level; the treasure chest if we are.
        if(this._level===Game.Levels.length)
        {
                    new Game.Room({Room: rooms[rooms.length-1], template: 
                Game.Templates.RoomTemplates.Treasure});
        }
        else
        {
        new Game.Room({Room: rooms[rooms.length-1], template: 
                Game.Templates.RoomTemplates.StairRoom});
        }
        // if the player already exists, add the player to the new level.
        if (this._player)
        {
            this._player.x_coord=x;
            this._player.y_coord=y;
            this.entities[x+","+y]["Player"]= this._player;
            this._player.setUpForFloor();
        }
        else
        // otherwise create new player.
        this._player= new Game.Entity({template: Game.Templates.ActorTemplates.PlayerTemplate,
            x_coord: x, y_coord: y});

        Game.clearDisplay();
        this._player.drawFOV();
        Game.setPlayer(this._player);
    }
}


