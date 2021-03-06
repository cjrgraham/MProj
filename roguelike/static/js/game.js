/*
The game object contains the game data that persists between levels, e.g., the displays, their settings, and methods to manipulate them.
*/

var Game = {
    _display: null,
    _screenWidth: 79,
    _screenHeight: 24,
    init: function() {
        var tileSet = document.createElement('img');
        tileSet.src =  DJANGO_STATIC_URL+'img/tileset.png';
        //tileSet.src = 'tileset.png';
        var options = {
            layout: 'tile',
            bg: 'transparent',
            tileWidth: 16,
            tileHeight: 16,
            tileSet: tileSet,
            // A mapping of strings to images.
            tileMap: Game.imageMap
        };
        this._display = new ROT.Display(options);
        this._textDisplay = new ROT.Display({width: 25, height: 70});
        this._statDisplay = new ROT.Display({width: 25, height: 10});
    },
    getTextDisplay: function() {
        return this._textDisplay;
    },
    getStatDisplay: function() {
        return this._statDisplay;
    },
    clearDisplay: function() {
        for (x = 0; x <= this._screenWidth; x++)
        {
            for (y = 0; y <= this._screenHeight; y++)
            {
                this._display.draw(x, y, null, '#EEEEEE', '#EEEEEE')
            }
        }
    },
    getDisplay: function() {
        return this._display;
    },
    getWidth: function() {
        return this._screenWidth;
    },
    getHeight: function() {
        return this._screenHeight;
    },
    setPlayer: function(player) {
        this._player = player;
    },
    getPlayer: function() {
        return this._player;
    },
    setPlayerMessages: function(messages){
        this._messages=messages;
    },
    queMessage: function(message){
        this._messages.push(message);
    }
};
