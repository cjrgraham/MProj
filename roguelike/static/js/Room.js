Game.Room = function(properties) {
    properties = properties || {};
    var room = properties['Room'] || {};
    var center = room.getCenter() + '';
    var parts = center.split(",");
    this._xCenter = parseInt(parts[0]);
    this._yCenter = parseInt(parts[1]);
    this._xMin = parseInt((room.getLeft()));
    this._xMax = parseInt((room.getRight()));
    this._yMin = parseInt((room.getTop()));
    this._yMax = parseInt((room.getBottom()));
    this._freeCoords = [];
    for (x = this._xMin; x < this._xMax; x++)
    {
        for (y = this._yMin; y < this._yMax; y++)
        {
          this._freeCoords.push(x+','+y);        
        }
    }
    console.log(this._freeCoords);
    Game.Element.call(this, properties);

};

Game.Room.prototype.constructor = Game.Element;

Game.Room.prototype.getRandomPlace = function() {
    var coord = this._freeCoords[Math.floor(Math.random()*this._freeCoords.length)];
    this._freeCoords.splice(coord,1);
    return coord;
}