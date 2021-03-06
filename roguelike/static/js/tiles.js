/*
This file contains entity templates and the mixins they are built out of. Entities are Elements which are located at co-ordinates on the map, and can be accessed at co-ordinates in Map.entities.
*/

Game.Mixins = {};
Game.Mixins.General_Mixins = {};

Game.Mixins.General_Mixins.blocksSight = {
    name: 'blocksSight',
    groupName: 'General',
    // init funcitons are called during the creation of entities: they are used to set them up
    init: function() {
        this._opacity = true;
    }
}

Game.Mixins.General_Mixins.obstructs = {
    name: 'obstructs',
    groupName: 'General',
    init: function() {
        this._obstructs = true;
    }
}

Game.Mixins.Tile_Mixins = {};
Game.Mixins.Tile_Mixins.Tile = {
    name: 'Tile',
    groupName: 'Tile',
    init: function(properties) {
        this._kind = properties['kind'];
    },
    // Other methods in the mixin get copied over to the object created using a template containing this mixin.
    getType: function() {
        return this._kind;
    },
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
    /*
    This method is used to check if a wall at thscoord has a neighbour at nCoord. oDir is the direction nCoord is from thsCoord, and thsDir is 	   the direction thsCoord is from nCoord. If that condition holds, thsDir is added to nCoord's neighbour array, and oDir is added to thsCoord's neghbour array. The other cases handle wall tiles on the edge of the map.
    */
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
    mixins: [Game.Mixins.Tile_Mixins.Tile, Game.Mixins.Tile_Mixins.WallTile,
        Game.Mixins.General_Mixins.blocksSight, Game.Mixins.General_Mixins.obstructs],
    category: 'Wall',
    name: 'Wall'
};
Game.Templates.TileTemplates.FloorTile = {
    mixins: [Game.Mixins.Tile_Mixins.Tile, Game.Mixins.Tile_Mixins.FloorTile],
    category: 'Floor'
};
Game.Templates.TargetTemplates = {};
Game.Templates.TargetTemplates.Target = {
    category: 'Target',
    name: 'Target'
};
Game.Mixins.Stair_Mixins = {};
Game.Mixins.Stair_MixinsStair = {
    name: 'Stair_Tile',
    groupName: 'Stair',
};
Game.Templates.StairTemplates = {};
Game.Templates.StairTemplates.Stair = {
    category: 'Stair',
    name: 'Stair',
};
Game.Templates.DecorationTemplates = {};
Game.Templates.DecorationTemplates.SkullTile = {
    category: 'Decoration',
    name: 'Skull'
};
Game.Templates.DecorationTemplates.LeftChairTile = {
    category: 'Decoration',
    name: 'LeftChair'
};
Game.Templates.DecorationTemplates.RightChairTile = {
    category: 'Decoration',
    name: 'RightChair'
};
Game.Templates.DecorationTemplates.BedTile = {
    category: 'Decoration',
    name: 'Bed'
};
Game.Templates.DecorationTemplates.Table = {
    category: 'Decoration',
    name: 'Table',
    mixins: [Game.Mixins.General_Mixins.obstructs]
};
Game.Templates.DecorationTemplates.BoneTile = {
    category: 'Decoration',
    name: 'Bone',
};

Game.Templates.DecorationTemplates.shelf1 = {
    category: 'Decoration',
    name: 'Shelf1',
    mixins: [Game.Mixins.General_Mixins.blocksSight, Game.Mixins.General_Mixins.obstructs]

};
Game.Templates.DecorationTemplates.shelf2 = {
    category: 'Decoration',
    name: 'Shelf2',
    mixins: [Game.Mixins.General_Mixins.blocksSight, Game.Mixins.General_Mixins.obstructs]

};
Game.Templates.DecorationTemplates.bookShelf = {
    category: 'Decoration',
    name: 'Book Shelf',
    mixins: [Game.Mixins.General_Mixins.blocksSight, Game.Mixins.General_Mixins.obstructs]

};

Game.Templates.DecorationTemplates.pebbles = {
    category: 'Decoration',
    name: 'Pebbles'
};

Game.Templates.DecorationTemplates.grass = {
    category: 'Decoration',
    name: 'Grass'
};

