Game.Mixins={};

Game.Mixins.Tile_Mixins = {};

Game.Mixins.Tile_Mixins.Tile = {
    name: 'Tile',
    groupName: 'Tile',
    init: function(template) {
            this.tile = null;
            this.kind = template['kind'];
    }, 
    getType  : function() {
    return this.kind;
    },
    setTile : function(char) {
    this.tile = char;
    },
    getTile : function() {
    return this.tile;
    }
}

Game.Mixins.Tile_Mixins.WallTile = {
    name: 'Wall_Tile',
    groupName: 'Tile',
    init: function(type) {
            this.connections = {};
    }, 
    getType  : function() {
    return this.type;
    },
    setTile : function(char) {
    this.tile = char;
    },
    getTile : function() {
    return this.tile;
    },
    doesContainNumber : function() {
    var count = 0;
    for(var i = 0, j = arguments.length; i < j; i++)
        if (this.connections[arguments[i]])
            count++;
    return count;
    },
    doesContain : function() {
    for(var i = 0, j = arguments.length; i < j; i++)
        if (!this.connections[arguments[i]])
            return false;
    return true;
    },
    addConnections : function() {
    for(var i = 0, j = arguments.length; i < j; i++)
        this.connections[arguments[i]]=true
    },
    updateNeighbour : function(thsCoord, nCoord, oDir, thsDir) {
    var parts = thsCoord.split(",");
    if (Game._map.wallTiles[nCoord])
    {
        //console.log('****'+thsCoord+'_____'+nCoord);
        Game._map.wallTiles[nCoord].addConnections(thsDir);
        this.addConnections(oDir);
    }
    else if (parts[1] === '0' && (!(Game._map.wallTiles[thsCoord].doesContain('N'))))
    {
        this.addConnections('N','NE');

        if (parts[0] === '0')
        {
            this.addConnections('NW','W','SW');
        }
        else if (parts[0] === Game.getWidth().toString())
        {
            this.addConnections('NW','E','SE');
        }
        else
        {
            this.addConnections('NW');
        }
    }
    else if (parts[1] === Game.getHeight().toString() && (!(Game._map.wallTiles[thsCoord].doesContain('S'))))
    {
        this.addConnections('S','SE');

        if (parts[0] === '0')
        {
            this.addConnections('NW','W','SW');
        }
        else if (parts[0] === '79')
        {
            this.addConnections('NW','E','SE');
        }
        else
        {
            this.addConnections('SW');
        }
    }
    else if (parts[0] === '0')
    {
        if (!(Game._map.wallTiles[thsCoord].doesContain('W')))
        {
            this.addConnections('NW','W','SW');
        }

    }

    if (parts[0] === Game.getWidth().toString())
    {
        if (parts[1] == Game.getHeight().toString())
        {
            this.addConnections('NE','SW');
        }
        else if (!(Game._map.wallTiles[thsCoord].doesContain('E')))
        {
            this.addConnections('NE','E','SE');
        }

    }
},


    getSize : function() {
    return Object.keys(this.connections).length;
},

    getConnections : function() {
    return Object.keys(this.connections);
}
}

Game.Templates = {};

Game.Templates.TileTemplates = {};

Game.Templates.TileTemplates.Tile = {

    mixins: [Game.Mixins.Tile_Mixins.Tile]
};

Game.Templates.TileTemplates.WallTile = {
    kind: 'Concrete',
    mixins: [Game.Mixins.Tile_Mixins.Tile, Game.Mixins.Tile_Mixins.WallTile]
};

Game.Templates.TileTemplates.Tile = {

    mixins: [Game.Mixins.Tile_Mixins.Tile]
};



