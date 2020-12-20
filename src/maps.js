// List of possible characters for defining a map tile
var map_sprites = {
    'w': {'map': 24*7},            // Water
    'g': {'map': 1},               // Grass
    'f': {'map': 1, 'sprite': 6},  // Forests
    'm': {'map': 1, 'sprite': 10}  // Mountains
}

// The description printed in the side panel
var map_descriptions = {
    'w': 'water',
    'g': 'field',
    'f': 'forest',
    'm': 'mountain'
}

// Sprites for roads and shore tiles
var road_sprites = [2,71,77,70,71,71,72,66,77,84,77,63,86,65,64,78]
var water_tile = 168
var shore_straight = [203,197,205,211]
var shore_turn_in = [191,189,175,177]
var shore_turn_out = [196,198,212,210]


// Maps contain the actual list of map elements and the starting places for
// players

// Test map, all grass
var map_0 = {
    map: [
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'],
    ['g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g']
    ],
    start: {
        white: {x: 4, y:4},
        green: {x: 4, y:4}
    }
}



// A very crowded map
var map_1 = {
    map: [
    ['w','w','w','w','w','w','g','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','g','m','f','g','g','g','w','w','w','w','w','w','w','w'],
    ['w','w','g','f','m','g','g','g','w','w','w','w','w','w','w','w','w'],
    ['w','g','g','g','m','g','g','f','w','w','w','w','w','w','w','w','w'],
    ['w','g','g','g','m','g','g','g','w','w','w','w','w','w','w','w','w'],
    ['w','g','f','g','g','g','g','w','w','w','w','w','w','w','w','w','w'],
    ['w','g','f','g','f','g','g','w','w','w','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','g','w','w','w','w','w','w','w','w','w','w'],
    ['w','g','f','g','g','f','g','g','w','w','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','g','g','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w']
    ],
    start: {
        white: {x: 6, y:1},
        green: {x: 6, y:7},
        blue: {x: 2, y:2},
        red: {x: 1, y:9}
    },
}

// Shows basic elements on an empty map
var tutorial_1 = {
    map: [
    ['w','w','w','w','w','w','g','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','g','m','f','g','g','g','w','w','w','w','w','w','w','w'],
    ['w','w','g','f','m','g','g','g','w','w','w','w','w','w','w','w','w'],
    ['w','g','g','g','m','g','g','f','w','w','w','w','w','w','w','w','w'],
    ['w','g','g','g','m','g','g','g','w','w','w','w','w','w','w','w','w'],
    ['w','g','f','g','g','g','g','w','w','w','w','w','w','w','w','w','w'],
    ['w','g','f','g','f','g','g','w','w','w','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','g','w','w','w','w','w','w','w','w','w','w'],
    ['w','g','f','g','g','f','g','g','w','w','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','g','g','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w']
    ],
    start: {
        white: {x: 2, y:4}
    },
    at_start: function(){
        game.popup({
            title: "Tutorial",
            text: "Text",
            next: {
                title: "Tutorial",
                text: "Page 2"
            }
        });
    },
    on_update: function(){
        if(this.city_click != undefined && $("#city").hasClass("active")){
            this.city_click = true;
            game.popup({
                title: "Tutorial",
                text: "The city panel has opened on the left. Your first city starts from level 1 and has "+
                "1 free worker. The city also produces influence for you. your influence spreads at the "+
                "each turn. Click 'Next Turn' to see it spread."
            });
        }
        if(this.turn_2 != undefined && game.turn > 1){
            this.turn_2 = true;
            game.popup({
                title: "Tutorial",
                text: "You now control four tiles around your city. In the city panel you can set your "+
                "worker to produce either food or wood, thanks to the field and forest tiles around the "+
                "city. It is better to produce food right now. The people in the city need food and food "+
                "makes the city grow.",
                next: {
                    title: "Tutorial",
                    text: "Once you have some food, you can start producing a colony. It is a good idea to"+
                    "have some more workers first, since preparing a colony takes a lot of food." +
                    "When you are ready, build a colony."
                }

            });
        }
        if(this.colony != undefined && game.player.colonies > 0){
            this.turn_2 = true;
            game.popup({
                title: "Tutorial",
                text: "Great! You can now send your colony to establish a new city in the 'home' menu. "+
                "Cities cannot be established too close to the original, so you might have to click "+
                "'Next Turn' a couple more times first. Build your second city."
            });
        }
        if(this.two_cities != undefined && game.cities.length > 2){
            this.two_cities = true;
            game.popup({
                title: "Tutorial",
                text: "Your second city will take a few turns to flourish, but rest assured it will.",
                next: {
                    title: "Tutorial",
                    text: "You can also build roads in the home tab. Roads make culture flow more easily "+
                    "and can be used to control its flow."
                }
            });
        }
    }
}




