/* 
Room templates contain mixins which place entities in the room in a certain way. This file contains these mixins and templates.
 */


Game.Mixins.Room_Mixins = {};

// Puts an entity made with a template at a random free co-ordinate in a room
var placeEntity = function(room, template) {
    var coord = room.getRandomPlace();
    if (coord)
    {
        var parts = coord.split(",");
        new Game.Entity({template: template,
            x_coord: parseInt(parts[0]), y_coord: parseInt(parts[1])});
    }
    else
        console.log("error")
}

// As above, but at the top of the room.
var placeEntityAtTop = function(room, template) {
    var coord = room.getRandomTopPlace();
    if (coord)
    {
        var parts = coord.split(",");
        var offset = [[-1, 0], [0, 1], [1, 0], [0, -1]];
        var canPlace = false;
        var callback = function() {
            var boolean = false;
            if (this._category)
            {
                if (this._category === 'Door')
                    boolean = true;
            }
            return boolean;
        }
        for (i = 0; i < 4; i++)
        {
            var xCoord = (parseInt(parts[0]) + offset[i][0])
            var yCoord = (parseInt(parts[1]) + offset[i][1])
            if (!(canPlace = Map.isClear(xCoord + ',' + yCoord, callback)))
                break
        }
        if (canPlace)
            new Game.Entity({template: template,
                x_coord: parseInt(parts[0]), y_coord: parseInt(parts[1])});
    }

}

// The init function of each room mixin places an entity/entities in any room built with a template which includes the room mixin in question.

Game.Mixins.Room_Mixins.hasPotions = {
    name: 'hasPotions',
    init: function() {
        placeEntity(this, Game.Templates.Item_Templates.Potions);
    }
}

Game.Mixins.Room_Mixins.hasDog = {
    name: 'hasDog',
    init: function() {
        placeEntity(this, Game.Templates.ActorTemplates.DogTemplate);
    }
}

Game.Mixins.Room_Mixins.hasArcher = {
    name: 'hasArcher',
    init: function() {
        placeEntity(this, Game.Templates.ActorTemplates.ArcherTemplate);
    }
}

Game.Mixins.Room_Mixins.hasOrc = {
    name: 'hasOrc',
    init: function() {
        placeEntity(this, Game.Templates.ActorTemplates.OrcTemplate);
    }
}

// minotaurs are surrounded by bones and skulls
Game.Mixins.Room_Mixins.hasMinotaur = {
    name: 'hasMinotaur',
    init: function() {
        placeEntity(this, Game.Templates.DecorationTemplates.SkullTile);
        for (i = 0; i < 4; i++)
        {
            placeEntity(this, Game.Templates.DecorationTemplates.BoneTile);
        }
        placeEntity(this, Game.Templates.ActorTemplates.MinotaurTemplate);
    }
}

// tables go in the middles of a room
Game.Mixins.Room_Mixins.hasTableSet = {
    name: 'hasTableSet',
    init: function() {
var parts = this._center.split(",");
            new Game.Entity({template: Game.Templates.DecorationTemplates.Table,
                x_coord: parseInt(parts[0]), y_coord: parseInt(parts[1])});
            new Game.Entity({template: Game.Templates.DecorationTemplates.LeftChairTile,
                x_coord: parseInt(parts[0])-1, y_coord: parseInt(parts[1])});
            new Game.Entity({template: Game.Templates.DecorationTemplates.RightChairTile,
                x_coord: parseInt(parts[0])+1, y_coord: parseInt(parts[1])});
    }
}

Game.Mixins.Room_Mixins.hasStairs = {
    name: 'hasStair',
    init: function() {
        placeEntity(this, Game.Templates.StairTemplates.Stair);
    }
}

Game.Mixins.Room_Mixins.hasArrows = {
    name: 'hasStair',
    init: function() {
        placeEntity(this, Game.Templates.Item_Templates.arrowBundle);
    }
}

Game.Mixins.Room_Mixins.hasShelf1 = {
    name: 'hasShelf1',
    init: function() {
        placeEntityAtTop(this, Game.Templates.DecorationTemplates.shelf1);
    }
}
Game.Mixins.Room_Mixins.hasBed = {
    name: 'hasBed',
    init: function() {
        placeEntityAtTop(this, Game.Templates.DecorationTemplates.BedTile);
    }
}

