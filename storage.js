//Stores data. May be later reworked to use a database but currently uses local storage

//TODO: fail gracefully if browser doesn't support localStorage

//namespacing
var voxmod = voxmod || {};
voxmod.storage = voxmod.storage || {};

voxmod.storage.save= function(key, object){
    localStorage.setItem(key, JSON.stringify(object));
};

voxmod.storage.load = function(key, object) {
    var item = localStorage.getItem(key);
    if (item) {
        return JSON.parse(item);
    }
    return null;
};