Game.Templates.DecorationTemplates.pot = {
    category: 'Decoration',
    name: 'Pot'
};
Game.Templates.DecorationTemplates.brokenPot = {
    category: 'Decoration',
    name: 'Broken Pot'
};
Game.Mixins.Door_Mixins = {};
Game.Mixins.Door_Mixins.Door = {
    name: 'Door_Tile',
    groupName: 'Door',
    init: function() {
        this._obstructs = true;
        this._opacity = true;
    },
    // When a door is opened it is no longer opaque or obstructs, and the player should be notified.
    open: function(entity) {
        this._obstructs = false;
        this._opacity = false;
        this._tile = 'Open_Door';
        Game.queMessage("The " + entity._name +
                " opens the door.");
    }
};
Game.Templates.DoorTemplates = {};
Game.Templates.DoorTemplates.Door = {
    mixins: [Game.Mixins.Door_Mixins.Door], category: 'Door',
    name: 'Door'
};
Game.Templates.CorpseTemplates = {};
Game.Templates.CorpseTemplates.Corpse = {
    category: 'Grave',
    name: 'Grave'
};
Game.Mixins.Actor_Mixins = {};
Game.Templates.ActorTemplates = {};
Game.Mixins.Actor_Mixins.normalStrike = {
    name: 'normalStrike',
    groupName: 'Actor',
    // use this to attack
    strike: function(targetObj) {
        var att = this._base_attack; // get actor's inate attack stat
        if (this["_Sword"])
        {
            att += parseInt(this["_Sword"]["_Bonus"]) // add its sword bonus
        }
        Game.queMessage("The " + this._name +
                " hits the" + " " + targetObj._name + ".");
        // if an enemy has been hit, make it turn round
        if (targetObj._category === 'Enemy') {
           targetObj._targetX=this.x_coord; 
           targetObj._targetY=this.y_coord;
           targetObj.turnToTarget(targetObj);
           targetObj.drawTarget();
        } 
        // hit enemy.
        targetObj.isStruck(att, this);
           if((this._name+'')==="Player")
           {
	    this._hasAttacked=true; // used to check if sound should be played
	   }
    }
},
Game.Mixins.Actor_Mixins.arrowStrike = {
    name: 'arrowStrike',
    groupName: 'Actor',
    // see the strike attack method above; very similar.
    arrowStrike: function(targetObj) {
        var att = this._arrow_attack;
        if (targetObj["_Shield"])
        {
            if (targetObj["_Shield"]["_name"] === "Mithril Shield" &&
                    targetObj._shieldRaised)
            {
                Game.queMessage("The " + this._name +
                        " shoots an arrow but is wounded when the " + targetObj._name + "'s shield deflects it back!");
                this.isStruck(att, this);
                return;
            }
        }
        if (this["_Bow"])
        {
            att += parseInt(this["_Bow"]["_Bonus"])
        }
        Game.queMessage("The " + this._name +
                " shoots an arrow and wounds the " + " " + targetObj._name + ".");
                if (targetObj._category === 'Enemy') {
           targetObj._targetX=this.x_coord; 
           targetObj._targetY=this.y_coord;
           targetObj.turnToTarget(targetObj);
           targetObj.drawTarget();
        }
        targetObj.isStruck(att, this);
        this.Arrows--;
           if((this._name+'')==="Player")
           {
	    this._arrowShot=true;
	   }

    }
}

Game.Mixins.Actor_Mixins.clubStrike = {
    name: 'clubStrike',
    groupName: 'Actor',
    strike: function(targetObj) {
        var att = this._base_attack;
        // Before this actor attacks, it must raise its club
        if (!this._clubRaisedAt)
        {
            Game.queMessage("The " + this._name +
                    " raises his club to smash the" + " " + targetObj._name + "!");
            this._clubRaisedAt = targetObj.getCoord();
            Game.getPlayer().setImminentStrike(true);
            return;
        }
        // if club is raised and actor is attacking, but playe has moved out the way - he has dodged!
        else if (Game.getPlayer().getCoord() !== this._clubRaisedAt)
        {
            Game.queMessage("The Player Dodged the " + this._name + "'s club!");
            Game.queMessage("The " + this._name + " loses its balance.");
            this._clubRaisedAt = false;
            this._offBalance = true;
            return;
        }
        Game.queMessage("The " + this._name +
                " smashes the" + " " + targetObj._name + " with his club!");
        targetObj.isStruck(att, this);
        this._clubRaisedAt = false;
    }
}


Game.Mixins.Actor_Mixins.getsStruck = {
    name: 'getsStruck',
    groupName: 'Actor',
    isStruck: function(att) {
        var dam = 0;
        if (this._shieldRaised)
            dam = (att - this["_Shield"]["_Bonus"]);
        else
            dam = att;

        this.currHealth = Math.max(0, this.currHealth - dam)
        //check if dead
        if (this.currHealth <= 0)
        {
            this.dies();
              
	}
                else
        {
         if((this._name+'')==="Player")
           {
	    this._hasBeenHit=true;
	   }
        } 
    }
}

Game.Mixins.Actor_Mixins.Guards = {
    name: 'Guards',
    groupName: 'Actor',
    init: function() {
        // delayer is used to control the actor's rotation when idle; should only rotate every 2nd turn.
        this._delayer = false;
    },
    // actors should rotate when idle and at their home co-ordinates, which thet guard.
    idle: function() {
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
    }
}


Game.Mixins.Actor_Mixins.enemyDies = {
    name: 'Dies',
    groupName: 'Actor',
    dies: function() {
        Game.queMessage("The " + this._name + " dies!");
        //remove from schedule
        Map.takeFromSchedule(this);
        var key = this.x_coord + ',' + this.y_coord;
        var ents = Map.entities[key]
        // remove from  map
        delete ents[this._category + ''];
        // remove target, if one exists
        if(Map.entities[this._targetKey])
        	delete Map.entities[this._targetKey]['Target']
        ents['Corpse'] = new Game.Entity({template: Game.Templates.CorpseTemplates.Corpse});
    }
}

Game.Mixins.Actor_Mixins.hasShield = {
    name: 'hasShield',
    groupName: 'Actor',
    init: function() {
        this._shieldRaised = true;
    },
}

