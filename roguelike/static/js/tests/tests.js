QUnit.module( "module", {
  setup: function( assert ) {
    Game.init();
    Map.generateMap();
  },
  teardown: function( assert ) {
    Map.setLevel(0);
  }
});

QUnit.test( "Check Player is placed correctly", function(assert) {
// When splitting coords, x is first, y second.
var player = Game.getPlayer();
var coord = player.getCoord();
var ents = Map.getEntities();
assert.ok(ents[coord]['Player']===player,"Player is on map where he should be")
});

QUnit.test( "Can Step North into Empty Space", function(assert) {
// When splitting coords, x is first, y second.
var player = Game.getPlayer();
var currCoord = player.getCoord();
var parts = currCoord.split(',');
player.step('N')
var laterCoord = player.getCoord();
var laterParts = laterCoord.split(',');
assert.equal( parts[0], laterParts[0], "Internal player X coordinate is same from moving north" );
assert.equal( parts[1]-1, laterParts[1], "Internal player Y coordinate is one less" );
var ents = Map.getEntities();
assert.ok(ents[parts[0]+','+(parts[1]-1)]['Player']===player,"Character is at new coordinate on the map after moving")
assert.ok(!(ents[currCoord]['Player']),"And absent from the old map coordinate")
});

QUnit.test( "Can't Step North into occupied Space", function(assert) {
// When splitting coords, x is first, y second.
var player = Game.getPlayer();
var currCoord = player.getCoord();
var parts = currCoord.split(',');
// Place table 1 coord north of player to block movement.
var table = new Game.Entity({template: Game.Templates.DecorationTemplates.Table, x_coord: parseInt(parts[0]), y_coord: parseInt(parts[1])-1}); 
player.step('N')
var ents = Map.getEntities(); 
// Check table is there.
assert.ok(ents[parts[0]+','+parseInt(parts[1]-1)]["Decoration"]===table,"Table is present one square north")
// Check it obstructs
assert.ok(table.checkObstruction(),"Table obstructs")
var laterCoord = player.getCoord();
var laterParts = laterCoord.split(',');
assert.equal( parts[0], laterParts[0], "Internal player X coordinate is same after attempting to move" );
assert.equal( parts[1], laterParts[1], "Internal player Y coordinate same" );
var ents = Map.getEntities();
assert.ok(ents[currCoord]['Player']===player,"Should still be at same position on the Map")
assert.ok(!(ents[parts[0]+','+(parts[1]-1)]['Player']),"Should not be at one coordinate North on the Map after attempting to move")
});

QUnit.test( "Moving North through door takes 2 steps", function(assert) {
// When splitting coords, x is first, y second.
var player = Game.getPlayer();
var currCoord = player.getCoord();
var parts = currCoord.split(',');
// Place Door 1 coord north of player.
var door = new Game.Entity({template: Game.Templates.DoorTemplates.Door, x_coord: parseInt(parts[0]), y_coord: parseInt(parts[1])-1}); 
var ents = Map.getEntities(); 
// Check Door is there.
assert.ok(ents[parts[0]+','+parseInt(parts[1]-1)]["Door"]===door,"Door is present one square north")
// Check it obstructs
assert.ok(door.checkObstruction(),"Door obstructs before opening")
player.step('N')
// Check it does not obstruct when opened
assert.ok(!door.checkObstruction(),"Door does not obstruct after opening")
var laterCoord = player.getCoord();
var laterParts = laterCoord.split(',');
assert.equal( parts[0], laterParts[0], "Internal player X coordinate is same after stepping into closed door.");
assert.equal( parts[1], laterParts[1], "Internal player Y coordinate same" );
var ents = Map.getEntities();
assert.ok(ents[currCoord]['Player']===player,"Should still be at same position on the Map, as door is closed")
assert.ok(!(ents[parts[0]+','+(parts[1]-1)]['Player']),"Should not be at one Y coordinate North on the Map")
player.step('N')
assert.ok(ents[parts[0]+','+(parts[1]-1)]['Player']===player,"Character is at new coordinate on the map after moving, as door is now opened")
assert.ok(!(ents[currCoord]['Player']),"And absent from the old map coordinate")
});

QUnit.test( "Arrow shot at Shielded enemy gets deflected back", function(assert) {
// When splitting coords, x is first, y second.
var player = Game.getPlayer();
var oldHealth = player.currHealth;
var currCoord = player.getCoord();
var parts = currCoord.split(',');
// Place Enemy 1 coord north of player.
var enemy = new Game.Entity({template: Game.Templates.ActorTemplates.OrcWarriorTemplate, x_coord: parseInt(parts[0]), y_coord: parseInt(parts[1]-1)}); 
var ents = Map.getEntities(); 
// Check enemy is there.
assert.ok(ents[parts[0]+','+parseInt(parts[1]-1)]["Enemy"]===enemy,"Enemy is present one square north before shooting")
// Shoot enemy.
player.shootArrowAt(enemy.getCoord());
assert.ok(player.currHealth<oldHealth, "Player was damaged by the deflected arrow");
});

