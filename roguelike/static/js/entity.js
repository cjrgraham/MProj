// Code adapted from https://github.com/jokeofweek/jsrogue/blob/part8a/assets/entity.js


Game.Entity = function(properties) {
    properties = properties || {};
    this.x_coord = properties['x_coord'];
    this.y_coord = properties['y_coord'];
    Game.Element.call(this, properties);
    var key = this.x_coord + ',' + this.y_coord;
    if (!Map.entities[key])
        Map.entities[key] = {};
    Map.entities[key][this._category + ''] = this;
    if (properties['template']['attributes'])
    {
        var atts = properties['template']['attributes'];
        for (key in atts)
            this[key] = atts[key]
    }
};

Game.Entity.prototype.constructor = Game.Element;

Game.Entity.prototype.setTile = function(char) {
    this._tile = char;
},
        Game.Entity.prototype.getOpacity = function() {
            return this._opacity;
        }
Game.Entity.prototype.getTile = function() {
    return this._tile;
}
Game.Entity.prototype.checkObstruction = function() {
    return this._obstructs;
}