Game.Mixins.Room_Mixins.hasShelf2 = {
    name: 'hasShelf2',
    init: function() {
        placeEntityAtTop(this, Game.Templates.DecorationTemplates.shelf2);
    }
}

Game.Mixins.Room_Mixins.hasLongBow = {
    name: 'hasLongBow',
    init: function() {
        placeEntity(this, Game.Templates.Item_Templates.longBow);
    }
}

Game.Mixins.Room_Mixins.hasMithrilBow = {
    name: 'hasMithrilBow',
    init: function() {
        placeEntity(this, Game.Templates.Item_Templates.mithrilBow);
    }
}

Game.Mixins.Room_Mixins.hasIronSword = {
    name: 'hasIronSword',
    init: function() {
        placeEntity(this, Game.Templates.Item_Templates.ironSword);
    }
}

Game.Mixins.Room_Mixins.hasMithrilSword = {
    name: 'hasMithrilSword',
    init: function() {
        placeEntity(this, Game.Templates.Item_Templates.mithrilSword);
    }
}

Game.Mixins.Room_Mixins.hasBookShelf = {
    name: 'hasBookShelf',
    init: function() {
        placeEntityAtTop(this, Game.Templates.DecorationTemplates.bookShelf);
    }
}


Game.Mixins.Room_Mixins.hasBrokenPot = {
    name: 'hasBrokenPot',
    init: function() {
        placeEntity(this, Game.Templates.DecorationTemplates.brokenPot);
    }
}

Game.Mixins.Room_Mixins.hasTreasure = {
    name: 'hasTreasure',
    init: function() {
        placeEntity(this, Game.Templates.Item_Templates.treasure);
    }
}

Game.Mixins.Room_Mixins.hasGrass = {
    name: 'hasGrass',
    init: function() {
        placeEntity(this, Game.Templates.DecorationTemplates.grass);
    }
}

Game.Mixins.Room_Mixins.hasPebbles = {
    name: 'hasPebbles',
    init: function() {
        placeEntity(this, Game.Templates.DecorationTemplates.pebbles);
    }
}

Game.Mixins.Room_Mixins.hasPot = {
    name: 'hasPot',
    init: function() {
        placeEntity(this, Game.Templates.DecorationTemplates.pot);
    }
}

Game.Mixins.Room_Mixins.hasMithrilShield = {
    name: 'hasMithrilShield',
    init: function() {
        placeEntity(this, Game.Templates.Item_Templates.mithrilShield);
    }
}

Game.Mixins.Room_Mixins.hasCopperShield = {
    name: 'hasCopperShield',
    init: function() {
        placeEntity(this, Game.Templates.Item_Templates.copperShield);
    }
}



Game.Mixins.Room_Mixins.hasOrcWarrior = {
    name: 'hasOrcWarrior',
    init: function() {
        placeEntity(this, Game.Templates.ActorTemplates.OrcWarriorTemplate);
    }
}
Game.Templates.RoomTemplates = {}

// Room templates are arrays of room mixins: the room is created by having each of these mixins init functions called, which places the entities associated with them.
Game.Templates.RoomTemplates.BedRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasTableSet, Game.Mixins.Room_Mixins.hasBed, Game.Mixins.Room_Mixins.hasBookShelf, Game.Mixins.Room_Mixins.hasShelf1,Game.Mixins.Room_Mixins.hasPot]
};
Game.Templates.RoomTemplates.PotionRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasBookShelf,Game.Mixins.Room_Mixins.hasBookShelf,
    Game.Mixins.Room_Mixins.hasShelf1, Game.Mixins.Room_Mixins.hasShelf2, Game.Mixins.Room_Mixins.hasPot,
    Game.Mixins.Room_Mixins.hasBrokenPot,Game.Mixins.Room_Mixins.hasPotions]
};

Game.Templates.RoomTemplates.ArrowRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasBookShelf,Game.Mixins.Room_Mixins.hasBookShelf,
    Game.Mixins.Room_Mixins.hasShelf1, Game.Mixins.Room_Mixins.hasShelf2, Game.Mixins.Room_Mixins.hasPot,
    Game.Mixins.Room_Mixins.hasBrokenPot,Game.Mixins.Room_Mixins.hasArrows]
};


