// List of possible characters for defining a map tile
var map_sprites = {
    'w': {map: 1},   // Water
    'g': {map: 0},   // Grass
    'f': {map: 0, decor: ['foresttile',0]},   // Forests
    'm': {map: 2}    // Mountains
}

// The description printed in the side panel
var map_descriptions = {
    'w': 'water',
    'g': 'field',
    'f': 'forest',
    'm': 'mountain'
}


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
        green: {x: 16, y:16}
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
    ['w','w','w','w','w','w','g','w','w','w','w','w','w','w'],
    ['w','w','w','g','m','f','g','g','g','w','w','w','w','w'],
    ['w','w','g','f','m','g','g','g','w','w','w','w','w','w'],
    ['w','g','g','g','m','g','g','f','w','w','w','w','w','w'],
    ['w','g','g','g','m','g','g','g','w','w','w','w','w','w'],
    ['w','g','f','g','g','g','g','w','w','w','w','w','w','w'],
    ['w','g','f','g','f','g','g','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','g','w','w','w','w','w','w','w'],
    ['w','g','f','g','g','f','g','g','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','g','g','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w']
    ],
    start: {
        white: {x: 2, y:4}
    },
    at_start: function(){
        game.popup({
            title: "Tutorial",
            text: "You are the god of the small settlement you see surrounded by white borders. "+
            "But you are ambitious and aspire to spread your influence to very corner of the world. "+
            "First, click on your home city on the map."
        });
    },
    on_update: function(){
        if(this.city_click == undefined && $("#city-tab").hasClass("active")){
            this.city_click = true;
            game.popup({
                title: "Tutorial",
                text: "The city panel has opened on the left. Your first city starts from level 1, but it "+
                "grows as it produces more food. The city also produces influence for you. Your influence "+ "spreads at the end of each turn. Click 'Next Turn' to see it spread."
            });
        }
        if(this.turn_2 == undefined && game.turn > 1){
            this.turn_2 = true;
            game.popup({
                title: "Tutorial",
                text: "You now control four tiles around your city. In the city panel you see that you have "+
                "one worker, currently producing food. The worker can produce either food or wood, thanks "+
                "to the field and forest tiles around the city. "+
                "It is better to produce food in the beginning, since this helps the city grow and get "+
                "more workers.",
                next: {
                    title: "Tutorial",
                    text: "Once you have some food, you can start producing a colony. When building a colony, "+
                    "all the cities food production goes towards the cost of the colony, "+items.colony_cost+
                    " food, and the city does not grow. Any free workers will also contribute by 1 per turn."
                }

            });
        }
        if(this.colony == undefined && game.player.colonies > 0){
            this.colony = true;
            game.popup({
                title: "Tutorial",
                text: "Great! You can now send your colony to establish a new city in the 'home' menu. "+
                "Cities cannot be established too close to the original, so you might have to click "+
                "'Next Turn' a couple more times first. Build your second city."
            });
        }
        if(this.two_cities == undefined && game.cities.length > 1){
            this.two_cities = true;
            this.goal_next_turn = true;
            game.popup({
                title: "Tutorial",
                text: "Your second city will take a few turns to flourish, but rest assured it will.",
                next: {
                    title: "Tutorial",
                    text: "Wood is used to build improvements. Roads help you spread your influence "+
                    "and fields help your cities grow faster and bigger. Next, gather "+items.field_cost+
                    " wood."
                }
            });
        }
        if(this.wood_for_field == undefined && game.player.wood >= items.field_cost){
            this.wood_for_field = true;
            this.goal_next_turn = true;
            game.popup({
                title: "Tutorial",
                text: "Now you can build a field in the home screen. Each field allows a worker to produce "+
                "one more food per turn. Roads allow your influence to flow more quickly, but they do not "+
                "increase the overall amount.",
                next: {
                    title: "Tutorial",
                    text: "Your goal is to spread your influence as far as you can. Since there are "+
                    "no other gods on this island, you can take your time. You win when you control "+
                    "more than half of the world or have more influence than anyone else after 200 "+
                    "turns."
                }
            });
        }
    }
}

