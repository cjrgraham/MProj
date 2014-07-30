/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Game.Mixins.Room_Mixins = {};

var placeEntity = function(room, template) {
    var coord = room.getRandomPlace();
    if (coord)
    {
        var b = coord.split(",");
        new Game.Entity({template: template,
            x_coord: parseInt(b[0]), y_coord: parseInt(b[1])});
    }
}

Game.Mixins.Room_Mixins.hasOrc = {
    name: 'hasOrc',
    init: function() {
        placeEntity(this, Game.Templates.ActorTemplates.OrcTemplate);
    }
}

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

Game.Mixins.Room_Mixins.hasStairs = {
    name: 'hasStair',
    init: function() {
        placeEntity(this, Game.Templates.StairTemplates.Stair);
    }
}

Game.Templates.RoomTemplates = {}

Game.Templates.RoomTemplates.EasyRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasOrc]
};

Game.Templates.RoomTemplates.MinotaurRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasMinotaur]
};

Game.Templates.RoomTemplates.StairRoom = {
    mixins: [Game.Mixins.Room_Mixins.hasStairs]
};