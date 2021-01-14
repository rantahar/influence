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
    'g': 'grassland',
    'f': 'forest',
    'm': 'mountain'
}


// Maps contain the actual list of map elements and the starting places for
// the players
// They may also have an at_start function and an on_update function.

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


/// A small island map for the tutorials
var tutorial_map = [
['w','w','w','w','w','w','g','w','w','w','w','w','w'],
['w','w','w','g','m','f','g','g','g','w','w','w','w'],
['w','w','g','f','m','g','g','g','w','w','w','w','w'],
['w','g','g','g','m','g','g','f','w','w','w','w','w'],
['w','g','g','g','m','g','g','g','w','w','w','w','w'],
['w','g','f','g','g','g','g','w','w','w','w','w','w'],
['w','g','f','g','f','g','g','w','w','w','w','w','w'],
['w','g','g','g','g','g','g','w','w','w','w','w','w'],
['w','g','f','g','g','f','g','g','w','w','w','w','w'],
['w','g','g','g','g','g','g','g','w','w','w','w','w'],
['w','w','w','w','w','w','w','w','w','w','w','w','w'],
['w','w','w','w','w','w','w','w','w','w','w','w','w'],
['w','w','w','w','w','w','w','w','w','w','w','w','w'],
['w','w','w','w','w','w','w','w','w','w','w','w','w'],
['w','w','w','w','w','w','w','w','w','w','w','w','w'],
['w','w','w','w','w','w','w','w','w','w','w','w','w'],
];



// SHows the elements and explains the rules
var tutorial_1 = {
    map: tutorial_map,
    start: {
        white: {x: 2, y:4}
    },
    at_start: function(){
        game.popup({
            title: "Tutorial",
            text: "You are the god of the small settlement surrounded by white borders. "+
            "You are ambitious and aspire to spread your influence to every corner of the world. "+
            "First, click on your home city on the map."
        });
        $('#panel-tabs li a').removeClass("active");
        $("#home-tab").addClass("active");
    },
    on_update: function(){
        if(this.city_click == undefined && $("#city-tab").hasClass("active")){
            this.city_click = true;
            game.popup({
                title: "Tutorial",
                text: "The city panel has opened on the left. Your first city starts with population 1, "+
                "but it grows as it produces surplus food. The city's influence starts at 3 and " +
                "grows by 1 every 3 population points. "+
                "Your influence will spread from the city once you click 'Next Turn'."
            });
        }
        if(this.turn_2 == undefined && game.turn > 1){
            this.turn_2 = true;
            game.popup({
                title: "Tutorial",
                text: "The cities influence has spread to the neighbouring tiles. Naturally your influence "+
                "on the neighbour tiles is naturally a bit less than on the city. After each turn the "+
                "your influence on grass tiles is the maximum of it's neighbours minus 1. For forest "+
                "and water tiles the reduction is 2 and for cities there is no reduction. "+
                "You cannot influence mountain tiles.",
                next:{
                  title: "Tutorial",
                  text: "In the city panel you see that you have one worker producing food. "+
                  "The worker can produce either food or wood, thanks "+
                  "to the field and forest tiles around the city. "+
                  "It is better to produce food in the beginning, since this helps the city grow and get "+
                  "more workers.",
                  next: {
                    title: "Tutorial",
                    text: "Once you have a few workers, you should start producing a colony. When building "+
                    "a colony, all the city's food production goes towards the cost of the colony "+
                    "and the city does not grow. The colony costs is "+city_items.colony.price+" food. "+
                    "Any free workers will also contribute by 1 food per turn."
                  }
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
                text: "Your second city will take a few turns to flourish, but rest assured it will. "+
                "When you have many cities, the influence from the biggest often dominates over several "+
                "smaller ones. The small cities don't add to your influence, but the can produce wood.",
                next: {
                    title: "Tutorial",
                    text: "Next, gather "+
                    home_items.field.price.wood+
                    " wood."
                }
            });
        }
        if(this.wood_for_field == undefined && game.player.wood >= home_items.field.price.wood){
            this.wood_for_field = true;
            this.goal_next_turn = true;
            game.popup({
                title: "Tutorial",
                text: "Now you can build a field or a road in the home screen. Each field allows one worker "+
                "to produce one more food per turn. "+
                "Roads allow influence to spread more easily. The reduction in "+
                "influence is halved.",
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

// Introduces other players in general and the blue player specifically
var tutorial_2 = {
    map: tutorial_map,
    start: {
        white: {x: 2, y:4},
        blue:  {x: 6, y:1}
    },
    at_start: function(){
        game.popup({
            title: "Tutorial",
            text: "Now you have competition. Blue is the messenger. "+
            "Where it has control, it will build roads to connect cities, whether the cities "+
            "belong to it or to someone else.",
            next: {
                title: "Tutorial",
                text: "Any tile, including cities, belong to whoever has the highest influence "+
                "there. You can take over enemy cities by building a bigger city close by. You can "+
                "also lose cities. When you take over a city, remember to check that the workers "+
                "are doing something useful.",
                next: {
                    title: "Tutorial",
                    text: "Other gods have the same win conditions as you."
                }
            }
        });
    }
}


// Introduces the green player
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
        green: {x: 7, y:4}
    },
    at_start: function(){
        game.popup({
            title: "Tutorial",
            text: "Green is the god of agriculture. "+
            "It likes to build fields and grow large cities. "+
            "Remember that the god with the most influence wins after 200 turns. "+
            "It does not matter how many tiles you own then."
        });
    }
}

// Introduces the red player
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
            text: "Red is the god of war. It's influence cannot mix with others. This can give "+
            "you an edge in an otherwise symmetric situation."
        });
    }
}

// Introduces the violet player
var tutorial_5 = {
    map: tutorial_map,
    start: {
        white: {x: 2, y:4},
        violet:  {x: 5, y:5}
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