// Generate a random map from a couple of parameters
function random_map(size_x, size_y, water_amount, water_continuity, forest_amount, mountains, island, players){
    map = {}
    map.map = [];
    for(var x = 0; x < size_x; x++) {
        map.map[x] = [];
        for(var y = 0; y < size_y; y++) {
            map.map[x][y] = undefined;
        }
    }

    if(island){
        for(var x = 0; x < size_x; x++) {
            map.map[x][0] = 'w';
            map.map[x][size_y-1] = 'w';
        }
        for(var y = 0; y < size_y; y++) {
            map.map[0][y] = 'w';
            map.map[size_x-1][y] = 'w';
        }
    }
    for(var x = 0; x < size_x; x++) {
        for(var y = 0; y < size_y; y++) {
            if(map.map[x][y] == undefined){
                var water = 0;
                if(map.map[(x+1+size_x)%size_x][y] == 'w'){
                    water += 1;
                }
                if(map.map[(x-1+size_x)%size_x][y] == 'w'){
                    water += 1;
                }
                if(map.map[x][(y+1+size_y)%size_y] == 'w'){
                    water += 1;
                }
                if(map.map[x][(y-1+size_y)%size_y] == 'w'){
                    water += 1;
                }
                var choice = 0;
                choice = Math.floor(Math.random() * 100 - water*water_continuity - water_amount);
                if(choice > 0){
                    var choice = Math.floor(Math.random() * 500 );
                    if(choice < mountains){
                        var n_mounts = Math.floor(Math.random() * 5 )+1;
                        map.map[x][y] = 'm';
                        var a = x; var b = y;
                        for(var n=0; n<n_mounts;n++){
                            map.map[a][b] = 'm';
                            if(Math.floor(Math.random() * 2 ) > 0){
                                a = (a+1)%size_x;
                            } else {
                                b = (b+1)%size_y;
                            }
                        }
                    } else {
                        var choice = Math.floor(Math.random() * 100 );
                        if(choice > (forest_amount)){
                            map.map[x][y] = 'g';
                        } else {
                            map.map[x][y] = 'f';
                        }
                    }
                } else {
                    map.map[x][y] = 'w';
                }
            }
        }
    }

    min_distance = Math.min(0.2*(size_x*size_x + size_y*size_y), 9);
    map.start = {};
    for(key in players){
        var player = players[key];
        var accepted = false;
        var n;
        for(n = 0; n<10000 && !accepted;n++){
            accepted = true;
            var x = Math.floor(Math.random() * size_x);
            var y = Math.floor(Math.random() * size_y);
            map.start[player] = { y: x, x: y };
            if( map.map[x][y] != 'g' ){
                accepted = false;
            } else {
                for(other_key in players){
                    var other_player = players[other_key];
                    if(other_key != key && map.start[other_player]){
                        var x2 = map.start[other_player].y;
                        var y2 = map.start[other_player].x;
                        var dx = (x-x2+size_x)%size_x;
                        var dy = (y-y2+size_y)%size_y;
                        if(dx > size_x/2) {
                            dx = size_x - dx;
                        }
                        if(dy > size_x/2) {
                            dy = size_x - dy;
                        }
                        if( (dx*dx+dy*dy) < min_distance ){
                            accepted = false;
                        }
                    }
                }
            }
        }
    }

    return map;
}




