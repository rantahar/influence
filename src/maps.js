
var map_sprites = {
    'w': {'map': 24*7},
    'g': {'map': 1},
    'f': {'map': 1, 'sprite': 6},
    'm': {'map': 1, 'sprite': 10}
}


var map_descriptions = {
    'w': 'water',
    'g': 'field',
    'f': 'forest'
}

var city_sprites = [7,8,8,9,9,14,14,15,15,15,15,15]
var building_cite_sprite = 5*7+3

var road_sprites = [2,71,77,70,71,71,72,66,77,84,77,63,86,65,64,78]

var water_tile = 168
var shore_straight = [203,197,205,211]
var shore_turn_in = [191,189,175,177]
var shore_turn_out = [196,198,212,210]

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



// A very growded map
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
    }
}








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




