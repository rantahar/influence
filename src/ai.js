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
        this.capital_tribute = aiconfig.capital_tribute;
        this.capital_merchants = aiconfig.capital_merchants;
        this.internal_merchants = aiconfig.internal_merchants;
        this.global_merchants = aiconfig.global_merchants;
        this.hostile_takeover = aiconfig.hostile_takeover;

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

            if(city_x != undefined && city_y != undefined){
                if( city_utility > 0 ){
                    build('city', this.key, city_x, city_y);
                }
            }
        }

        // Check if there is anything useful to do in cities
        var n_cities = 0; // Count cities first
        for(var key in cities){
            var city = cities[key];
            if(city.owner() == this.key){
                n_cities += 1;
            }
        }
        // mark one of the cities as the capital
        var capital;
        var pref = 0;
        for(var key in cities){
            var city = cities[key];
            if(city.owner() == this.key){
                var p = city.food_production()*10000 + city.level*100+city.tile.influence[this.key];
                if(p > pref){
                    capital = city;
                    pref = p;
                }
            }
        }
        // Coordinated hostile takeover: reduce the influence level of a
        // boarder city
        var hostile_takeover_destination;
        pref = 0;
        for(var key in cities){
            var city = cities[key];
            var my_inf = city.tile.influence[this.key];
            if(city.owner() != this.key && my_inf > 0){
                if(city.tile.influence[city.owner()] <= city.current_influence[city.owner()]){
                   var p = my_inf - city.influence(city.owner()) + n_cities + 3;
                   if(p > pref){
                       hostile_takeover_destination = city;
                       pref = p;
                   }
                }
            }
        }
        var n_colony_builders = 0;
        // Now set workers at each city
        for(var key in cities){
            var city = cities[key];
            if(city.owner() == this.key){
                // Simple but somewhat inefficient: set to zero and start over
                city.food_workers = 0;
                city.wood_workers = 0;
                city.priests = 0;
                city.builders = 0;
                city.merchant_routes = [];
                city.tribute_routes = [];

                // First set enough food workers to feed everyone
                for(var i=0; city.free_workers() > 0;){
                    var food_balance = city.food_production() - city.food_consumption();
                    var starving = food_balance < 0;
                    if(starving && city.food_workers < city.max_food_workers()){
                        city.food_workers += 1;
                        continue;
                    }
                    // Check if it makes sense to build a colony
                    if((this.colony + n_colony_builders) < this.max_colonies){
                        var utility = this.colony_base +
                                      this.colony_food*city.food +
                                      this.colony_level*city.level;
                        if(utility > 0){
                            city.builders += city.free_workers();
                            n_colony_builders += 1;
                            continue;
                        }
                    }
                    if(food_balance < 5 && city.food_workers < city.max_food_workers()){
                        // Fill in food workers
                        city.food_workers += 1;
                        continue;
                    }
                    if(this.wood < 20 && city.wood_workers < city.max_wood_workers()){
                        city.wood_workers += 1;
                        continue;
                    }

                    if(food_balance > 5 && this.capital_tribute && city != capital){
                        city.send('tribute', capital);
                        continue;
                    }

                    if(this.hostile_takeover && hostile_takeover_destination != undefined &&
                       !city.has_trade_route_with(hostile_takeover_destination)){
                         city.send('merchant', hostile_takeover_destination);
                         continue;
                    }

                    if(this.capital_merchants && city != capital &&
                       !city.has_trade_route_with(capital) &&
                         capital.influence(this.key) > city.influence(this.key)){
                         city.send('merchant', capital);
                         continue;
                    }

                    var merchant_set = false;
                    if(this.internal_merchants){
                        for(key in game.cities){
                            var dest = game.cities[key];
                            if(dest != city && dest.owner==this.key &&
                               city.can_send('merchant', dest)){
                                 city.send('merchant', dest);
                                 break;
                            }
                        }
                        // No continue statement: try settign a priest
                        // for every merchant
                        merchant_set = true;
                    }

                    if(this.global_merchants && !merchant_set){
                        for(key in game.cities){
                            var dest = game.cities[key];
                            if(dest != city && city.can_send('merchant', dest)){
                                 city.send('merchant', dest);
                                 break;
                            }
                        }
                    }

                    // Priests are the default
                    city.set_worker('priest', city.priests+1);
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
                    if(this.road_to_own_cities != 0){
                       for(var key in cities){
                          var city = cities[key];
                          var dx = city.x - x;
                          var dy = city.y - y;
                          var dist = dx*dx+dy*dy;
                          if(city.owner() == this.key){
                             utility += this.road_to_own_cities/dist;
                          } else {
                             utility += this.road_to_other_cities/dist;
                          }
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

        if(this.wood >= item.price.wood && road_utility > 0){
            build('road', this.key, road_x,road_y);
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

        if(this.wood >= item.price.wood && field_utility > 0){
            build('field', this.key, field_x, field_y);
        }
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
        city_wood: 1.3,
        colony_base: -60,
        colony_food:  1,
        colony_level: 10,
        max_colonies: 2,
        road_utility: -25,
        road_to_own_cities: 1,
        road_to_other_cities: 1,
        road_influence: 0,
        field_utility: 0,
        field_influence: 0,
        field_city_level: 1,
        field_city_food_tiles: 2,

        // Worker related priest_base
        capital_tribute: true,

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
        max_colonies: 3,
        road_utility: -5,
        road_to_own_cities: 5,
        road_to_other_cities: 5,
        road_influence: 0,
        field_utility: -15,
        field_influence: 1,
        field_city_level: 0,
        field_city_food_tiles: 1,

        // Worker related
        capital_merchants: true,
        internal_merchants: true,
        global_merchants: true,

        city_names: ["Ilnam", "Alaman", "Gellon", "Atosa", "Umman", "Omolla", "Nala", "Antan", "Tovisa",
                    "Kolma", "Enta", "Aflan", "Ylman", "Umilla", "Wenna", "Tornal", "Kilman" ],
        city_prefix: "Aka-"
    });


    // The red players influence doesn't mix with others. It likes to spread toward
    // other players
    red_player = new AIPlayer('red','Red player',"#FF5555","#FF0000",{
        city_utility: 0,
        city_influence: 0.1,
        city_food: 1,
        colony_base: -40,
        colony_food: 1,
        city_wood: 1.3,
        colony_level: 10,
        road_utility: -5,
        max_colonies: 2,
        road_utility: -20,
        road_to_own_cities: 0,
        road_to_other_cities: 1,
        road_influence: 1,
        field_utility: 10,
        field_influence: 1,
        field_city_level: -1,
        field_city_food_tiles: 1,

        // Worker related
        capital_merchants: true,
        internal_merchants: true,
        hostile_takeover: true,

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
        colony_base: 1,
        colony_food: 0,
        colony_level: 0,
        max_colonies: 3,
        road_utility: -22,
        road_to_own_cities: 0,
        road_to_other_cities: 1,
        road_influence: 1,
        field_utility: 0,
        field_influence: 1,
        field_city_level: 1,
        field_city_food_tiles: 1,

        // Worker related
        capital_merchants: true,
        internal_merchants: true,
        hostile_takeover: true,

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
