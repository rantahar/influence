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
                text: "The city panel has opened on the left. Your first city starts with population"+
                "1, but it grows as it produces food. You have 10 influence on the city, "+
                "and this will also grow if you take care of your city well. "+
                "Your influence will spread from the city once you click 'Next Turn'."
            });
        }
        if(this.turn_2 == undefined && game.turn > 1){
            this.turn_2 = true;
            game.popup({
                title: "Tutorial",
                text: "The city's influence has spread to the neighbouring tiles and you "+
                "control them now. You can click on the tiles to see how much influence you have " +
                "on each.",
                next: {

                title: "Tutorial",
                text: "Notice that don't have quite as much influence on the neighbour tiles as in " +
                "your city. When influence spreads to a grass tile, it gets reduced by 3. " +
                "On forest and water tiles it is reduced by 4. Your influence does not "+
                "spread to mountain tiles.",
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
                text: "You have no free workers, which is good. The one worker you have "+
                "is farming one of the grass tiles around the city. The city also has a forest "+
                "tile, so you could also choose to collect wood. ",
                next: {

                title: "Tutorial",
                text: "It's usually best to put "+
                "unemployed workers to a good use. In the dropdown menu you can choose where "+
                "new workers will go when the population grows. We will "+
                "talk about the other workers later, but for now set new workers to become "+
                "builders."
                }
                }
            });
        }
        if(this.builders == undefined && game.turn > 2 && game.cities[0].new_worker_type == 'builder'){
            this.builders = true;
            game.popup({
                title: "Tutorial",
                text: "Good! The city's population will increase in a few turns and you will "+
                "get your first builder. You could assing one now, but without a single farmer "+
                "your city would not grow."
            });
        }
        if(this.has_builders == undefined && game.cities[0].builders > 0){
            this.has_builders = true;
            game.popup({
                title: "Tutorial",
                text: "Now your city has a builder! Builders make new colonies and colonies are "+
                "the only way you can expand to fill the world! It will take a few turns to "+
                "churn one out."
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
                text: "Your second city will take a few turns to flourish, but rest assured it will. "+
                "You influence on the tile has immediately jumped to 10. This only happens when you "+
                "establish a colony, usually influence spreads more slowly, either from tile to tile "+
                "or from a city to it's tile.",
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
                text: "Now you can build a field or a road in the home panel. Each field allows one "+
                "farmer to produce one extra food per turn. "+
                "Roads allow influence to spread more easily. One additional point of influence "+
                "spreads to tiles with a road.",

                next: {
                title: "Tutorial",
                text: "Your goal is to spread your influence as far as you can. Since there are "+
                "no other gods on this island, you can take your time. You win when you control "+
                "more than half of the world or have more influence than anyone else after 200 "+
                "turns."
                }
            });
        }
        if(this.priests == undefined && this.wood_for_field &&
           game.cities[1] && game.cities[1].free_workers() > 0){
            this.priests = true;
            this.goal_next_turn = true;
            game.popup({
                title: "Tutorial",
                text: "It looks like you have a free worker in Sivola. If you don't "+
                "know what to do with it, try making it a priest. Priests increase the "+
                "city's influence by 1 each. This will not immediately affect the tile, "+
                "but it will catch up with the city's influence in time."
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
            "It likes to send merchants to create trade routes between cities and to "+
            "build roads.",
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
            text: "Tributes take 5 food to another city to sacrifice it there. "+
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