QUnit.test( "Arrow shot at Non-Shielded enemy hurts it", function(assert) {
// When splitting coords, x is first, y second.
var player = Game.getPlayer();
var currCoord = player.getCoord();
var parts = currCoord.split(',');
// Place Enemy 1 coord north of player.
var enemy = new Game.Entity({template: Game.Templates.ActorTemplates.MinotaurTemplate, x_coord: parseInt(parts[0]), y_coord: parseInt(parts[1]-1)}); 
var oldHealth = enemy.currHealth;
var ents = Map.getEntities(); 
// Check enemy is there.
assert.ok(ents[parts[0]+','+parseInt(parts[1]-1)]["Enemy"]===enemy,"Enemy is present one square north before shooting")
// Shoot enemy.
player.shootArrowAt(enemy.getCoord());
assert.ok((enemy.currHealth<oldHealth), "Enemy was damaged by shot arrow");
});

QUnit.test( "Shooting Arrow depletes Arrows", function(assert) {
// When splitting coords, x is first, y second.
var player = Game.getPlayer();
var oldArrows = player.countArrows();
var currCoord = player.getCoord();
var parts = currCoord.split(',');
// Place Enemy 1 coord north of player.
var enemy = new Game.Entity({template: Game.Templates.ActorTemplates.MinotaurTemplate, x_coord: parseInt(parts[0]), y_coord: parseInt(parts[1]-1)}); 
var ents = Map.getEntities(); 
// Check enemy is there.
assert.ok(ents[parts[0]+','+parseInt(parts[1]-1)]["Enemy"]===enemy,"Enemy is present one square north before shooting")
// Kill enemy.
player.shootArrowAt(enemy.getCoord());
assert.ok((player.countArrows()===oldArrows-1), "Arrows decremented");
});

QUnit.test( "Drinking potions heals", function(assert) {
// When splitting coords, x is first, y second.
var player = Game.getPlayer();
// Lower health so it can be healed.
var lowerHealth = 500;
player.currHealth = lowerHealth;
player.drinkPotion();
assert.ok((player.countHealth()>lowerHealth), "Player healed by drinking potion");
});

QUnit.test( "Drinking potions depletes potions", function(assert) {
// When splitting coords, x is first, y second.
var player = Game.getPlayer();
oldPotions = player.countPotions();
player.drinkPotion();
assert.ok((player.Potions=oldPotions-1), "Potions decremented due to drinking potion");
});

QUnit.test( "Attacking enemies kills and removes them from map", function(assert) {
// When splitting coords, x is first, y second.
var player = Game.getPlayer();
var currCoord = player.getCoord();
var parts = currCoord.split(',');
// Give Player very strong attack;
player._base_attack=300;
// Place Enemy 1 coord north of player.
var enemy = new Game.Entity({template: Game.Templates.ActorTemplates.OrcWarriorTemplate, x_coord: parseInt(parts[0]), y_coord: parseInt(parts[1]-1)});
// Check enemy is there.
var ents = Map.getEntities(); 
assert.ok(ents[parts[0]+','+parseInt(parts[1]-1)]["Enemy"]===enemy,"Enemy is present one square north before attacking")
// Kill enemy
player.step('N')
assert.ok(ents[currCoord]['Player']===player,"Should still be at same position on the Map after attempting to move, as enemy was blocking movement")
assert.ok(!(ents[parts[0]+','+(parts[1]-1)]['Player']),"Should not be at one Y coordinate North on the Map")
// Check enemy is gone
assert.ok(!ents[parts[0]+','+parseInt(parts[1]-1)]["Enemy"],"Enemy has been removed from Map by being struck and killed")
// Move where enemy was
player.step('N')
assert.ok(ents[parts[0]+','+(parts[1]-1)]['Player']===player,"Character is at new coordinate on the map after moving, as enemy was killed")
assert.ok(!(ents[currCoord]['Player']),"And absent from the old map coordinate")
});

