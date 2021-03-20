
// The player class. AI players have a number of parameters related to their
// preferred actions. The take_turn() function is the actual AI script and is
// shared between all players
class AIPlayer {
    // Take the AI configuration and create a player
    constructor(key, name, text_color, map_color, aiconfig) {
        this.key = key;
        this.name = name;
        this.text_color = text_color;
        this.map_color = map_color;
        this.city_utility = aiconfig.city_utility;
        this.city_influence = aiconfig.city_influence;
        this.city_food = aiconfig.city_food;
        this.city_wood = aiconfig.city_wood;
        this.colony_base = aiconfig.colony_base;
        this.colony_food = aiconfig.colony_food;
        this.colony_level = aiconfig.colony_level;
        this.max_colonies = aiconfig.max_colonies;
        this.road_utility = aiconfig.road_utility;
        this.road_to_own_cities = aiconfig.road_to_own_cities;
        this.road_to_other_cities = aiconfig.road_to_other_cities;
        this.road_influence = aiconfig.road_influence;
        this.field_utility = aiconfig.field_utility;
        this.field_influence = aiconfig.field_influence;
        this.field_city_level = aiconfig.field_city_level;
        this.field_city_food_tiles = aiconfig.field_city_food_tiles;
        this.field_city_food_tiles = aiconfig.field_city_food_tiles;
        this.large_cities = aiconfig.large_cities;

        // Worker related
        this.worker_food_base = aiconfig.worker_food_base;
        this.worker_per_food_production = aiconfig.worker_per_food_production;
        this.worker_wood_base = aiconfig.worker_wood_base;
        this.worker_per_wood = aiconfig.worker_per_wood;
        this.tribute_base = aiconfig.tribute_base;
        this.tribute_high_influence = aiconfig.tribute_high_influence;
        this.tribute_subdominant = aiconfig.tribute_subdominant;
        this.tribute_starvation = aiconfig.tribute_starvation;
        this.merchant_internal = aiconfig.merchant_internal;
        this.merchant_growth = aiconfig.merchant_growth;
        this.merchant_base = aiconfig.merchant_base;
        this.merchant_agression = aiconfig.merchant_agression;
        this.merchant_defensiveness = aiconfig.merchant_defensiveness;
        this.merchant_subdominant = aiconfig.merchant_subdominant;

        this.city_names = aiconfig.city_names;
        this.city_prefix = aiconfig.city_prefix;

        this.wood = 0;
        this.colony = 0;
        this.influence = 0;
        this.owned_tiles = 1;
        this.cities = 0;
    }