Game.Mixins.Actor_Mixins.playerDies = {
    name: 'Dies',
    groupName: 'Actor',
    dies: function() {
        //remove from schedule
        Game.queMessage("You Died! Reload the page to start again.");
        this.processMessages();
        this.drawFOV();
        this.refreshStatusDisplay();
        Game.Sounds.loseSound.play();
        this.clearSchedule();
    }
}

Game.Mixins.Actor_Mixins.Player = {
    name: 'Player',
    groupName: 'Actor',
    init: function() {
        this.a = 0
        this._messageDisplay = Game.getTextDisplay(); 
        this._statusDisplay = Game.getStatDisplay();
        this._messages = [],
                Game.setPlayerMessages(this._messages);
        this._imminentStrike = false; // used to track whether player is about to be hit
        this.setUpForFloor();
        Game.queMessage("Welcome! Write code and then press a key on this screen to control your character.")
    },
    setUpForFloor: function() {
        Map.addToSchedule(this); // Maked sure player gets their turns
        var that = this;
        var fovCallback = function(x, y) {
            if (Map.isClear(x + ',' + y, that.getOpacity))
                return true;
            return false;
        }; // callback used to calculate field of view: can't see through tile if it contains an opaque tile
        this._fov = new ROT.FOV.RecursiveShadowcasting(fovCallback);
        this._visible = {}; // tracks all visible co-ordinates.
        this._roomCenters = []; // need to keep track of room centers as they are used by this.explore*(
        var rooms = Map.getGrid().getRooms();
        for (var i = 0; i < rooms.length; i++) {
            var center =rooms[i].getCenter();
            //make the center one to the left, as centre may be impassible due to presence of table.
            this._roomCenters.push(center[0]-1+','+center[1]);
        }
        this._targetRoom = 0;
        this._seenStairCoord = null;
    },
    // Getting an item just updates the player's stats and removes it from the map.
    getsbonusItem: function(name, itemType, level, bonusAmount) {
        if (this['_' + itemType])
        {
            if (this['_' + itemType]["_level"] >= level)
            {
                Game.queMessage("The " + name + " is worse than your current " + itemType + ".");
                return false;
            }
        }
        this['_' + itemType]["_name"] = name;
        this['_' + itemType]["_level"] = level;
        this['_' + itemType]["_Bonus"] = bonusAmount;
        return true;
    },
    isLevelExplored: function() {
        return (this._targetRoom === this._roomCenters.length)
    },
    shootArrowAt: function(coord) {
        if (this.Arrows < 1)
        {
            Game.queMessage("You reach into your quiver and find it empty!");
            return;
        }
        var ents = Map.entities[coord];
        if (ents['Enemy'])
        {
            var enemy = ents['Enemy'];
            this.arrowStrike(enemy);
        }
        else
        {
            Game.queMessage("You can't shoot an arrow at something that isn't an enemy");
        }
    },
    descendSpottedStairs: function() {
        if (!this._seenStairCoord)
        {
            return;
        }
        else
        {
            var coord = this._seenStairCoord + '';
            var coordParts = coord.split(',');
            var ents = Map.getEntities();
            var Path = new ROT.Path.Dijkstra(parseInt(coordParts[0]), parseInt(coordParts[1]), function(x, y) {
                return ents[x + ',' + y]['Floor'];
            });// Path to stairs.
            var steps = []; // array of steps in the path
            Path.compute(this.x_coord, this.y_coord, function(x, y) {
                steps.push([x, y]);
            }); // fill the array
            if (steps.length > 1) // if we are not on the stairs, move towards them
            {
                var nextX = steps[1][0], nextY = steps[1][1];
                this.move(nextX, nextY);
            }
            else // otherwise start a new level.
            {
                Map.takeFromSchedule(this);
                Map.generateMap();
                Game.Sounds.stairSound.play();
            }

        }
    },
    setImminentStrike: function(boolean) {
        this._imminentStrike = boolean;
    },
        watchForStrike: function() {
        return this._imminentStrike;
    },
    processMessages: function() {
        this._messageDisplay.clear();
        Game._messages = Game._messages.join("\r\n");
        this._messageDisplay.drawText(1, 1, Game._messages + '', 23);
        Game._messages = [];
    },
    // called once each turn by scheduler
    act: function() {
        this.processSounds(); // plays sounds
        this.drawFOV(); // draws what the player can see
        Map.getEngine().lock(); // stops other actors acting
        this._shieldRaised = false; // puts down shield for this turn
        this._timesMoved = 0; // if this goes above 0, we can't move. prevents moving accross the map in one turn.
        window.addEventListener("keydown", this); // make window respond to key presses
        this.refreshStatusDisplay();
        this.processMessages();
        this.drawFOV();
    },
    // only one sound is played a turn, and they have an order of priority
    processSounds: function() {

        if(this._hasAttacked)
          {
           Game.Sounds.attackSound.play();             
          }
        else if(this._hasOpened)
          {
           Game.Sounds.doorSound.play(); 
          }
        else if(this._arrowShot)
          {
           Game.Sounds.arrowSound.play();   
          }
        else if(this._hasBeenHit)
          {
           Game.Sounds.hitSound.play();   
          }
        else if(this._hasDrank)
          {
           Game.Sounds.drinkSound.play();   
          }
        else if(this._hasPickedUp)
          {
           Game.Sounds.pickUpSound.play();   
          }
   this._hasPickedUp=false;
   this._hasOpened=false;
   this._hasBeenHit=false;
   this._hasAttacked=false;
   this._arrowShot=false;
   this._hasDrank=false;
    },

    raiseShield: function() {
        if (this._timesMoved++ > 0)
        {
            return;
        }
        this._shieldRaised = true;
        Game.queMessage("You raise your shield");
    },
    refreshStatusDisplay: function() {
        this._statusDisplay.clear();
        this._statusDisplay.drawText(1, 1, "Health: " + this.currHealth +
                "/" + this._max_health + "\r\n" + "Arrows: " + this.Arrows
                + "\r\n" + "Potions: " + this.Potions
                + "\r\n" + "Shield: " + this._Shield["_name"]
                + "\r\n" + "Sword: " + this._Sword["_name"]
                + "\r\n" + "Bow: " + this._Bow["_name"]);
    },
    canMove: function(direction) {
        var offset = ROT.DIRS[8][Game.directions[direction]];
        var newX = offset[0] + this.x_coord, newY = offset[1] + this.y_coord;
        var target = newX + ',' + newY;
        var callback = function() {
            var boolean = this.checkObstruction();
            if (this._category)
            {
                if (this._category === 'Enemy')
                    boolean = true
            }
            return boolean
        }// callback checks whether the tile contains an enemy or obstruction
        return Map.isClear(target, callback);
    },
    calculatePath: function(coord, ents) {
        var coordParts = coord.split(',');
        var that = this;
        return  new ROT.Path.Dijkstra(parseInt(coordParts[0]), parseInt(coordParts[1]), function(x, y) {
            if (ents[x + ',' + y]['Door'])
                return true;
            return Map.isClear(x + ',' + y, that.checkObstruction);// callback checks whether the tile contains an obstruction
        });//return a path free of obstructions, if there is one
    },
    countPotions: function() {
        return this.Potions;
    },
    countArrows: function() {
        return this.Arrows;
    },
    countHealth: function() {
        return this.currHealth;
    },
    exploreMap: function() {
        // if we have found the center of the last room, the map can no longer be explored
        if (!(this._targetRoom < this._roomCenters.length))
        {
            return false;
        }
        // otherwise fo to center of next room
        else
        {
            var coord = this._roomCenters[this._targetRoom] + '';

            var ents = Map.getEntities();
            var Path = this.calculatePath(coord, ents);
            var steps = [];
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
            }
            return true;
        }
    },
    // move once in a given direction, e.g., "N".
    step: function(direction) {
        var offset = ROT.DIRS[8][Game.directions[direction]];
        var newX = offset[0] + this.x_coord, newY = offset[1] + this.y_coord;
        this.move(newX, newY);
    },
    // enemy is an optional argument: if given only a specific type of enemy specified will be searched for
    lookForEnemies: function(enemy) {
        var enemies = []; // will contain the co-ordinated of enemies seen
        if (enemy)
            this._fov.compute(this.x_coord, this.y_coord, 8, function(x, y) {
                var coord = x + ',' + y;
                if (Map.entities[coord]['Enemy']) {
                    if (Map.entities[coord]['Enemy']['_name'] === enemy) {
                        enemies.push(coord);
                    }
                }
            });// looks for any enemies and pushes them to the array
        else
            this._fov.compute(this.x_coord, this.y_coord, 8, function(x, y) {
                var coord = x + ',' + y;
                if (Map.entities[coord]['Enemy']) {
                    enemies.push(coord);
                }
            });// looks for named enemies and pushes them to the array
        return enemies; // returns the array
    },
    // as above, but with items
    lookForItems: function(item) {
        var items = [];
        if (item)
        {
            this._fov.compute(this.x_coord, this.y_coord, 8, function(x, y) {
                var coord = x + ',' + y;
                if (Map.entities[coord]['Item'])
                    if (Map.entities[coord]['Item']['_name'] === item)
                    {
                        {
                            if (!Map.entities[coord]['Item'].beenLifted())
                                items.push(coord);
                        }
                    }
            });
        }
        else
        {
            this._fov.compute(this.x_coord, this.y_coord, 8, function(x, y) {
                var coord = x + ',' + y;
                if (Map.entities[coord]['Item']) {
                    if (!Map.entities[coord]['Item'].beenLifted())
                        items.push(coord);
                }
            });
        }
        return items;
    },
    pickUp: function() {
        var coord = this.x_coord + "," + this.y_coord;
        if (Map.entities[coord]['Item'])
        {
            var pickedUp = Map.entities[coord]['Item'].getsPickedUp(this);
            Map.entities[coord]['Item']._lifted = true;
            if (pickedUp)
            {
                delete Map.entities[coord]['Item'];
            }
            this._hasPickedUp=true;
        }
        else
        {
            Game.queMessage("There are no Items here.")
        }
    },
    getsMultiItem: function(item, amount) {
        Game.queMessage("You pick up " + amount + " " + item + ".");
        this[''+item] += amount;
        return true;
    },
    getsWinningItem: function() {
        //remove from schedule
        Game.queMessage("You found the treasure and won the game - Congratulations! Reload the page to start again.");
        this.processMessages();
        this.drawFOV();
        Game.Sounds.treasureSound.play();
        this.clearSchedule();
    },
    // attacks an enemy at a given co-ordinate
    attackEnemy: function(coord) {
        var ents = Map.getEntities();
        var Path = this.calculatePath(coord, ents);
        var steps = [];
        Path.compute(this.x_coord, this.y_coord, function(x, y) {
            steps.push([x, y]);
        });
        if (steps.length > 1)
        {
            var nextX = steps[1][0], nextY = steps[1][1];
            this.move(nextX, nextY);
        }
    },
    // moves one step toward a coordinate coord; returns true if arrived.
    goTo: function(coord) {
        var ents = Map.getEntities();
        var Path = this.calculatePath(coord, ents);
        var parts = coord.split(',')
        var steps = [];
        Path.compute(this.x_coord, this.y_coord, function(x, y) {
            steps.push([x, y]);
        });// calculate steps of path to destination
        if (steps.length > 1) // if note there, step towards it
        {
            var nextX = steps[1][0], nextY = steps[1][1];
            this.move(nextX, nextY);
        }
        if (this.x_coord === parseInt(parts[0]) && this.y_coord === parseInt(parts[1]))
            return true; // if there, return true.
    },
    // helper method for movement methods
    move: function(targetX, targetY) {
        if (this._timesMoved++ > 0)// don't move if we've done so this turn
            return;
        var ents = Map.entities[this.x_coord + ',' + this.y_coord];
        var target = targetX + ',' + targetY;
        var targEnts = Map.entities[target];
        if (Map.isClear(target, this.checkObstruction)) // check target tile is not obstructed (enemies are not obstructions)
        {
            if (targEnts['Enemy']) // if it has an enemy, hit it and return
            {
                this.strike(targEnts['Enemy']);
                return;
            }
            delete ents['Player']; //otherwise move player.
            this._facingStrike = false;
            this.x_coord = targetX, this.y_coord = targetY;
            targEnts['Player'] = this;
        }
        else if (targEnts['Door']) // if tile is obstructed by a door, open it.
        {
            targEnts['Door'].open(this);
            this._hasOpened=true;
        }
    },
    handleEvent: function(e) {
          // Only display error if we try to execute code
          Game.codeExecuted=false;
          // Don't execute code if we've just unpaused
          var justUnpaused=false
          if(e.keyCode==27) //  check if we pressed esc
          {
           if(this._paused) // if so and game is paused, unpause it
             {
              this._paused=false;
              justUnpaused=true;
              $(".brand").html("CodeQuest");
             }
           else
             {
              this._paused=true // otherwise pause it
               $(".brand").html("CodeQuest: Paused");
             }
          }
        var text
        if (this._paused||justUnpaused)
           text="Stop the Game" // this will be evaluated and will throw an error, pausing the game.
        else {
           text= $('#inputArea').val(); // get the text of the code the user has written
           text = "var timer = 0;"+text.replace(/{/g,"{timer++;if (timer>100000)throw ' - Code is taking too long to execute - modify for or while loop before identified brace -';") // inject code that prevents infinite loops by preventing too many braced instructions being executed.
           Game.codeExecuted=true
           }
        eval(text);         // exectite user code
        this._imminentStrike = false;
        window.removeEventListener("keydown", this); // stop listening for key-presses
        Map.getEngine().unlock(); // let other actors act.
    },
    // draw what the player can see
    drawFOV: function() {
        var display = Game.getDisplay();
        var seenLastTurn = this._visible; // Member of seenLastTurn will be fogged out if we cannot see them this turn
        var that = this;
        this._visible = {}; // tracks all coords we've seen this turn
        this._fov.compute(this.x_coord, this.y_coord, 8, function(x, y) {
            var key = x + ',' + y;
            var ents = Map.entities[key];
            if (ents['Enemy'])
            {
                var actor = ents['Enemy'];
                actor.setWhetherSeen(true);
                actor.drawTarget();// only draw the target (the thing that shows where an enemy is looking) if we can see it.
            }
            else if (ents['Stair'] && (!that._seenStairCoord))
            {
                that._seenStairCoord = key;
                Game.queMessage("There's the Stairs!");
            }// check if we've seen the stairs
            if (seenLastTurn[key]) // if we see a co-ordinate this turn remove it from seenLastTurn (we don't want to draw fog on it, then)
                delete seenLastTurn[key];
            var coordTiles = Map.getCoordTiles(key);
            display.draw(x, y, coordTiles); // draw all tiles at coord
            that._visible[key] = true; // and remember we've seen it
        });// contained code is executd for every coord we can see.
        for (key in seenLastTurn) // draw the fog
        {
            var keyParts = key.split(',');
            display.draw(keyParts[0], keyParts[1], 'Fogged');
        }
    },
    drinkPotion: function() {
        if (this.Potions < 1)
        {
            Game.queMessage("You have run out of Potions!")
        }
        else
        {
            this.currHealth = Math.min(this.currHealth + 30, this._max_health)
            Game.queMessage("You drink a Potion and feel better.")
            this.Potions--;
            this._hasDrank=true;
        }
    },
    checkForItem: function (itemName) {
        if ((this._Bow._name===itemName)||(this._Shield._name===itemName)||(this._Sword._name===itemName))
		return true
        else
     		return false
    }
};
Game.Mixins.Actor_Mixins.Enemy = {
    name: 'Enemy',
    groupName: 'Actor',
    init: function() {
        Map.addToSchedule(this);
        this._HomeX = this.x_coord; // Will guard it's home coords,if passed the guards mixin
        this._HomeY = this.y_coord; 
        this._steps = [];
        this._facing = Math.floor(Math.random()*8); // will randomly face in a certain direction at the stat
        this._targetX = null;
        this._targetY = null;
        this._whetherSeen = false;
        var that = this;
        var fovCallback = function(x, y) {
            if (Map.isClear(x + ',' + y, that.getOpacity))
                return true;
            return false;
        };
        this._fov = new ROT.FOV.RecursiveShadowcasting(fovCallback);
    },
    // helper method for act() function
    main: function() {
        this._messages = [];
        this._displacements = [];
        var that = this;
        var seen = false;
        var player;
        this._fov.compute180(this.x_coord, this.y_coord, 8, this._facing, function(x, y) {
            var coord = x + ',' + y;
            if (Map.entities[coord]['Player']) {
                player = Map.entities[coord]['Player'];
                that.pathToTarget(x, y);
                seen = true;
            }
        });// checks if player is spotted
        if (this._steps.length < 2 && (this._HomeX !== this.x_coord || this._HomeY !== this.y_coord))
            this.pathToTarget(this._HomeX, this._HomeY); // if not home, create a path home
        else if (!seen && this._HomeX === this.x_coord && this._HomeY === this.y_coord) // if home, perform idling behaviour
        {
            if (this.idle)
                this.idle();
        }
        var hasShot = false;
        if (seen) // if player is spotted
        {
            if (this.Arrows) // then if arrows are posessed.
            {
                this.arrowStrike(player); // shoot player
                hasShot = true;
            }
            this._fov.compute(this.x_coord, this.y_coord, 8, function(x, y) {
                var coord = x + ',' + y;
                if (Map.entities[coord]['Enemy']) {
                    var actor = Map.entities[coord]['Enemy'];
                    actor.turnToTarget(that);
                    actor.drawTarget();
                }
            }); // And regardless inform all other enemies in the vicinity of the player's presence
        }
        if (!hasShot) // if an arrow was not shot, move.
        {
            this.walkToTarget();
        }
        this.drawTarget(); // draws the facing-durection
        this.setWhetherSeen(false);
    },
    turnToTarget: function(actor) {
        this.pathToTarget(actor._targetX, actor._targetY);
        var xpoint = this._steps[1][0] - this.x_coord, ypoint = this._steps[1][1] - this.y_coord;
        var direction = xpoint + ',' + ypoint;
        this._facing = Game.offsets[direction];
    },
    // moves to next steo on the player's path
    walkToTarget: function() {
        if (this._steps.length && this._steps.length > 1) {
            this._steps.splice(0, 1);
            var nextX = this._steps[0][0], nextY = this._steps[0][1];
            var found = this.move(nextX, nextY);
            if (!found)
                this.turnToTarget(this);
            this.drawTarget();
        }
    },
    // Draws path to an x y coordinate
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
    // draws the facing drection  of the enemy with a candle
    drawTarget: function() {
        var offsetX = ROT.DIRS[8][this._facing][0]; // translates current facing direction to x,y offset
        var offsetY = ROT.DIRS[8][this._facing][1];
        if (this._targetKey)
            delete Map.entities[this._targetKey]['Target']; // if a target is already drawn, remove it
        if (!this._whetherSeen) // if enemy isn't seen, don't draw its target
            return;
        var targetX = offsetX + this.x_coord, targetY = offsetY + this.y_coord; // get where target should be drawn
        new Game.Entity({template: Game.Templates.TargetTemplates.Target, x_coord: targetX, y_coord: targetY}); // draw it
        this._targetKey = targetX + ',' + targetY; // remember where it is
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
            targEnts['Door'].open(this);
        }
        this.setDisplacements();
        return this.x_coord === this._targetX && this.y_coord === this._targetY;
    },
    // is used to track empty adjacent spaces
    setDisplacements: function() {
        var that = this;
        var callback = function(x, y) {
            var coord = x + ',' + y;
            if (Map.entities[coord]['Enemy'] || Map.entities[coord]['Player'])
                return true;
            if (!Map.isClear(coord, that.checkObstruction))
                return true;
        };
        var thisNbrs = Map.getNeighbCoords(this.x_coord, this.y_coord, callback);// get spaces adjacent to the actor not containing obstructions or enemies.
        var intersect = function(x, y) {
            if (!thisNbrs[x + ',' + y])
                return true;
        }
        var trgNbrs = Map.getNeighbCoords(this._targetX, this._targetY, intersect);// get spaces from thisNbrs adjacent to the actors target not containing obstructions or enemies.
        for (key in trgNbrs)
            this._displacements.push(key); // remember these
    },
    // is called when an enemy gets pushed ot the way by another
    getDisplaced: function() {
        var dsplm = this._displacements;
        var eligible = []; // will contain coords that this can be pushed into
        for (i = 0; i < dsplm.length; i++)
        {
            if (!(Map.entities[dsplm[i]]['Enemy'] || Map.entities[dsplm[i]]['Player']))
                eligible.push(dsplm[i]);
        }// if a coord in this._displacements does not contain an enemy or obstruction, this can be dosplaced into it.
        var coord = eligible[Math.floor(Math.random() * eligible.length)]// pick a random coord that this can be displaced into
        if (!eligible.length) // if none are eligible, return
            return false;
        var parts = coord.split(","); // otherwise move to the random eligible coord.
        this.move(parseInt(parts[0]), parseInt(parts[1]));
        return true;
    },
    setWhetherSeen: function(boolean) {
        this._whetherSeen = boolean;
    }
};
Game.Mixins.Actor_Mixins.Minotaur = {
    name: 'Minotaur',
    groupName: 'Actor',
    init: function() {
        this._clubRaisedAt = false;
    },
    act: function() {
        if (this._offBalance)// if minotaur missed, it will be offbalance and not do anything
        {
            this._offBalance = false;
            Game.queMessage("The " + this._name + " regains its balance.");
            return;
        }
        if (this._clubRaisedAt)
        {
            this.strike(Game.getPlayer());
            return;
        }
        this.main();
    }
};
Game.Mixins.Actor_Mixins.Plain = {
    name: 'Orc',
    groupName: 'Actor',
    act: function() {
        this.main();
    }
};
Game.Mixins.Actor_Mixins.shortSword = {
    name: 'Short Sword',
    groupName: 'Actor',
    init: function() {
        this._Sword = {
            _name: "Short Sword",
            _level: "1",
            _Bonus: "1"
        }
    }
};
Game.Mixins.Actor_Mixins.woodenBow = {
    name: 'Wooden Bow',
    groupName: 'Actor',
    init: function() {
        this._Bow = {
            _name: "Wooden Bow",
            _level: "1",
            _Bonus: "1"
        }
    }
};
Game.Mixins.Actor_Mixins.buckler = {
    name: 'Buckler',
    groupName: 'Actor',
    init: function() {
        this._Shield = {
            _name: "Buckler",
            _level: "1",
            _Bonus: "1"
        }
    }
};
Game.Mixins.Actor_Mixins.mShield = {
    name: 'Mithril Shield',
    groupName: 'Actor',
    init: function() {
        this._Shield = {
            _name: "Mithril Shield",
            _level: "3",
            _Bonus: "3"
        }
    }
};
Game.Templates.ActorTemplates.PlayerTemplate = {
    category: 'Player',
    name: 'Player',
    attributes: {
        _max_health: 1000,
        currHealth: 1000,
        _base_attack: 3,
        _base_defense: 3,
        Arrows: 5,
        Potions: 5,
        _arrow_attack: 5
    },
    mixins: [Game.Mixins.Actor_Mixins.Player,
        Game.Mixins.Actor_Mixins.woodenBow,
        Game.Mixins.Actor_Mixins.shortSword,
        Game.Mixins.Actor_Mixins.normalStrike,
        Game.Mixins.Actor_Mixins.arrowStrike,
        Game.Mixins.Actor_Mixins.buckler,
        Game.Mixins.Actor_Mixins.getsStruck,
        Game.Mixins.Actor_Mixins.playerDies]
};
Game.Templates.ActorTemplates.OrcTemplate = {
    category: 'Enemy',
    name: 'Orc',
    attributes: {
        _max_health: 10,
        currHealth: 10,
        _base_attack: 5,
        _base_defense: 1
    },
    mixins: [Game.Mixins.Actor_Mixins.Enemy,
        Game.Mixins.Actor_Mixins.Plain,
        Game.Mixins.Actor_Mixins.Guards,
        Game.Mixins.Actor_Mixins.normalStrike,
        Game.Mixins.Actor_Mixins.getsStruck,
        Game.Mixins.Actor_Mixins.enemyDies]
};
Game.Templates.ActorTemplates.OrcWarriorTemplate = {
    category: 'Enemy',
    name: 'Orc Warrior',
    attributes: {
        _max_health: 10,
        currHealth: 10,
        _base_attack: 5,
        _base_defense: 1
    },
    mixins: [Game.Mixins.Actor_Mixins.Enemy,
        Game.Mixins.Actor_Mixins.hasShield,
        Game.Mixins.Actor_Mixins.mShield,
        Game.Mixins.Actor_Mixins.Plain,
        Game.Mixins.Actor_Mixins.Guards,
        Game.Mixins.Actor_Mixins.normalStrike,
        Game.Mixins.Actor_Mixins.getsStruck,
        Game.Mixins.Actor_Mixins.enemyDies]
};
Game.Templates.ActorTemplates.ArcherTemplate = {
    category: 'Enemy',
    name: 'Archer',
    attributes: {
        _max_health: 10,
        currHealth: 10,
        _base_attack: 5,
        _base_defense: 1,
        Arrows: 10,
        _arrow_attack: 2
    },
    mixins: [Game.Mixins.Actor_Mixins.Enemy,
        Game.Mixins.Actor_Mixins.Plain,
        Game.Mixins.Actor_Mixins.arrowStrike,
        Game.Mixins.Actor_Mixins.Guards,
        Game.Mixins.Actor_Mixins.normalStrike,
        Game.Mixins.Actor_Mixins.getsStruck,
        Game.Mixins.Actor_Mixins.enemyDies]
};
Game.Templates.ActorTemplates.DogTemplate = {
    category: 'Enemy',
    name: 'Feral Dog',
    attributes: {
        _max_health: 5,
        currHealth: 5,
        _base_attack: 2,
        _base_defense: 1,
    },
    mixins: [Game.Mixins.Actor_Mixins.Enemy,
        Game.Mixins.Actor_Mixins.Plain,
        Game.Mixins.Actor_Mixins.normalStrike,
        Game.Mixins.Actor_Mixins.getsStruck,
        Game.Mixins.Actor_Mixins.enemyDies]
};
Game.Templates.ActorTemplates.MinotaurTemplate = {
    category: 'Enemy',
    name: 'Minotaur',
    attributes: {
        _max_health: 25,
        currHealth: 25,
        _base_attack: 20,
        _base_defense: 1
    },
    mixins: [Game.Mixins.Actor_Mixins.Minotaur,
        Game.Mixins.Actor_Mixins.Guards,
        Game.Mixins.Actor_Mixins.Enemy,
        Game.Mixins.Actor_Mixins.clubStrike,
        Game.Mixins.Actor_Mixins.getsStruck,
        Game.Mixins.Actor_Mixins.enemyDies]
};
Game.Mixins.Item_Mixins = {};
Game.Mixins.Item_Mixins.item = {
    name: 'Item',
    groupName: 'Item',
    beenLifted: function() {
        return this._lifted;
    }
}