Game.Templates.RoomTemplates.OrcRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasOrc,Game.Mixins.Room_Mixins.hasOrc]
};

Game.Templates.RoomTemplates.EmptyRoom1 = {
    mixins: [Game.Mixins.Room_Mixins.hasGrass ,Game.Mixins.Room_Mixins.hasGrass,
    Game.Mixins.Room_Mixins.hasPebbles, Game.Mixins.Room_Mixins.hasPebbles]
};

Game.Templates.RoomTemplates.EmptyRoom2 = {
    mixins: [Game.Mixins.Room_Mixins.hasGrass ,Game.Mixins.Room_Mixins.hasGrass,
    Game.Mixins.Room_Mixins.hasPebbles, Game.Mixins.Room_Mixins.hasPebbles,
 Game.Mixins.Room_Mixins.hasBrokenPot]
};


Game.Templates.RoomTemplates.IronSwordRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasOrc,Game.Mixins.Room_Mixins.hasOrc,
    Game.Mixins.Room_Mixins.hasIronSword]
};

Game.Templates.RoomTemplates.CopperShieldRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasOrc,Game.Mixins.Room_Mixins.hasOrc,
    Game.Mixins.Room_Mixins.hasCopperShield]
};

Game.Templates.RoomTemplates.LongBowRoom= {
    mixins: [Game.Mixins.Room_Mixins.hasOrc,Game.Mixins.Room_Mixins.hasOrc,
    Game.Mixins.Room_Mixins.hasLongBow]
};

Game.Templates.RoomTemplates.ArcherRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasOrc,Game.Mixins.Room_Mixins.hasOrc,
        Game.Mixins.Room_Mixins.hasArcher]
};
Game.Templates.RoomTemplates.MithrilShieldRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasOrcWarrior,Game.Mixins.Room_Mixins.hasOrc,
    Game.Mixins.Room_Mixins.hasMithrilShield,Game.Mixins.Room_Mixins.hasOrcWarrior ]
};

Game.Templates.RoomTemplates.MithrilBowRoom= {
    mixins: [Game.Mixins.Room_Mixins.hasOrcWarrior,Game.Mixins.Room_Mixins.hasOrc,
    Game.Mixins.Room_Mixins.hasMithrilBow,Game.Mixins.Room_Mixins.hasOrcWarrior ]
};
Game.Templates.RoomTemplates.MithrilSwordRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasOrcWarrior,Game.Mixins.Room_Mixins.hasOrc,
    Game.Mixins.Room_Mixins.hasMithrilSword,Game.Mixins.Room_Mixins.hasOrcWarrior ]
};

Game.Templates.RoomTemplates.DogRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasDog,Game.Mixins.Room_Mixins.hasDog,
        Game.Mixins.Room_Mixins.hasDog,Game.Mixins.Room_Mixins.hasDog,
    Game.Mixins.Room_Mixins.hasGrass ,Game.Mixins.Room_Mixins.hasGrass,
    Game.Mixins.Room_Mixins.hasPebbles, Game.Mixins.Room_Mixins.hasPebbles]
};

Game.Templates.RoomTemplates.MinotaurRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasMinotaur]
};

Game.Templates.RoomTemplates.Treasure = {
    mixins: [Game.Mixins.Room_Mixins.hasTreasure]
};

Game.Templates.RoomTemplates.StairRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasStairs]
};

Game.Templates.RoomTemplates.TestRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasIronSword,
    Game.Mixins.Room_Mixins.hasIronSword,
Game.Mixins.Room_Mixins.hasIronSword,Game.Mixins.Room_Mixins.hasIronSword,
Game.Mixins.Room_Mixins.hasIronSword,Game.Mixins.Room_Mixins.hasIronSword,
Game.Mixins.Room_Mixins.hasIronSword,
Game.Mixins.Room_Mixins.hasIronSword,Game.Mixins.Room_Mixins.hasIronSword,
Game.Mixins.Room_Mixins.hasIronSword,Game.Mixins.Room_Mixins.hasIronSword,
Game.Mixins.Room_Mixins.hasIronSword,Game.Mixins.Room_Mixins.hasIronSword,
Game.Mixins.Room_Mixins.hasIronSword,
Game.Mixins.Room_Mixins.hasIronSword,Game.Mixins.Room_Mixins.hasIronSword]
};