    // The ai script, run at every turn
    take_turn(tiles, cities, build) {
        if(this.colony > 0){
            // Check all tiles to find the best places to build
            var city_utility = -1000;
            var city_x; var city_y;
            var item = home_items['city'];
            for (var x = 0; x < tiles.map_size_x; x++) {
                for (var y = 0; y < tiles.map_size_y; y++) {
                    var tile = tiles[x][y];
                    if(tile.owner == this.key && item.can_build_at(tiles[x][y])){
                        // Found a tile where cities are allowed

                        // Calculate the utility. There is a base value and some
                        // modifiers
                        var utility = this.city_utility;
                        // Use influence value as a proxy for closeness to others
                        utility += this.city_influence*tile.influence[this.key];

                        // Amount of resources around the city
                        var key = this.key;
                        var food = 0;
                        var wood = 0;
                        tiles[x][y].neighbours().forEach(function(tile){
                            if(tile.is_food_tile() ){
                                food += 1;
                            }
                            if(tile.is_wood_tile() ){
                                wood += 1;
                            }
                        });
                        utility += this.city_food*food + this.city_wood*wood;

                        // set this as the maximum. Only one per turn. Does not matter much
                        if(utility > city_utility){
                            city_x = x; city_y = y;
                            city_utility = utility;
                        }
                    }
                }
            }

            console.log(this.name+": best place for a city is at "+city_x+","+city_y);
            if(city_x != undefined && city_y != undefined){
                if( city_utility > 0 ){
                    console.log(this.name+" builds a city at "+city_x+","+city_y);
                    build('city', this.key, city_x, city_y);
                }
            }
        }

        // Check if there is anything useful to do in cities
        for(var key in cities){
            var city = cities[key];
            if(city.owner() == this.key){
                // Check if it makes sense to build a colony
                if(this.colony < this.max_colonies){
                    var utility = this.colony_base +
                                  this.colony_food*city.food +
                                  this.colony_level*city.level;
                    console.log(this.name+": Colony utility "+utility);
                    if(utility > 0){
                        city.queue_colony();
                    }
                }

                // Next worker allocation.
                city.workers_food = 0;
                city.workers_wood = 0;
                city.priests = 0;
                city.builders = 0;
                city.merchant_routes = [];
                city.tribute_routes = [];

                while(city.free_workers() > 0){
                    this.assign_workers(city);
                }
            }
        }

        /// Check for good places for a road
        var road_utility = -1000;
        var road_x; var road_y;
        var item = home_items['road'];
        for (var x = 0; x < tiles.map_size_x; x++) {
            for (var y = 0; y < tiles.map_size_y; y++) {
                var tile = tiles[x][y];
                if(tile.owner == this.key && item.can_build_at(tiles[x][y])){
                    // Found a tile where you can build a road
                    var utility = this.road_utility + this.wood;

                    // Modify by distance to close by cities
                    var player = this;
                    for(key in cities){
                        var city = cities[key];
                        var dx = city.x - x;
                        var dy = city.y - y;
                        var dist = dx*dx+dy*dy;
                        if(city.owner() == player.key){
                            utility += player.road_to_own_cities/dist;
                        } else {
                            utility += player.road_to_other_cities/dist;
                        }
                    }

                    // Use influence as a proxy for how central the area is
                    utility += this.road_influence*tile.influence[this.key];

                    if(utility > road_utility){
                        road_x = x; road_y = y;
                        road_utility = utility;
                    }
                }
            }
        }

        console.log(this.name+": best place for a road is at "+road_x+","+road_y+" (utility "+road_utility+")");
        if(this.wood >= item.price.wood && road_utility > 0){
            build('road', this.key, road_x,road_y);
            console.log(this.name+" builds a road at "+road_x+","+road_y);
        }

        /// Check for good places for a field
        var field_utility = -1000;
        var field_x; var field_y;
        var item = home_items['field'];
        for (var x = 0; x < tiles.map_size_x; x++) {
            for (var y = 0; y < tiles.map_size_y; y++) {
                var tile = tiles[x][y];
                if(tile.owner == this.key && item.can_build_at(tiles[x][y])){
                    var utility = this.field_utility + this.wood;

                    // Use influence as a proxy for how central the area is
                    utility += this.field_influence*tile.influence[this.key];

                    // Check the level of a neighbouring city
                    var player = this;
                    tiles[x][y].neighbours().forEach(function(tile){
                        if(tile.city){
                            utility += player.field_city_level*tile.city.level;
                            utility += player.field_city_food_tiles*tile.city.food_tiles();
                        }
                    });

                    if(utility > field_utility){
                        field_x = x; field_y = y;
                        field_utility = utility;
                    }
                }
            }
        }

        console.log(this.name+": best place for a field is at "+field_x+","+field_y+" (utility "+utility+")");
        if(this.wood >= item.price.wood && field_utility > 0){
            build('field', this.key, field_x, field_y);
            console.log(this.name+" builds a field at "+field_x+","+field_y);
        }
    }


