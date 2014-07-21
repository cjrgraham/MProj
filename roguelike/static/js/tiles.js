Game.Mixins = {};
Game.Mixins.Tile_Mixins = {};
Game.Mixins.Tile_Mixins.Tile = {
    name: 'Tile',
    groupName: 'Tile',
    init: function(properties) {
        this._kind = properties['kind'];
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
        if (Map.entities[nCoord] && Map.entities[nCoord]['Wall'])
        {
            Map.entities[nCoord]['Wall'].addConnections(thsDir);
            this.addConnections(oDir);
        }
        else if (parts[1] === '0' && (!Map.entities[nCoord] || !(Map.entities[thsCoord]['Wall'].doesContain('N'))))
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
        else if (parts[1] === Game.getHeight().toString() && (!(Map.entities[thsCoord]['Wall'].doesContain('S'))))
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
            if (!(Map.entities[thsCoord]['Wall'].doesContain('W')))
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
            else if (!(Map.entities[thsCoord]['Wall'].doesContain('E')))
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
Game.Templates.TileTemplates.WallTile = {
    mixins: [Game.Mixins.Tile_Mixins.Tile, Game.Mixins.Tile_Mixins.WallTile],
    category: 'Wall'
};
Game.Templates.TileTemplates.FloorTile = {
    mixins: [Game.Mixins.Tile_Mixins.Tile, Game.Mixins.Tile_Mixins.FloorTile],
    category: 'Floor'
};
Game.Templates.TargetTemplates = {};
Game.Templates.TargetTemplates.Target = {
    category: 'Target'
};
Game.Mixins.Door_Mixins = {};
Game.Mixins.Door_Mixins.Door = {
    name: 'Door_Tile',
    groupName: 'Door',
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
};
Game.Templates.DoorTemplates = {};
Game.Templates.DoorTemplates.Door = {
    mixins: [Game.Mixins.Door_Mixins.Door], category: 'Door'
};
Game.Templates.CorpseTemplates = {};
Game.Templates.CorpseTemplates.Corpse = {
    category: 'Grave'
};
Game.Mixins.Actor_Mixins = {};
Game.Templates.ActorTemplates = {};
Game.Mixins.Actor_Mixins.Fighter = {
    name: 'Fighter',
    groupName: 'Actor',
    strike: function(targetObj) {
        var att = this._base_attack;
        this._messages.push("The " + this._category +
                " hits the" + " " + targetObj._category);
        targetObj.isStruck(att, this);
    },
    isStruck: function(att, attacker) {
        var dam = att;
        this._curr_health -= dam;
        if (this._category === 'Player')
        {
            this._messages.push("The Player" +
                    " is struck by the " + " " + attacker._category);
        }
        //check if dead
        if (this._curr_health < 0)
            this.dies();
    }
}

Game.Mixins.Actor_Mixins.enemyDies = {
    name: 'Dies',
    groupName: 'Actor',
    dies: function() {
        Game.getPlayer()._messages.push("The enemy dies!");
        //remove from schedule
        Map.takeFromSchedule(this);
        var key = this.x_coord + ',' + this.y_coord;
        var ents = Map.entities[key]
        // remove from  map
        delete ents[this._category + ''];
        // remove target, if one exists
        delete Map.entities[this._targetKey]['Target']
        ents['Corpse'] = new Game.Entity({template: Game.Templates.CorpseTemplates.Corpse});
    }
}

Game.Mixins.Actor_Mixins.playerDies = {
    name: 'Dies',
    groupName: 'Actor',
    dies: function() {
        //remove from schedule
        Map.takeFromSchedule(this);
        var key = this.x_coord + ',' + this.y_coord;
        var ents = Map.entities[key]
        // remove from  map
        delete ents[this._category + ''];
        // remove target, if one exists
        delete Map.entities[this._targetKey]['Target']
        ents['Corpse'] = new Game.Entity({template: Game.Templates.CorpseTemplates.Corpse});
    }
}

Game.Mixins.Actor_Mixins.Player = {
    name: 'Player',
    groupName: 'Actor',
    init: function() {
        Map.addToSchedule(this);
        this._tile = 'Player';
        var that = this;
        var fovCallback = function(x, y) {
            if (Map.isClear(x + ',' + y, that.getOpacity))
                return true;
            return false;
        };
        this._fov = new ROT.FOV.RecursiveShadowcasting(fovCallback);
        this._messageDisplay = Game.getTextDisplay();
        this._messages = [],
                this._visible = {};
        this._roomCenters = [];
        var rooms = Map.getGrid().getRooms();
        console.log(rooms.length);
        for (var i = 0; i < rooms.length; i++) {
            this._roomCenters.push(rooms[i].getCenter());
        }
        this._targetRoom = 0;
    },
    processMessages: function() {
        this._messageDisplay.clear();
        this._messages = this._messages.join("\r\n");
        this._messageDisplay.drawText(1, 1, this._messages + '', 23)
        this._messages = []
    },
    act: function() {
        Map.getEngine().lock();
        this._timesMoved = 0;
        this.drawFOV();
        this.processMessages();
        window.addEventListener("keydown", this);
        this.drawFOV();
    },
    exploreMap: function() {
//        console.log("currentRoom+amount" + this._targetRoom + ',' + this._roomCenters.length)
        if (!(this._targetRoom <= this._roomCenters.length))
        {

        }
        else
        {
            var coord = this._roomCenters[this._targetRoom] + '';
            var coordParts = coord.split(',');
            var ents = Map.getEntities();
            var Path = new ROT.Path.Dijkstra(parseInt(coordParts[0]), parseInt(coordParts[1]), function(x, y) {
                return ents[x + ',' + y]['Floor'];
            });
            var steps = [];
            //console.log("CoordParts" + coordParts)
            Path.compute(this.x_coord, this.y_coord, function(x, y) {
                steps.push([x, y]);
            });

            if (steps.length > 1)
            {
                var nextX = steps[1][0], nextY = steps[1][1];
                this.move(nextX, nextY);
            }
            else
            {
                this._targetRoom++;
                console.log(this._targetRoom);
            }

        }

    },
    lookForEnemies: function() {
        var enemies = [];
        this._fov.compute(this.x_coord, this.y_coord, 8, function(x, y) {
            var coord = x + ',' + y;
            if (Map.entities[coord]['Enemy']) {
                enemies.push([x, y]);
            }
        });
        return enemies;
    },
    attackEnemy: function(coord) {
        var coordPartsX = coord[0], coordPartsY = coord[1];
        var ents = Map.getEntities();
        var Path = new ROT.Path.Dijkstra(parseInt(coordPartsX), parseInt(coordPartsY), function(x, y) {
            return ents[x + ',' + y]['Floor'];
        });
        var steps = [];
        //console.log("CoordParts" + coordParts)
        Path.compute(this.x_coord, this.y_coord, function(x, y) {
            steps.push([x, y]);
        });
        if (steps.length > 1)
        {
            var nextX = steps[1][0], nextY = steps[1][1];
            this.move(nextX, nextY);
        }

    },
    move: function(targetX, targetY) {
        if (this._timesMoved++ > 0)
        {
            console.log(this._timesMoved);
            return;
        }
        var ents = Map.entities[this.x_coord + ',' + this.y_coord];
        var target = targetX + ',' + targetY;
        var targEnts = Map.entities[target];
        if (Map.isClear(target, this.checkObstruction))
        {
            if (targEnts['Enemy'])
            {
                this.strike(targEnts['Enemy']);
                return;
            }
            delete ents['Player'];
            this.x_coord = targetX, this.y_coord = targetY;
            targEnts['Player'] = this;
        }
        else if (targEnts['Door'])
        {
            this._messages.push("The Player opens the Door");
            targEnts['Door'].open();
        }
    },
    handleEvent: function(e) {
        var text = $('#inputArea').val();
        eval(text);
        window.removeEventListener("keydown", this);
        Map.getEngine().unlock();
    },
    drawFOV: function() {
        var display = Game.getDisplay();
        var seenLastTurn = this._visible;
        var that = this;
        this._visible = {};
        this._fov.compute(this.x_coord, this.y_coord, 8, function(x, y) {
            var key = x + ',' + y;
            var actor = Map.entities[key]['Enemy'];
            if (actor)
            {
                actor.setWhetherSeen(true);
                actor.drawTarget();
            }
            if (seenLastTurn[key])
                delete seenLastTurn[key];
            var coordTiles = Map.getCoordTiles(key);
            display.draw(x, y, coordTiles);
            that._visible[key] = true;
        });
        for (key in seenLastTurn)
        {
            var keyParts = key.split(',');
            display.draw(keyParts[0], keyParts[1], 'Fogged');
        }
    }
};
Game.Mixins.Actor_Mixins.Enemy = {
    name: 'Enemy',
    groupName: 'Actor',
    init: function() {
        Map.addToSchedule(this);
        this._displacements = [];
        this._HomeX = this.x_coord;
        this._HomeY = this.y_coord;
        this._steps = [];
        this._facing = 1;
        this._state = 'Guarding';
        this._delayer = false;
        this._targetX = null;
        this._targetY = null;
        this._whetherSeen = false;
        var that = this;
        this._messages = [];
        var fovCallback = function(x, y) {
            if (Map.isClear(x + ',' + y, that.getOpacity))
                return true;
            return false;
        };
        this._fov = new ROT.FOV.RecursiveShadowcasting(fovCallback);
    },
    act: function() {
        this._messages = [];
        this._displacements = [];
        var that = this;
        var seen = false;
        this._fov.compute180(this.x_coord, this.y_coord, 8, this._facing, function(x, y) {
            var coord = x + ',' + y;
            if (Map.entities[coord]['Player']) {
                that.pathToTarget(x, y);
                seen = true;
            }
        });
        if (this._steps.length < 2 && (this._HomeX !== this.x_coord || this._HomeY !== this.y_coord))
            this.pathToTarget(this._HomeX, this._HomeY);
        else if (!seen && this._HomeX === this.x_coord && this._HomeY === this.y_coord)
            this.rotate();
        if (seen)
        {
            this._fov.compute(this.x_coord, this.y_coord, 8, function(x, y) {
                var coord = x + ',' + y;
                if (Map.entities[coord]['Enemy']) {
                    var actor = Map.entities[coord]['Enemy'];
                    actor.pathToTarget(that._targetX, that._targetY);
                    actor.drawTarget();
                }
            });
        }
        this.walkToTarget();
        this.drawTarget();
        this.setWhetherSeen(false);
    },
    rotate: function() {
        if (this._delayer === false)
        {
            this._facing++;
            if (this._facing > 7)
                this._facing = 0;
            var targetX = ROT.DIRS[8][this._facing][0];
            var targetY = ROT.DIRS[8][this._facing][1];
            this.drawTarget(targetX, targetY);
        }
        this._delayer = !this._delayer;
    },
    walkToTarget: function() {
        if (this._steps.length && this._steps.length > 1) {
            this._steps.splice(0, 1);
            var nextX = this._steps[0][0], nextY = this._steps[0][1];
            var found = this.move(nextX, nextY);
            var xpoint = null, ypoint = null;
            if (!found)
            {
                this.pathToTarget(this._targetX, this._targetY);
                xpoint = this._steps[1][0] - this.x_coord, ypoint = this._steps[1][1] - this.y_coord;
                var direction = xpoint + ',' + ypoint;
                this._facing = Game.offsets[direction];
            }

            this.drawTarget();
        }
    },
    pathToTarget: function(x, y) {
        this._targetX = x;
        this._targetY = y;
        var that = this;
        var Path = new ROT.Path.Dijkstra(this._targetX, this._targetY, function(x, y) {
            return Map.isClear(x + ',' + y, that.checkObstruction);
        });
        this._steps = [];
        Path.compute(this.x_coord, this.y_coord, function(x, y) {
            that._steps.push([x, y]);
        });
    },
    drawTarget: function() {
        var offsetX = ROT.DIRS[8][this._facing][0];
        var offsetY = ROT.DIRS[8][this._facing][1];
        if (this._targetKey)
            delete Map.entities[this._targetKey]['Target'];
        if (!this._whetherSeen)
            return;
        var targetX = offsetX + this.x_coord, targetY = offsetY + this.y_coord;
        new Game.Entity({template: Game.Templates.TargetTemplates.Target, x_coord: targetX, y_coord: targetY});
        this._targetKey = targetX + ',' + targetY;
    },
    move: function(targetX, targetY) {
        var ents = Map.entities[this.x_coord + ',' + this.y_coord];
        var target = targetX + ',' + targetY;
        var targEnts = Map.entities[target];
        if (Map.isClear(target, this.checkObstruction))
        {
            if (targEnts['Player'] || targEnts['Enemy'])
            {
                if (targEnts['Enemy'])
                {
                    if (targetX === this.x_coord &&
                            targetY === this.x_coord) {
                        this.setDisplacements();
                        return false;
                    }
                    var check = targEnts['Enemy'].getDisplaced();
                    if (!check)
                    {
                        this._messages.push("The enemy pushes forward to reach you.")
                        this.setDisplacements();
                        return true;
                    }
                }
                else if (targEnts['Player'])
                {
                    this.strike(targEnts['Player']);
                    this.setDisplacements();
                    return false;
                }
            }
            delete ents['Enemy'];
            this.x_coord = targetX, this.y_coord = targetY;
            targEnts['Enemy'] = this;
        }
        else if (targEnts['Door'])
        {
            targEnts['Door'].open();
        }
        this.setDisplacements();
        return this.x_coord === this._targetX && this.y_coord === this._targetY;
    },
    setDisplacements: function() {
        var that = this;
        var callback = function(x, y) {
            var coord = x + ',' + y;
            if (Map.entities[coord]['Enemy'] || Map.entities[coord]['Player'])
                return true;
            if (!Map.isClear(coord, that.checkObstruction))
                return true;
        };
        var thisNbrs = Map.getNeighbCoords(this.x_coord, this.y_coord, callback);
        var intersect = function(x, y) {
            if (!thisNbrs[x + ',' + y])
                return true;
        }
        var trgNbrs = Map.getNeighbCoords(this._targetX, this._targetY, intersect);
        for (key in trgNbrs)
            this._displacements.push(key);
    },
    getDisplaced: function() {
        var dsplm = this._displacements;
        var eligible = [];
        for (i = 0; i < dsplm.length; i++)
        {
            if (!(Map.entities[dsplm[i]]['Enemy'] || Map.entities[dsplm[i]]['Player']))
                eligible.push(dsplm[i]);
        }
        var coord = eligible[Math.floor(Math.random() * eligible.length)]
        if (!eligible.length)
            return false;
        var parts = coord.split(",");
        this.move(parseInt(parts[0]), parseInt(parts[1]));
        return true;
    },
    setWhetherSeen: function(boolean) {
        this._whetherSeen = boolean;
    }
};
Game.Templates.ActorTemplates.PlayerTemplate = {
    category: 'Player',
    attributes: {
        _max_health: 50,
        _curr_health: 50,
        _base_attack: 2,
        _base_defense: 1
    },
    mixins: [Game.Mixins.Actor_Mixins.Player,
        Game.Mixins.Actor_Mixins.Fighter,
        Game.Mixins.Actor_Mixins.playerDies]
};
Game.Templates.ActorTemplates.EnemyTemplate = {
    category: 'Enemy',
    attributes: {
        _max_health: 5,
        _curr_health: 5,
        _base_attack: 2,
        _base_defense: 1
    },
    mixins: [Game.Mixins.Actor_Mixins.Enemy,
        Game.Mixins.Actor_Mixins.Fighter,
        Game.Mixins.Actor_Mixins.enemyDies]
};
