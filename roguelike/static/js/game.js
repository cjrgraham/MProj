var Game = {
    _display: null,
    _map: {wallTiles: {}, floorTiles: {}},
    _screenWidth: 79,
    _screenHeight: 24,
    init: function() {
	

        //1234
        //ROT.RNG.setSeed(1404001903076);
        //console.log(ROT.RNG.getSeed());
        tileSet = document.createElement('img');
        tileSet.src = DJANGO_STATIC_URL+'tileset.png';
        var options = {
                  layout: 'tile',
            //    bg: 'transparent',
            tileWidth: 16,
            tileHeight: 16,
            tileSet: tileSet,
            tileMap: {
                '#': [48, 48],
                'Concrete_SW_Corner': [0, 80], //SW corner
                'Concrete_SE_Corner': [32, 80], //SR corner
                'Concrete_NE_Corner': [32, 48], //NE corner
                'Concrete_NW_Corner': [0, 48], //SE corner
                'Concrete_Floor': [32, 64],
                'Concrete_Vertical_Wall': [0, 54], // up wall
                'Concrete_Horizontal_Wall': [16, 48], //across wall
                'Concrete_West_Cross': [80, 64], // W facing cross
                'Concrete_East_Cross': [48, 64], // E facing Cross
                'Concrete_South_Cross': [64, 48], // S facing cross
                'Concrete_Omni_Cross': [64, 64],//omnidirectional cross
                'Concrete_North_Cross': [64, 80] // N facing Cross
            }
        }
        this._display = new ROT.Display(options);
    },
    generateMap: function() {
        var digger = new ROT.Map.Digger();
        var oDirs = ['N', 'NW', 'W', 'SW'];
        var thsDirs = ['S', 'SE', 'E', 'NE'];
        var offset = [[0, -1], [-1, -1], [-1, 0], [-1, 1]];
        var digCallback = function(x, y, value) {

            var key = x + ',' + y;
            if (value) {
                var wall = new Game.tile();
                this._map.wallTiles[key] = wall;
                for (i = 0; i < 4; i++)
                {
                    var nCoord = (x + offset[i][0]) + ',' + (y + offset[i][1]);
                    wall.updateNeighbour(key, nCoord, oDirs[i], thsDirs[i]);
                }
            }
            else {
                this._map.floorTiles[key] = 'Concrete_Floor';
            }
        };
        digger.create(digCallback.bind(this));
    },
    setWallTile: function(key) {
        var tile = this._map.wallTiles[key];
        var len = tile.getSize();
        if (len === 8)
            tile.setTile('#');
        else if (len === 7)
        {
                if (tile.doesContainNumber('N', 'S')==1)
                    tile.setTile('Concrete_Horizontal_Wall'); 
                else if (tile.doesContainNumber('W', 'E')==1)
                    tile.setTile('Concrete_Vertical_Wall'); 
                else if (!tile.doesContain('NE'))
                    tile.setTile('Concrete_SW_Corner'); 
                else if (!tile.doesContain('NW'))
                    tile.setTile('Concrete_SE_Corner'); 
                else if (!tile.doesContain('SE'))
                    tile.setTile('Concrete_NW_Corner');
                else if (!tile.doesContain('SW'))
                    tile.setTile('Concrete_NE_Corner'); 
        }
        else if (len === 6)
        {
            if (tile.doesContain('W', 'S', 'E', 'N'))
            {
                if (tile.doesContain('NW', 'NE'))
                    tile.setTile('Concrete_South_Cross'); //y is down cross
                else if (tile.doesContain('SW', 'SE'))
                    tile.setTile('Concrete_North_Cross'); //t is up cross
                else if (tile.doesContain('NE', 'SE'))
                    tile.setTile('Concrete_West_Cross'); //r is right cross
                else if (tile.doesContain('NW', 'SW'))
                    tile.setTile('Concrete_East_Cross'); //l is left cross
                else
                    tile.setTile('Concrete_Omni_Cross'); //C is  cross
            }
            else if (tile.doesContain('S', 'W', 'N') || tile.doesContain('S', 'E', 'N'))
                tile.setTile('Concrete_Vertical_Wall');
            else if (tile.doesContain('W', 'N', 'E') || tile.doesContain('W', 'E', 'S'))
                tile.setTile('Concrete_Horizontal_Wall');
        }
        else if (len === 5)
        {
            if (tile.doesContain('W', 'E'))
            {
                if (tile.doesContain('S', 'SW', 'SE') || tile.doesContain('N', 'NW', 'NE'))
                    tile.setTile('Concrete_Horizontal_Wall');
                else if (tile.doesContain('N', 'S'))
                    tile.setTile('Concrete_Omni_Cross');
                else if (tile.doesContainNumber('N', 'NW', 'NE') === 2)
                    tile.setTile('Concrete_North_Cross');
                else if (tile.doesContainNumber('S', 'SW', 'SE') === 2)
                    tile.setTile('Concrete_South_Cross');
            }
            else if (tile.doesContain('N', 'S'))
            {
                if (tile.doesContain('NW', 'W', 'SW') || tile.doesContain('NE', 'E', 'SE'))
                    tile.setTile('Concrete_Vertical_Wall');
                else if (tile.doesContain('W', 'E'))
                    tile.setTile('Concrete_Omni_Cross');//
                else if (tile.doesContainNumber('NW', 'W', 'SW') === 2)
                    tile.setTile('Concrete_West_Cross');
                else if (tile.doesContainNumber('NE', 'E', 'SE') === 2)
                    tile.setTile('Concrete_East_Cross');
            }
        }
        else if (len === 4)
        {

            if (tile.doesContain('N', 'S', 'E', 'W'))
                tile.setTile('Concrete_Omni_Cross');
            else if (tile.doesContain('NE', 'NW', 'SW', 'SE'))
                tile.setTile('Q');
            else if (tile.doesContain('E', 'W'))
            {
                if (tile.doesContain('N'))
                    tile.setTile('Concrete_North_Cross');
                else if (tile.doesContain('S'))
                    tile.setTile('Concrete_South_Cross');
                else
                    tile.setTile('Concrete_Horizontal_Wall');
            }
            else if (tile.doesContain('N', 'S'))
            {
                if (tile.doesContain('E'))
                    tile.setTile('Concrete_East_Cross');
                else if (tile.doesContain('W'))
                    tile.setTile('Concrete_West_Cross');
                else
                    tile.setTile('Concrete_Vertical_Wall');
            }
            else if (tile.doesContain('N', 'W'))
                tile.setTile('Concrete_SE_Corner');//corner
            else if (tile.doesContain('N', 'E'))
                tile.setTile('Concrete_SW_Corner');//corner
            else if (tile.doesContain('S', 'W'))
                tile.setTile('Concrete_NE_Corner');//corner
            else if (tile.doesContain('S', 'E'))
                tile.setTile('Concrete_NW_Corner');//corner
        }
        else if (len ===3)
        {
            if (tile.doesContain('W', 'E'))
            {
                if (tile.doesContain('N'))
                    tile.setTile('Concrete_North_Cross');//corner
                else if (tile.doesContain('S'))
                    tile.setTile('Concrete_South_Cross');//corner
                else
                    tile.setTile('Concrete_Horizontal_Wall');//corner
            }
            else if (tile.doesContain('N', 'S'))
            {
                if (tile.doesContain('E'))
                    tile.setTile('Concrete_East_Cross');//corner
                else if (tile.doesContain('W'))
                    tile.setTile('Concrete_West_Cross');//corner
                else
                    tile.setTile('Concrete_Vertical_Wall');//corner
            }
            else if (tile.doesContain('N', 'E'))
                    tile.setTile('Concrete_SW_Corner');//corner
            else if (tile.doesContain('S', 'E'))
                    tile.setTile('Concrete_NW_Corner');//corner
            else if (tile.doesContain('N', 'W'))
                    tile.setTile('Concrete_SE_Corner');//corner
            else if (tile.doesContain('S', 'W'))
                    tile.setTile('Concrete_NE_Corner');//corner
            else if (tile.doesContainNumber('E', 'W'))
                tile.setTile('Concrete_Horizontal_Wall');//corner
            else if (tile.doesContainNumber('N', 'S'))
                tile.setTile('Concrete_Vertical_Wall');//corner
        }
        else if (len < 3&&len>0)
        {
            if (tile.doesContain('W', 'N'))
                tile.setTile('Concrete_SE_Corner');//corner
            else if (tile.doesContain('W', 'S'))
                tile.setTile('Concrete_NE_Corner');//corner
            else if (tile.doesContain('E', 'N'))
                tile.setTile('Concrete_SW_Corner');//corner
            else if (tile.doesContain('E', 'S'))
                tile.setTile('Concrete_NW_Corner');//corner
            else if (tile.doesContainNumber('W', 'E'))
                tile.setTile('Concrete_Horizontal_Wall');//corner
            else if (tile.doesContainNumber('N', 'S'))
                tile.setTile('Concrete_Vertical_Wall');//corner
        }
        else if (len === 0)
            tile.setTile('Q');
    },
    getDisplay: function() {
        return this._display;
    },
    getMap: function() {
        return this._map;
    },
    getWidth: function() {
        return this._screenWidth;
    },
    getHeight: function() {
        return this._screenHeight;
    },
    drawWholeMap: function() {
        for (var key in this._map.floorTiles) {
            var parts = key.split(',');
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            this._display.draw(x, y, 'Concrete_Floor');
        }
        for (var key in this._map.wallTiles) {

            var parts = key.split(',');
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            this.setWallTile(key);
            var tile = this._map.wallTiles[key];
                this._display.draw(x, y, tile.getTile());
        }
    }
}

window.onload = function() {
// Check if rot.js can work on this browser
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {
// Initialize the game
        Game.init();
        // Add the container to our HTML page
        document.body.appendChild(Game.getDisplay().getContainer());
        Game.generateMap();
        Game.drawWholeMap();
         //Game._display.draw(0, 0, 'Concrete_NE_Corner');
    }
}