// Shows basic elements on an empty map
var tutorial_2 = {
    map: [
        ['w','w','w','w','w','w','g','w','w','w','w','w','w','w'],
        ['w','w','w','g','m','f','g','g','g','w','w','w','w','w'],
        ['w','w','g','f','m','g','g','g','w','w','w','w','w','w'],
        ['w','g','g','g','m','g','g','f','w','w','w','w','w','w'],
        ['w','g','g','g','m','g','g','g','w','w','w','w','w','w'],
        ['w','g','f','g','g','g','g','w','w','w','w','w','w','w'],
        ['w','g','f','g','f','g','g','w','w','w','w','w','w','w'],
        ['w','g','g','g','g','g','g','w','w','w','w','w','w','w'],
        ['w','g','f','g','g','f','g','g','w','w','w','w','w','w'],
        ['w','g','g','g','g','g','g','g','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w']
        ],
        start: {
        white: {x: 2, y:4},
        blue:  {x: 6, y:1}
    },
    at_start: function(){
        game.popup({
            title: "Tutorial",
            text: "Now you have competition. Blue is the messenger."+
            "Where it has control, it will build roads to connect cities, whether the cities"+
            "belong to it or to someone else.",
            next: {
                title: "Tutorial",
                text: "Other gods have the same win conditions as you."
            }
        });
    }
}


// Shows basic elements on an empty map
var tutorial_3 = {
    map: [
        ['w','w','w','w','w','w','g','w','w','w','w','w','w','w'],
        ['w','w','w','g','m','f','g','g','g','w','w','w','w','w'],
        ['w','w','g','f','m','g','g','g','w','w','w','w','w','w'],
        ['w','g','g','g','m','g','g','f','w','w','w','w','w','w'],
        ['w','g','g','g','m','g','g','g','w','w','w','w','w','w'],
        ['w','g','f','g','g','g','g','w','w','w','w','w','w','w'],
        ['w','g','f','g','f','g','g','w','w','w','w','w','w','w'],
        ['w','g','g','g','g','g','g','w','w','w','w','w','w','w'],
        ['w','g','f','g','g','f','g','g','w','w','w','w','w','w'],
        ['w','g','g','g','g','g','g','g','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w']
        ],
    start: {
        white: {x: 2, y:4},
        green: {x: 6, y:7}
    },
    at_start: function(){
        game.popup({
            title: "Tutorial",
            text: "Green is the god of agriinfluence. "+
            "It likes to build fields and grow large cities. "+
            "Remember that the god with the most influence wins after 200 turns. "+
            "It does not matter how many tiles you own then."
        });
    }
}

// Shows basic elements on an empty map
var tutorial_4 = {
    map: [
        ['w','w','w','w','w','w','g','w','w','w','w','w','w','w'],
        ['w','w','w','g','m','f','g','g','g','w','w','w','w','w'],
        ['w','w','g','f','m','g','g','g','w','w','w','w','w','w'],
        ['w','g','g','g','m','g','g','f','w','w','w','w','w','w'],
        ['w','g','g','g','m','g','g','g','w','w','w','w','w','w'],
        ['w','g','f','g','g','g','g','w','w','w','w','w','w','w'],
        ['w','g','f','g','f','g','g','w','w','w','w','w','w','w'],
        ['w','g','g','g','g','g','g','w','w','w','w','w','w','w'],
        ['w','g','f','g','g','f','g','g','w','w','w','w','w','w'],
        ['w','g','g','g','g','g','g','g','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w']
        ],
    start: {
        white: {x: 2, y:4},
        blue:  {x: 6, y:9},
        red:  {x: 1, y:8}
    },
    at_start: function(){
        game.popup({
            title: "Tutorial",
            text: "Red is the god of war. It's influence cannot mix with others. This can give"+
            "you an edge in an otherwise symmetric situation."
        });
    }
}