    // assign a new worker
    assign_workers(city){
        var preference = 0;
        var assign_func = undefined;
        var food_balance = city.food_production() - city.food_consumption();
        var starving = food_balance > 0;
        // Check if we can assign food workers
        if(city.max_food_workers() > city.workers_food){
            assign_func = function(){
                city.set_food_workers(city.workers_food+1);
            };
            preference = this.worker_food_base
                       - this.worker_per_food_production * food_balance;
        }
        // Check wood workers
        if(city.max_wood_workers() > city.workers_wood){
            pref = this.worker_wood_base
                 - this.worker_per_wood * this.wood;
            if(preference < pref){
                assign_func = function(){
                    city.set_wood_workers(city.workers_wood+1);
                };
                preference = pref;
            }
        }
        var pref = 50;
        if(preference < pref){
            assign_func = function(){
                city.set_priests(city.priests+1);
            };
            preference = pref;
        }
        if(city.building != undefined){
            var pref = 90;
            if(preference < pref){
                assign_func = function(){
                    city.set_builders(city.builders+1);
                };
                preference = pref;
            }
        }

        // Tributes
        var my_inf = city.current_influence[this.key];
        let influence_diff = city.tile.influence[this.key] - my_inf;
        var send_pref = this.tribute_base;
        if(influence_diff > 0){
            send_pref += this.tribute_subdominant;
        }
        if(starving){
            send_pref -= this.tribute_starvation;
        }
        for(var key in game.cities){
           let other_city = game.cities[key];
           if(other_city.owner() == this.key && other_city != city){
              // Prefer to send tribute to large influence cities
              let pref = send_pref;
              var diff = other_city.current_influence[this.key] - my_inf;
              pref += this.tribute_high_influence*diff;
              if(preference < pref){
                 assign_func = function(){
                    city.send('tribute', other_city);
                 };
                 preference = pref
              }
           }
        }

        // Merchants
        var send_pref = this.tribute_base;
        if(influence_diff > 0){
            send_pref += this.tribute_subdominant;
        }
        for(var key in game.cities){
            let other_city = game.cities[key];
            if(other_city != city &&
               !city.has_trade_route_with(other_city) &&
               other_city.tile.influence[this.key] > 0){
                var pref = send_pref;
                if(other_city.owner() == this.key){
                    pref += this.merchant_internal
                          + other_city.level * this.merchant_growth;
                } else {
                    // Preference to sending merchants mainly depends on
                    // the difference between influence levels
                    var diff_there = other_city.influence(this.key)
                        - other_city.influence(other_city.owner());
                    var diff_here = city.influence(this.key)
                        - city.influence(other_city.owner());
                    pref += diff_here*this.merchant_defensiveness;
                          + diff_there*this.merchant_aggression;
                }
                if(preference < pref){
                    assign_func = function(){
                        city.send('merchant', other_city);
                    };
                    preference = pref
                }
            }
        }
        assign_func();
    }
}


var white_player;
var green_player;
var blue_player;
var red_player;
var violet_player;
// A  list of all existing players
var players = {};

