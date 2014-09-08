window.onload = function() {
    Game.init();
    var playField = Game.getDisplay().getContainer()
    $('#gameArea').append(playField);
    //
    $('#gameArea').dragscrollable();
    $('#gameArea').slimScroll({width: '95%',
        height: '20%'})
    //
    var messageField = Game.getTextDisplay().getContainer()
    $('#messages').append(messageField);
    $('#messages').slimScroll({
        height: '200px'
    });
    var statusField = Game.getStatDisplay().getContainer()
    $('#status').append(statusField);

    Map.generateMap();

    Map.getEngine().start();
    console.log(ROT.RNG.getSeed());
}