// Shows basic elements on an empty map
var tutorial_5 = {
    map: [
        ['w','w','w','w','w','w','g','w','w','w','w','w','w','w'],
        ['w','w','w','g','m','f','g','g','g','w','w','w','w','w'],
        ['w','w','g','f','m','g','g','g','w','w','w','w','w','w'],
        ['w','g','g','g','m','g','g','f','w','w','w','w','w','w'],
        ['w','g','g','g','m','g','g','g','w','w','w','w','w','w'],
        ['w','g','f','g','g','g','g','w','w','w','w','w','w','w'],
        ['w','g','f','g','f','g','g','w','w','w','w','w','w','w'],
        ['w','g','g','g','g','g','g','w','w','w','w','w','w','w'],
        ['w','g','f','g','g','f','g','g','w','w','w','w','w','w'],
        ['w','g','g','g','g','g','g','g','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
        ['w','w','w','w','w','w','w','w','w','w','w','w','w','w']
        ],
    start: {
        white: {x: 2, y:4},
        purple:  {x: 5, y:5}
    },
    at_start: function(){
        game.popup({
            title: "Tutorial",
            text: "Violet engulfs all things. It is the god of growth and of competition, "+
            "whether winning or losing."
        });
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
        for(var y=0; y < 6; y++){
          map.map[x][y] = 'w';
        }
      }
      for(var y = 0; y < size_y; y++) {
        for(var x = 0; x < 6; x++) {
          map.map[x][y] = 'w';
        }
      }
    }
    for( x=0; x < size_x/2; x++ ){
      for(var y = 0; y < size_y/2; y++) {
        if(map.map[x][y] == undefined){
          draw_tile(map,x,y,size_x,size_y,water_amount, water_continuity, forest_amount, mountains, island);
        }
        if(map.map[size_x-x-1][y] == undefined){
          draw_tile(map,size_x-x-1,y,size_x,size_y,water_amount, water_continuity, forest_amount, mountains, island);
        }
        if(map.map[x][size_y-y-1] == undefined){
          draw_tile(map,x,size_y-y-1,size_x,size_y,water_amount, water_continuity, forest_amount, mountains, island);
        }
        if(map.map[size_x-x-1][size_y-y-1] == undefined){
          draw_tile(map,size_x-x-1,size_y-y-1,size_x,size_y,water_amount, water_continuity, forest_amount, mountains, island);
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
            map.map[x][y] = 'g';
        }
    }

    return map;
}


function draw_tile(map,x,y,size_x,size_y,water_amount, water_continuity, forest_amount, mountains, island){
  if(map.map[x][y] == undefined){
    var water = 0;
    if(map.map[(x+1)%size_x][y] == 'w'){
      water += 1;
    }
    if(map.map[(x-1+size_x)%size_x][y] == 'w'){
      water += 1;
    }
    if(y%2) {
      if(map.map[x][(y+1)%size_y] == 'w'){
        water += 1;
      }
      if(map.map[(x+1)%size_x][(y+1)%size_y] == 'w'){
        water += 1;
      }
      if(map.map[x][(y-1+size_y)%size_y] == 'w'){
        water += 1;
      }
      if(map.map[(x+1)%size_x][(y-1+size_y)%size_y] == 'w'){
        water += 1;
      }
    } else {
      if(map.map[(x-1+size_x)%size_x][(y+1)%size_y] == 'w'){
        water += 1;
      }
      if(map.map[x][(y+1)%size_y] == 'w'){
        water += 1;
      }
      if(map.map[(x-1+size_x)%size_x][(y-1+size_y)%size_y] == 'w'){
        water += 1;
      }
      if(map.map[x][(y-1+size_y)%size_y] == 'w'){
        water += 1;
      }
    }

    if(water < 2){
      water = 0;
    }

    var water_prob = water*water_continuity + water_amount;
    var choice = 0;
    choice = Math.floor(Math.random() * 100);
    if(choice >= water_prob){
      choice -= water_prob;
      var choice = Math.floor(Math.random() * 100 );
      if(choice < mountains){
        map.map[x][y] = 'm';
      } else {
          var choice = Math.floor(Math.random() * 100 );
          if(choice >= forest_amount){
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