// Create (or reset) the AI players
function make_players(){
    // The green player prefers to build high level cities close to each other.
    green_player = new AIPlayer('green','Green player',"#00AA00","#00AA00",{
        city_utility: 0,
        city_influence: 0.1,
        city_food: 1,
        city_wood: 1.5,
        colony_base: -60,
        colony_food:  1,
        colony_level: 10,
        max_colonies: 1,
        road_utility: -25,
        road_to_own_cities: 1,
        road_to_other_cities: 1,
        road_influence: 0,
        field_utility: 0,
        field_influence: 0,
        field_city_level: 1,
        field_city_food_tiles: 2,

        // Worker related
        worker_food_base: 100,
        worker_per_food_production: 1,
        worker_wood_base: 100,
        worker_per_wood: 0,
        tribute_base: 49,
        tribute_high_influence: 2,
        tribute_subdominant: 5,
        tribute_starvation: 20,
        merchant_internal: 10,
        merchant_growth: 1,
        merchant_base: 40,
        merchant_agression: -1,
        merchant_defensiveness: 4,
        merchant_subdominant: 1,

        city_names: ["Ystan", "Damasy", "Amary", "Orna", "Inestan", "Ynila", "Donla", "Ostany", "Angla"],
        city_prefix: "Am"
    });

    // The blue player also likes to build cities close, but prefers to build roads
    blue_player = new AIPlayer('blue','Blue player',"#5555FF","#0000FF",{
        city_utility: 0,
        city_influence: 0.1,
        city_food: 1,
        city_wood: 2,
        colony_base: -210,
        colony_food: 10,
        colony_level: -1,
        max_colonies: 5,
        road_utility: -5,
        road_to_own_cities: 5,
        road_to_other_cities: 5,
        road_influence: 0,
        field_utility: -15,
        field_influence: 1,
        field_city_level: 0,
        field_city_food_tiles: 1,

        // Worker related
        worker_food_base: 100,
        worker_per_food_production: 5,
        worker_wood_base: 90,
        worker_per_wood: 1,
        tribute_base: 40,
        tribute_high_influence: 1,
        tribute_subdominant: 1,
        tribute_starvation: 20,
        merchant_internal: 70,
        merchant_growth: 0,
        merchant_base: 60,
        merchant_agression: -1,
        merchant_defensiveness: 1,
        merchant_subdominant: 5,

        city_names: ["Ilnam", "Alaman", "Gellon", "Atosa", "Umman", "Omolla", "Nala", "Antan", "Tovisa",
                    "Kolma", "Enta", "Aflan", "Ylman", "Umilla", "Wenna", "Tornal", "Kilman" ],
        city_prefix: "Aka-"
    });


    // The red players influence doesn't mix with others. It likes to spread toward
    // other players
    red_player = new AIPlayer('red','Red player',"#FF5555","#FF0000",{
        city_utility: 1000,
        city_influence: -1,
        city_food: 1,
        city_wood: 2.5,
        colony_base: -40,
        colony_food: 1,
        colony_level: 10,
        max_colonies: 5,
        road_utility: -5,
        road_to_own_cities: 0,
        road_to_other_cities: 1,
        road_influence: 0,
        field_utility: 100000,
        field_influence: -1,
        field_city_level: -10,
        field_city_food_tiles: 0,

        // Worker related
        worker_food_base: 100,
        worker_per_food_production: 2,
        worker_wood_base: 60,
        worker_per_wood: 2,
        tribute_base: 40,
        tribute_high_influence: 1,
        tribute_subdominant: 5,
        tribute_starvation: 10,
        merchant_internal: 50,
        merchant_growth: 1,
        merchant_base: 40,
        merchant_agression: 1,
        merchant_defensiveness: 1,
        merchant_subdominant: 10,

        city_names: ["Argath", "Moroth", "Thalath", "Grahath", "Omroth", "Grth", "Afath", "Arostagath",
            "Ungoth", "Tramath", "Etrukrol", "Dimrasta", "Igratas", "Fedrath", "Brastagrath",
            "Olrath", "Amdaras", "Edrukostarath", "Ostregtha"],
        city_prefix: "Dre-"
    });

    // The violet player likes to spread quickly.
    violet_player = new AIPlayer('violet','Violet player',"#710193","#710193",{
        city_utility: 100000,
        city_influence: -2,
        city_food: 1,
        city_wood: 3,
        colony_base: -40,
        colony_food: 1,
        colony_level: 10,
        max_colonies: 5,
        road_utility: 10000,
        road_to_own_cities: 0,
        road_to_other_cities: 0,
        road_influence: -1,
        field_utility: 100000,
        field_influence: -1,
        field_city_level: -2,
        field_city_food_tiles: 0,

        // Worker related
        worker_food_base: 100,
        worker_per_food_production: 2,
        worker_wood_base: 60,
        worker_per_wood: 2,
        tribute_base: 40,
        tribute_high_influence: 1,
        tribute_subdominant: 2,
        tribute_starvation: 5,
        merchant_internal: 5,
        merchant_growth: 0,
        merchant_base: 40,
        merchant_agression: 1,
        merchant_defensiveness: 1,
        merchant_subdominant: 2,

        city_names: ["Omral", "Orna", "Oscila", "Ondo", "Otha", "Omwe", "Oasta", "Odrila", "Ondara",
                    "Okra", "Omrana", "Otria", "Oula", "Ogra", "Onderasta", "Omudira", "Owdamas",
                    "Omkorsta"],
        city_prefix: "Dral"
    });


    white_player = {
            human: true,
            key: 'white',
            name: "White",
            text_color: '#FFFFFF',
            map_color: '#FFFFFF',
            city_names: ["Aztola", "Sivola", "Thokas", "Loran", "Sinala", "Umdela", "Wendu", "Umar",
                         "Ava-Umar","Atala","Ashtal Emal", "Lordan", "Ulanith", "Thelenula", "Astu",
                         "Omnal", "Eftala", "Alran", "Leran", "Sulona"],
            city_prefix: "Ala-",
            wood: 0,
            colony: 0,
            influence: 0,
            cities: 0,
            owned_tiles: 1,
            take_turn(){}
    };

    players = {
        'white': white_player,
        'green': green_player,
        'blue': blue_player,
        'red': red_player,
        'violet': violet_player
    }
}
