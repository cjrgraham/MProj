// Code taken from https://github.com/jokeofweek/jsrogue/blob/part8a/assets/entity.js
// It has been changed slightly so that the constructor can take auxilliary arguments
// other than collecitons of templates (by making properties an array containing an
// object rather than just an object).

Game.Entity = function(properties) {
    properties = properties || [];
    this._tile = null;
    this._obstructs = false;
    this._opacity=false;
    this.x_coord=properties[1];
    this.y_coord=properties[2];
    // Create an object which will keep track what mixins we have
    // attached to this entity based on the name property
    this._attachedMixins = {};
    // Create a similar object for groups
    this._attachedMixinGroups = {};
    // Setup the object's mixins
    var mixins = properties[0]['mixins'] || [];
    for (var i = 0; i < mixins.length; i++) {
        // Copy over all properties from each mixin as long
        // as it's not the name or the init property. We
        // also make sure not to override a property that
        // already exists on the entity.
        for (var key in mixins[i]) {
            if (key != 'init' && key != 'name' && !this.hasOwnProperty(key)) {
                this[key] = mixins[i][key];
            }
        }
        // Add the name of this mixin to our attached mixins
        this._attachedMixins[mixins[i].name] = true;
        // If a group name is present, add it
        if (mixins[i].groupName) {
            this._attachedMixinGroups[mixins[i].groupName] = true;
        }
        // Finally call the init function if there is one
        if (mixins[i].init) {
            mixins[i].init.call(this, properties);
        }
    }
};

Game.Entity.prototype.hasMixin = function(obj) {
    // Allow passing the mixin itself or the name / group name as a string
    if (typeof obj === 'object') {
        return this._attachedMixins[obj.name];
    } else {
        return this._attachedMixins[obj] || this._attachedMixinGroups[obj];
    }
}

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