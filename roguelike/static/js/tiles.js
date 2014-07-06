Game.Mixins = {};

Game.Mixins.Tile_Mixins = {};


Game.Mixins.Tile_Mixins.Tile = {
    name: 'Tile',
    groupName: 'Tile',
    init: function(properties) {
        this._kind = properties[3];
    },
    getType: function() {
        return this._kind;
    }
}

Game.Mixins.Tile_Mixins.FloorTile = {
    name: 'Floor_Tile',
    groupName: 'Tile',
    init: function() {
        this._tile = this._kind + '_Floor';
    }
}

Game.Mixins.Tile_Mixins.Door = {
    name: 'Floor_Tile',
    groupName: 'Tile',
    init: function() {
        this._tile = 'Door';
        this._obstructs = true;
        this._opacity = true;
    },
    open: function() {
        this._obstructs = false;
        this._opacity = false;
        this._tile = 'Open_Door';
    }
}

Game.Mixins.Tile_Mixins.WallTile = {
    name: 'Wall_Tile',
    groupName: 'Tile',
    init: function() {
        this._connections = {};
        this._obstructs = true;
        this._opacity = true;
    },
    doesContainNumber: function() {
        var count = 0;
        for (var i = 0, j = arguments.length; i < j; i++)
            if (this._connections[arguments[i]])
                count++;
        return count;
    },
    doesContain: function() {
        for (var i = 0, j = arguments.length; i < j; i++)
            if (!this._connections[arguments[i]])
                return false;
        return true;
    },
    addConnections: function() {
        for (var i = 0, j = arguments.length; i < j; i++)
            this._connections[arguments[i]] = true
    },
    updateNeighbour: function(thsCoord, nCoord, oDir, thsDir) {
        var parts = thsCoord.split(",");
        if (Game.entities[nCoord] && Game.entities[nCoord]['Wall'])
        {
            //console.log(Game.entities[nCoord]['Wall'].doesContain);
            Game.entities[nCoord]['Wall'].addConnections(thsDir);
            this.addConnections(oDir);
        }
        else if (parts[1] === '0' && (!Game.entities[nCoord] || !(Game.entities[thsCoord]['Wall'].doesContain('N'))))
        {
            this.addConnections('N', 'NE');

            if (parts[0] === '0')
            {
                this.addConnections('NW', 'W', 'SW');
            }
            else if (parts[0] === Game.getWidth().toString())
            {
                this.addConnections('NW', 'E', 'SE');
            }
            else
            {
                this.addConnections('NW');
            }
        }
        else if (parts[1] === Game.getHeight().toString() && (!(Game.entities[thsCoord]['Wall'].doesContain('S'))))
        {
            this.addConnections('S', 'SE');

            if (parts[0] === '0')
            {
                this.addConnections('NW', 'W', 'SW');
            }
            else if (parts[0] === '79')
            {
                this.addConnections('NW', 'E', 'SE');
            }
            else
            {
                this.addConnections('SW');
            }
        }
        else if (parts[0] === '0')
        {
            if (!(Game.entities[thsCoord]['Wall'].doesContain('W')))
            {
                this.addConnections('NW', 'W', 'SW');
            }

        }

        if (parts[0] === Game.getWidth().toString())
        {
            if (parts[1] == Game.getHeight().toString())
            {
                this.addConnections('NE', 'SW');
            }
            else if (!(Game.entities[thsCoord]['Wall'].doesContain('E')))
            {
                this.addConnections('NE', 'E', 'SE');
            }

        }
    },
    getSize: function() {
        return Object.keys(this._connections).length;
    },
    getConnections: function() {
        return Object.keys(this._connections);
    }
}

Game.Templates = {};

Game.Templates.TileTemplates = {};

Game.Templates.TileTemplates.Tile = {
    mixins: [Game.Mixins.Tile_Mixins.Tile]
};

Game.Templates.TileTemplates.WallTile = {
    mixins: [Game.Mixins.Tile_Mixins.Tile, Game.Mixins.Tile_Mixins.WallTile]
};

Game.Templates.TileTemplates.FloorTile = {
    mixins: [Game.Mixins.Tile_Mixins.Tile, Game.Mixins.Tile_Mixins.FloorTile]
};

Game.Templates.TileTemplates.Door = {
    mixins: [Game.Mixins.Tile_Mixins.Door]
};


Game.Mixins.Actor_Mixins = {};

Game.Templates.ActorTemplates = {};

Game.Mixins.Actor_Mixins.Player = {
    name: 'Player',
    groupName: 'Actor',
    init: function() {
        Game.addToSchedule(this);
        this._tile = 'Player';
        var fovCallback = function(x, y) {
            if (Game.isTransparent(x + ',' + y))
                return true;
            return false;
        };
        this._fov = new ROT.FOV.PreciseShadowcasting(fovCallback);
        this._visible = {};
    },
    act: function() {
        Game.getEngine().lock();
        window.addEventListener("keydown", this);
    },
    move: function(offset) {
        var xOffset = offset[0], yOffset = offset[1];
        var targetX = this.x_coord + xOffset, targetY = this.y_coord + yOffset;
        var ents = Game.entities[this.x_coord + ',' + this.y_coord];
        var target = targetX + ',' + targetY;
        var targEnts = Game.entities[target];
        if (Game.isClear(target))
        {
            delete ents['Actor'];
            this.x_coord = targetX, this.y_coord = targetY;
            targEnts['Actor'] = this;
        }
        else if (targEnts['Door'])
        {
            targEnts['Door'].open();
        }
    },
    handleEvent: function(e) {
        if (Game.keys.Directions[e.keyCode])
            this.move(Game.keys.Directions[e.keyCode]);
        this.drawFOV();
        window.removeEventListener("keydown", this);
        Game.getEngine().unlock();
    },
    drawFOV: function() {
        var display = Game.getDisplay();
        var seenLastTurn = this._visible;
        var that=this;
        this._visible = {};
        this._fov.compute(this.x_coord, this.y_coord, 8, function(x, y) {
            if (seenLastTurn[x+','+y])
                delete seenLastTurn[x+','+y];
            var coordTiles = Game.getCoordTiles(x + ',' + y);
            display.draw(x, y, coordTiles);
            that._visible[x+','+y]=true;
        });
        console.log(Object.keys(seenLastTurn).length)
        for (key in seenLastTurn)
        {
            var keyParts = key.split(',')
            console.log(keyParts[0]+','+keyParts[1])
            display.draw(keyParts[0],keyParts[1],'Fogged');
        }
    }
}

Game.Templates.ActorTemplates.PlayerTemplate = {
    mixins: [Game.Mixins.Actor_Mixins.Player]
};