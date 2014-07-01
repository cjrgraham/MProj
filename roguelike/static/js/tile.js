Game.tile = function() {
    this.connections = {};
    this.tile = null;
};

Game.tile.prototype.addConnections = function() {
    for(var i = 0, j = arguments.length; i < j; i++)
        this.connections[arguments[i]]=true
};

Game.tile.prototype.doesContainNumber = function() {
    var count = 0;
    for(var i = 0, j = arguments.length; i < j; i++)
        if (this.connections[arguments[i]])
            count++;
    return count;
};

Game.tile.prototype.doesContain = function() {
    for(var i = 0, j = arguments.length; i < j; i++)
        if (!this.connections[arguments[i]])
            return false;
    return true;
};

Game.tile.prototype.updateNeighbour = function(thsCoord, nCoord, oDir, thsDir) {
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
};

Game.tile.prototype.setTile = function(char) {
    this.tile = char;
};

Game.tile.prototype.getTile = function(char) {
    return this.tile;
};

Game.tile.prototype.getSize = function() {
    return Object.keys(this.connections).length;
};

Game.tile.prototype.getConnections = function() {
    return Object.keys(this.connections);
};