QUnit.test( "Picking up multi-item increases player's count of that item and removes item from map", function(assert) {
var player = Game.getPlayer();
var currCoord = player.getCoord();
// When splitting coords, x is first, y second.
var parts = currCoord.split(',');
// Place item on same coord as player.
var item = new Game.Entity({template: Game.Templates.Item_Templates.Potions, x_coord: parseInt(parts[0]), y_coord: parseInt(parts[1])});
var ents = Map.getEntities(); 
assert.ok(ents[parts[0]+','+parseInt(parts[1])]["Item"]===item,"Item is present before picking it up")
// Count how many potions we have pickUp
var oldCount = player.countPotions();
player.pickUp();
// Check item is removed from map
assert.ok(!ents[parts[0]+','+parseInt(parts[1])]["Item"],"Item is removed from map after being picked up")
assert.ok(player.countPotions()>oldCount, "And number of items of that type is increased" );
});

QUnit.test( "Picking up bonus-item changes player's bonus-item of that item type and removes item from map", function(assert) {
var player = Game.getPlayer();
var currCoord = player.getCoord();
// When splitting coords, x is first, y second.
var parts = currCoord.split(',');
// Place item on same coord as player.
var item = new Game.Entity({template: Game.Templates.Item_Templates.longBow, x_coord: parseInt(parts[0]), y_coord: parseInt(parts[1])});
//record old item
var oldItem = player["_"+item._itemType]["_name"];
var ents = Map.getEntities(); 
assert.ok(ents[parts[0]+','+parseInt(parts[1])]["Item"]===item,"Item is present before picking it up")
player.pickUp();
// Check item is removed from map
assert.ok(!ents[parts[0]+','+parseInt(parts[1])]["Item"],"Item is removed from map after being picked up")
// Check that player item is changed
assert.ok(player["_"+item._itemType]["_name"]!==oldItem,"Player inventory has changed")
// Check that player has the item on the ground
assert.ok(player["_"+item._itemType]["_name"]==item._name,"And now includes the right item")
});

QUnit.test("Enemies melee properly", function(assert) {
// When splitting coords, x is first, y second.
var player = Game.getPlayer();
var oldHealth = player.countHealth();
var currCoord = player.getCoord();
var parts = currCoord.split(',');
// Place Enemy 1 coord north of player.
var enemy = new Game.Entity({template: Game.Templates.ActorTemplates.OrcWarriorTemplate, x_coord: parseInt(parts[0]), y_coord: parseInt(parts[1])-1});
// Check enemy is there.
var ents = Map.getEntities(); 
assert.ok(ents[parts[0]+','+parseInt(parts[1]-1)]["Enemy"]===enemy,"Enemy is present one square north before attacking")
// Make enemy strike
enemy.move(parts[0],parts[1])
assert.ok(oldHealth>player.countHealth(),"Player health is reduced after being struck")
assert.ok(ents[parts[0]+','+parseInt(parts[1]-1)]["Enemy"]===enemy,"Enemy is still where it was")
});

QUnit.test("Ranged enemies shoot properly", function(assert) {
// When splitting coords, x is first, y second.
var player = Game.getPlayer();
var oldHealth = player.countHealth();
var currCoord = player.getCoord();
var parts = currCoord.split(',');
// Place Enemy 1 coord north of player.
var enemy = new Game.Entity({template: Game.Templates.ActorTemplates.ArcherTemplate, x_coord: parseInt(parts[0]), y_coord: parseInt(parts[1])-1});
// Check enemy is there.
var ents = Map.getEntities(); 
assert.ok(ents[parts[0]+','+parseInt(parts[1]-1)]["Enemy"]===enemy,"Enemy is present one square north before attacking")
// Make enemy shoot.
enemy.arrowStrike(player)
assert.ok(oldHealth>player.countHealth(),"Player health is reduced after being struck by Arrow")
});

QUnit.test("Descending stairs creates new level", function(assert) {
// When splitting coords, x is first, y second.
var player = Game.getPlayer();
var currCoord = player.getCoord();
var parts = currCoord.split(',');
// Place  stairs below player.
var stairs = new Game.Entity({template: Game.Templates.StairTemplates.Stair, x_coord: parseInt(parts[0]), y_coord: parseInt(parts[1])});
// Check stairs is there.
var ents = Map.getEntities(); 
assert.ok(ents[currCoord]["Stair"]===stairs,"Stairs are present")
assert.ok(ents[currCoord]["Player"]===player,"As is the player")
// Look for stairs
player.drawFOV();
// Check level = 0
assert.ok(Map._level===1,"Next Level is 1")
player.descendSpottedStairs();
// Check level = 0
assert.ok(Map._level===2,"Descended Stairs: Next Level is 2")
var newPlayer = Game.getPlayer();
var newEnts = Map.getEntities();
assert.ok(!(newEnts[newPlayer.getCoord()]["Stair"]),"And the stairs are gone")
assert.ok(newEnts[newPlayer.getCoord()]["Player"]===newPlayer,"But the new player is present")
});
