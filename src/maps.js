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
['w','f','g','g','m','g','g','g','w','w','w','w','w'],
['w','g','g','g','g','g','g','g','w','w','w','w','w'],
['w','g','f','g','f','g','g','g','g','w','w','w','w'],
['w','g','g','g','g','g','g','g','w','w','w','w','w'],
['w','g','f','g','g','f','g','g','w','w','w','w','w'],
['w','g','g','g','g','g','g','g','w','w','w','w','w'],
['w','w','w','w','w','w','w','w','w','w','w','w','w'],
['w','w','w','w','w','w','w','w','w','w','w','w','w'],
['w','w','w','w','w','w','w','w','w','w','w','w','w'],
['w','w','w','w','w','w','w','w','w','w','w','w','w'],
['w','w','w','w','w','w','w','w','w','w','w','w','w'],
['w','w','w','w','w','w','w','w','w','w','w','w','w'],
];



// Shows the elements and explains the rules
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
                text: "<p>The city panel has opened on the left. Your first city starts with population"+
                "1 and will grow when the growth meter is full. This will happend in 10 turns. "+
                "</p><p>You have 10 influence on the city, "+
                "and this will also grow if you take care of your city. "+
                "Your influence will spread from the city once you click 'Next Turn'.</p>"
            });
        }
        if(this.turn_2 == undefined && game.turn > 1){
            this.turn_2 = true;
            game.popup({
                title: "Tutorial",
                text: "<p>The city's influence has spread to the neighbouring tiles and you "+
                "control them now. "+
                "This means thay your city can collects food from the grass and water tiles "+
                "and wood from the forest tile."+
                "</p><p>The wood goes directly to your empires shared reserves (home panel). "+
                "The city keeps the food it produces. When amount of food produced is higher "+
                "than the citys population, the growth meter will keep filling. "+
                "</p>",
                next: {

                title: "Tutorial",
                text: "<p>You can click on the tiles to see your influence on each."+
                "Notice that don't have quite as much influence on the neighbour tiles as in " +
                "your city.</p>"+
                "<p>When influence spreads to a grass tile, it gets reduced by 3. " +
                "On forest and water tiles it is reduced by 4. It does not "+
                "spread to mountain tiles.</p>",
                next: {

                title: "Tutorial",
                text: "Click 'Next Turn' again to see your influence spread to the sea."
                }
                }
            });
        }
        if(this.turn_3 == undefined && game.turn > 2){
            this.turn_3 = true;
            game.popup({
                title: "Tutorial",
                text: "Now let's look at the city page. Click on the city again, or use the "+
                '"City"-tab in the panel on the left.',
                next: {

                title: "Tutorial",
                text: "<p>In addition to city level and influence, the city panel shows "+
                "the number of different workers the city has and lets you adjust them. "+
                "</p><p>"+
                "Builders are important in the beginning. They make colonies, which "+
                "you can send to make establish new cities. You currently have one builder."+
                "</p><p>"+
                "Usually you want your workers to be priests. Priests increase your influence "+
                "in the city.</p>",
                next: {

                title: "Tutorial",
                text: "Click on 'Next Turn' a few times, until you have produced a colony."
                }
                }
            });
        }
        if(this.colony == undefined && game.player.colony > 0){
            this.colony = true;
            game.popup({
                title: "Tutorial",
                text: "Great! You can now send your colony to establish a new city!. "+
                "Click on the 'home' tab to find the 'City' button. "+
                "Cities must be at least 3 tiles away from the original (no shared neighbours). "+
                "Also, they can only be built on grass tiles. "+
                "Build your second city."
            });
        }
        if(this.two_cities == undefined && game.cities.length > 1){
            this.two_cities = true;
            this.goal_next_turn = true;
            game.popup({
                title: "Tutorial",
                text: "Your second city will grow in 10 turns. "+
                "Notice that your influence on the tile has immediately jumped to 10. This only "+
                "happens when you establish a colony, usually influence spreads more slowly, either "+
                "from tile to tile or from a city to its tile.",
            });
        }
        if(this.wood_for_field == undefined && game.player.wood >= home_items.field.price.wood){
            this.wood_for_field = true;
            game.popup({
                title: "Tutorial",
                text: "By the way, you have accumulated a good amount of wood. You can use it to "+
                "build a field or a road in the home panel. Building a field next to a city "+
                "increases its food production by one. "+
                "Roads allow influence to spread more easily. The amount of influence that "+
                "spreads to a road tile is increased by 1.",

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
            "It likes to build roads and to send merchants to create trade "+
            "routes between cities.",
            next: {

            title: "Tutorial",
            text: "<p>Merchants are useful workers. Sending a merchant to another city "+
            "creates a trade route between them. Both cities get more diverse food "+
            "(1 extra food per turn). Trade also spreads influence "+
            "around. One influence point from each city moves to the other one.</p>"+
            "<p>To send a worker to another city, you need to have some influence there. "+
            "Also, there can only be one trade route between any two cities.</p>",
            next: {

            title: "Tutorial",
            text: "Any tile, including cities, belongs to whoever has the highest influence "+
            "there. You can take over enemy cities by building a bigger city close by. You can "+
            "also lose cities. When you take over a city, remember to check that the workers "+
            "are doing something useful. The advisor panel give useful reminders.",
            next: {

            title: "Tutorial",
            text: "Other gods have the same win conditions as you."
            }
            }
            }
        });
    }
}


// Introduces the green player
var tutorial_3 = {
    map: tutorial_map,
    start: {
        white: {x: 2, y:4},
        green: {x: 7, y:4}
    },
    at_start: function(){
        game.popup({
            title: "Tutorial",
            text: "Green is the god of agriculture. "+
            "It likes to build fields and grow a large capital city. "+
            "It is also kind of old fashioned. It commands smaller cities "+
            "to pay tribute to the capital.",
            next: {

            title: "Tutorial",
            text: "Tributes take 5 food to another city as a sacrifice. "+
            "This increases the receiving cities influence by 1 "+
            "point. It's a high price, but often smaller cities get swamped by "+
            "the influence of a bigger one and are made useless. This way they "+
            "can still make a difference."
            }
        });
    }
}

// Introduces the red player
var tutorial_4 = {
    map: tutorial_map,
    start: {
        white: {x: 2, y:4},
        red: {x: 7, y:4}
    },
    at_start: function(){
        game.popup({
            title: "Tutorial",
            text: "Red is the god of war. Even in times of piece, it does it's "+
            "best to take from others instead of creating for itself."
        });
    }
}

// Introduces the violet player
var tutorial_5 = {
    map: tutorial_map,
    start: {
        white: {x: 2, y:4},
        violet: {x: 6, y:1}
    },
    at_start: function(){
        game.popup({
            title: "Tutorial",
            text: "Violet grows and engulfs all things. It is an elder god "+
            "from an unknown past. It's not always smart, but it is inscrutable."
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
    for(var key in players){
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
