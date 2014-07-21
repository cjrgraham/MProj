var Game = {
    _display: null,
    _screenWidth: 79,
    _screenHeight: 24,
    init: function() {
        tileSet = document.createElement('img');
        tileSet.src =  DJANGO_STATIC_URL+'img/tileset.png';
        //tileSet.src =  'tileset.png';
        var options = {
            layout: 'tile',
            bg: 'transparent',
            tileWidth: 16,
            tileHeight: 16,
            tileSet: tileSet,
            tileMap: Game.imageMap
        };
        this._display = new ROT.Display(options);
        this._textDisplay = new ROT.Display({width: 25, height:70});
    },
    getTextDisplay: function() {
        return this._textDisplay;
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
    }
};