Game.Mixins.Item_Mixins.winningItem = {
    name: 'winningItem',
    groupName: 'Item',
    getsPickedUp: function(actor) {
         actor.getsWinningItem();
    },
},

Game.Mixins.Item_Mixins.multiItem = {
    name: 'multiItem',
    groupName: 'Item',
    getsPickedUp: function(actor) {
        return actor.getsMultiItem(this._name, this._amount);
    },
},
        Game.Mixins.Item_Mixins.bonusItem = {
            name: 'bonusItem',
            groupName: 'Item',
            getsPickedUp: function(actor) {
                return actor.getsbonusItem(this._name, this._itemType, this._level, this._bonusAmount);
            }
        }
Game.Templates.Item_Templates = {};
Game.Templates.Item_Templates.arrowBundle = {
    category: 'Item',
    name: 'Arrows',
    attributes: {
        _amount: 5
    },
    mixins: [Game.Mixins.Item_Mixins.multiItem, Game.Mixins.Item_Mixins.item]
};
Game.Templates.Item_Templates.treasure = {
    category: 'Item',
    name: 'Treasure',
    mixins: [Game.Mixins.Item_Mixins.winningItem, Game.Mixins.Item_Mixins.item]
};

Game.Templates.Item_Templates.Potions = {
    category: 'Item',
    name: 'Potions',
    attributes: {
        _amount: 5
    },
    mixins: [Game.Mixins.Item_Mixins.multiItem, Game.Mixins.Item_Mixins.item]
};
Game.Templates.Item_Templates.copperShield = {
    category: 'Item',
    name: 'Copper Shield',
    attributes: {
        _name: "Copper Shield",
        _itemType: "Shield",
        _level: "2",
        _bonusAmount: "2"
    },
    mixins: [Game.Mixins.Item_Mixins.bonusItem, Game.Mixins.Item_Mixins.item]
};
Game.Templates.Item_Templates.mithrilShield = {
    category: 'Item',
    name: 'Mithril Shield',
    attributes: {
        _name: "Mithril Shield",
        _itemType: "Shield",
        _level: "3",
        _bonusAmount: "3"
    },
    mixins: [Game.Mixins.Item_Mixins.bonusItem, Game.Mixins.Item_Mixins.item]
};
Game.Templates.Item_Templates.ironSword = {
    category: 'Item',
    name: 'Iron Sword',
    attributes: {
        _name: "Iron Sword",
        _itemType: "Sword",
        _level: "2",
        _bonusAmount: "2"
    },
    mixins: [Game.Mixins.Item_Mixins.bonusItem, Game.Mixins.Item_Mixins.item]
};
Game.Templates.Item_Templates.mithrilSword = {
    category: 'Item',
    name: 'Mithril Sword',
    attributes: {
        _name: "Mithril Sword",
        _itemType: "Sword",
        _level: "3",
        _bonusAmount: "3"
    },
    mixins: [Game.Mixins.Item_Mixins.bonusItem, Game.Mixins.Item_Mixins.item]
};
Game.Templates.Item_Templates.longBow = {
    category: 'Item',
    name: 'Long Bow',
    attributes: {
        _name: "Long Bow",
        _itemType: "Bow",
        _level: "2",
        _bonusAmount: "2"
    },
    mixins: [Game.Mixins.Item_Mixins.bonusItem, Game.Mixins.Item_Mixins.item]
};
Game.Templates.Item_Templates.mithrilBow = {
    category: 'Item',
    name: 'Mithril Bow',
    attributes: {
        _name: "Mithril Bow",
        _itemType: "Bow",
        _level: "3",
        _bonusAmount: "3"
    },
    mixins: [Game.Mixins.Item_Mixins.bonusItem, Game.Mixins.Item_Mixins.item]
};

