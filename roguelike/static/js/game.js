var Game = {
    _display: null,
    entities: {},
    _screenWidth: 79,
    _screenHeight: 24,
    _engine: null,
    _scheduler: null,
    init: function() {
        //1234
        //ROT.RNG.setSeed(1404001903076);
        //console.log(ROT.RNG.getSeed());
        tileSet = document.createElement('img');
        tileSet.src = DJANGO_STATIC_URL+'tileset.png';
        this._scheduler = (new ROT.Scheduler.Simple());
        this._engine = new ROT.Engine(this._scheduler);
        var options = {
            layout: 'tile',
            bg: 'transparent',
            tileWidth: 16,
            tileHeight: 16,
            tileSet: tileSet,
            tileMap: Game.imageMap
        }
        this._display = new ROT.Display(options);
    },
    generateMap: function() {
        this._map = digger = new ROT.Map.Digger();
        var oDirs = ['N', 'NW', 'W', 'SW'];
        var thsDirs = ['S', 'SE', 'E', 'NE'];
        var offset = [[0, -1], [-1, -1], [-1, 0], [-1, 1]];
        var digCallback = function(x, y, value) {
            var key = x + ',' + y;
            if (value) {
                var wall = new Game.Entity([Game.Templates.TileTemplates.WallTile, x, y, 'Concrete']);
                this.entities[key] = {};
                this.entities[key]['Wall'] = wall;
                for (i = 0; i < 4; i++)
                {
                    var nCoord = (x + offset[i][0]) + ',' + (y + offset[i][1]);
                    wall.updateNeighbour(key, nCoord, oDirs[i], thsDirs[i]);
                }
            }
            else {
                this.entities[key] = {};
                this.entities[key]['Floor'] = new Game.Entity([Game.Templates.TileTemplates.FloorTile, x, y, 'Concrete']);
            }
        };
        digger.create(digCallback.bind(this));

        var setDoor = function(x, y) {
            var key = x + ',' + y;
            var door = new Game.Entity([Game.Templates.TileTemplates.Door, x, y]);
            Game.entities[key]['Door'] = door;
        }
        var rooms = this._map.getRooms();
        for (var i = 0; i < rooms.length; i++) {
            rooms[i].getDoors(setDoor);
        }

    },
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
    getDisplay: function() {
        return this._display;
    },
    getEntities: function() {
        return this.entities;
    },
    getEngine: function() {
        return this._engine;
    },
    addToSchedule: function(actor) {
        this._scheduler.add(actor, true);
    },
    getWidth: function() {
        return this._screenWidth;
    },
    getHeight: function() {
        return this._screenHeight;
    },
    setAllWalls: function() {
        for (var key in this.entities) {
            if (this.entities[key]['Wall'])
                Game.setWallTile(key);

        }
    },
    isClear: function(coord) {
        var clear = true;
        var ents = this.entities[coord];
        for (key in ents)
        {
            if (ents[key].checkObstruction())
            {
                clear = false;
                break;
            }
        }
        return clear;
    },
    isTransparent: function(coord) {
        var trnsp = true;
        var ents = this.entities[coord];
        for (key in ents)
        {
            if (ents[key].getOpacity())
            {
                trnsp = false;
                break;
            }
        }
        return trnsp;
    },
    getCoordTiles: function(key) {
        var ents = this.entities[key];
        var entityTiles = []
        for (key2 in ents)
            entityTiles.push(ents[key2].getTile());
        return entityTiles;
    },
    placeNewPlayer: function() {
        var rooms = this._map.getRooms();
        var x = rooms[0].getLeft(), y = rooms[0].getTop();
        var key = x + ',' + y;
        var player = new Game.Entity([Game.Templates.ActorTemplates.PlayerTemplate, x, y]);
        Game.entities[key]['Actor'] = player;
        player.drawFOV();;
    },
}


window.onload = function() {
    Game.init();
    document.body.appendChild(Game.getDisplay().getContainer());
    Game.generateMap();
    Game.setAllWalls();
    Game.placeNewPlayer();
    Game.getEngine().start();
}
