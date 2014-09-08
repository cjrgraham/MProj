/*
Rooms are elements which are not located at a co-ordinate
*/

Game.Room = function(properties) {
    properties = properties || {};
    var room = properties['Room'] || {};
    this._center = room.getCenter() + '';
    var parts = this._center.split(",");
    this._xCenter = parseInt(parts[0]);
    this._yCenter = parseInt(parts[1]);
    this._xMin = parseInt((room.getLeft()));
    this._xMax = parseInt((room.getRight()));
    this._yMin = parseInt((room.getTop()));
    this._yMax = parseInt((room.getBottom()));
    this._freeCoords = [];
    // Record all the free co-ordinates in the room.
    for (counter = 0, x = this._xMin; x <= this._xMax; x++, counter++)
    {
        this._freeCoords.push([x, []]);
        for (y = this._yMin; y <= this._yMax; y++)
        {
            this._freeCoords[counter][1].push(y);
        }

    }
    // Room center should always be empty so it can contain impassible scenery
    this._freeCoords[(parts[0]-this._xMin)][1].splice(parts[1]-this._yMin, 1);
    Game.Element.call(this, properties);
};


// Extend Game.Element
Game.Room.prototype.constructor = Game.Element;

/*
Returns a random co-ordinate in the room. Can specify the x co-ordinate desired with suppliedX.
After co-ordinate is returned, it is removed from freecoords
*/
Game.Room.prototype.getRandomPlace = function(suppliedX) {
    var xIndex = null;
    var yIndex = null;
    try {
        if (suppliedX)
        {
            xIndex = parseInt(suppliedX);
            yIndex = 0;
        }
        else
        {
            xIndex = Math.floor(Math.random() * this._freeCoords.length)
            yIndex = Math.floor(Math.random() * this._freeCoords[xIndex][1].length)
        }
        var xCoord = this._freeCoords[xIndex][0]
        var yCoord = this._freeCoords[xIndex][1][yIndex]
        this._freeCoords[xIndex][1].splice(yIndex, 1);
        if (!this._freeCoords[xIndex][1].length)
            this._freeCoords.splice(xIndex, 1);
        return xCoord + ',' + yCoord;
    }
    catch (err)
    {
    }
}

// Returns a random co-ordinate at the top of the room. Used to place decoration.
Game.Room.prototype.getRandomTopPlace = function() {
    var freePlace = [];
    for (x = 0; x < this._freeCoords.length; x++)
    {
        if (this._freeCoords[x][1][0] === this._yMin)
            freePlace.push(x);
    }
    if (freePlace)
    {
        var Place = Math.floor(Math.random() * freePlace.length)
        return this.getRandomPlace(freePlace[Place] + "");
    }
    else
        return null;
}
