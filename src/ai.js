

class AIPlayer {
    constructor(key, name, text_color, map_color, aiconfig) {
        this.key = key;
        this.name = name;
        this.text_color = text_color;
        this.map_color = map_color;
        this.city_utility = aiconfig.city_utility;
        this.city_culture = aiconfig.city_culture;
        this.city_food = aiconfig.city_food;
        this.city_wood = aiconfig.city_wood;
        this.colony_base = aiconfig.colony_base;
        this.colony_food = aiconfig.colony_food;
        this.colony_level = aiconfig.colony_level;
        this.max_colonies = aiconfig.max_colonies;
        this.road_utility = aiconfig.road_utility;
        this.road_to_own_cities = aiconfig.road_to_own_cities;
        this.road_to_other_cities = aiconfig.road_to_other_cities;
        this.road_culture = aiconfig.road_culture;
        this.field_utility = aiconfig.field_utility;
        this.field_culture = aiconfig.field_culture;
        this.field_city_level = aiconfig.field_city_level;

        this.city_names = aiconfig.city_names;
        this.city_prefix = aiconfig.city_prefix;

        this.wood = 0;
        this.colonies = 0;
        this.culture = 0;
        this.owned_tiles = 1;
        this.cities = 0;
    }

    take_turn(tiles, cities, build_road, build_city, build_field) {
        if(this.colonies > 0){
            // Check all tiles to find the best places to build
            var city_utility = -1000;
            var city_x; var city_y;
            for (var x = 0; x < tiles.map_size_x; x++) {
                for (var y = 0; y < tiles.map_size_y; y++) {
                    if(tiles[x][y].is_city_allowed() && tiles[x][y].owner == this.key){
                        // Found a tile where cities are allowed
                        var tile = tiles[x][y];

                        // Calculate the utility. There is a base value and some
                        // modifiers
                        var utility = this.city_utility;
                        // Use culture value as a proxy for closeness to others
                        utility += this.city_culture*tile.culture[this.key];

                        // Amount of resources around the city
                        var key = this.key;
                        var food = 0;
                        var wood = 0;
                        tiles[x][y].neighbours().forEach(function(tile){
                            if(tile.owner == key && tile.is_food_tile() ){
                                food += 1;
                            }
                            if(tile.owner == key && tile.is_wood_tile() ){
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
                    build_city(this.key,city_x,city_y);
                }
            }
        }

        // Check if there is anything useful to do in cities
        for(var key in cities){
            var city = cities[key];
            if(city.owner() == this.key){
                // Check if it makes sense to build a colony
                if(this.colonies < this.max_colonies){
                    var utility = this.colony_base +
                                  this.colony_food*city.food +
                                  this.colony_level*city.level;
                    console.log(this.name+": Colony utility "+utility);
                    if(utility > 0){
                        city.queue_colony();
                    }
                }
                // Add wood or food workers if it makes sense
                if(city.wood_tiles() > city.workers_wood){
                    if((city.food_production()*this.wood_to_food_ratio) > (city.wood_production()+1)){
                        city.workers_food -= 1;
                        city.workers_wood += 1;
                        console.log(this.name+": Add wood worker");
                    }
                    if(((city.food_production()+1)*this.wood_to_food_ratio) < city.wood_production()){
                        city.workers_food -= 1;
                        city.workers_wood += 1;
                        console.log(this.name+": Add food worker");
                    }
                }
            }
        }

        /// Check for good places for a road
        var road_utility = -1000;
        var road_x; var road_y;
        for (var x = 0; x < tiles.map_size_x; x++) {
            for (var y = 0; y < tiles.map_size_y; y++) {
                var tile = tiles[x][y];
                if(tile.owner == this.key && tiles[x][y].is_road_allowed()){
                    // Found a tile where you can build a road
                    var utility = this.road_utility;

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

                    // Use culture as a proxy for how central the area is
                    utility += this.road_culture*city.tile.culture[this.key];

                    if(utility > road_utility){
                        road_x = x; road_y = y;
                        road_utility = utility;
                    }
                }
            }
        }

        console.log(this.name+": best place for a road is at "+road_x+","+road_y+" (utility "+utility+")");
        if(this.wood >= items.road_price && road_utility > 0){
            build_road(this.key, road_x,road_y);
            console.log(this.name+" builds a road at "+road_x+","+road_y);
        }

        /// Check for good places for a field
        var field_utility = -1000;
        var field_x; var field_y;
        for (var x = 0; x < tiles.map_size_x; x++) {
            for (var y = 0; y < tiles.map_size_y; y++) {
                var tile = tiles[x][y];
                if(tile.owner == this.key && tiles[x][y].is_field_allowed()){
                    var utility = this.field_utility;

                    // Use culture as a proxy for how central the area is
                    utility += this.field_culture*tile.culture[this.key];

                    // Check the level of a neighbouring city
                    var player = this;
                    tiles[x][y].neighbours().forEach(function(tile){
                        if(tile.city){
                            utility += player.field_city_level*tile.city.level;
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
        if(this.wood >= 12 && field_utility > 0){
            build_field(this.key, field_x,field_y);
            console.log(this.name+" builds a field at "+field_x+","+field_y);
        }
    }

}



var green_player = new AIPlayer('green','Green',"#00AA00","#00AA00",{
    city_utility: 0,
    city_culture: 1,
    city_food: 1,
    city_wood: 2.5,
    colony_base: -60,
    colony_food:  1,
    colony_level: 10,
    max_colonies: 1,
    road_utility: -2,
    road_to_own_cities: 1,
    road_to_other_cities: 1,
    road_culture: 0,
    field_utility: 1,
    field_culture: 0,
    field_city_level: 1,
    wood_to_food_ratio: 0,
    city_names: ["Ystan", "Damasy", "Amary", "Orna", "Inestan", "Ynila", "Donla", "Ostany", "Angla"],
    city_prefix: "Am"
})

var blue_player = new AIPlayer('blue','Blue',"#5555FF","#0000FF",{
    city_utility: 0,
    city_culture: 1,
    city_food: 1,
    city_wood: 2.5,
    colony_base: -210,
    colony_food: 10,
    colony_level: -1,
    max_colonies: 5,
    road_utility: 0,
    road_to_own_cities: 2,
    road_to_other_cities: 2,
    road_culture: 0,
    field_utility: -5,
    field_culture: 5,
    field_city_level: 0,
    wood_to_food_ratio: 0.5,
    city_names: ["Ilnam", "Alaman", "Gellon", "Atosa", "Umman", "Omolla", "Nala", "Antan", "Tovisa",
                 "Kolma", "Enta", "Aflan", "Ylman", "Umilla", "Wenna", "Tornal", "Kilman" ],
    city_prefix: "Aka-"
})

var red_player = new AIPlayer('red','Red',"#FF5555","#FF0000",{
    city_utility: 1000,
    city_culture: -1,
    city_food: 1,
    city_wood: 2.5,
    colony_base: -40,
    colony_food: 1,
    colony_level: 10,
    max_colonies: 5,
    road_utility: 0,
    road_to_own_cities: 0,
    road_to_other_cities: 1,
    road_culture: 0,
    field_utility: 100000,
    field_culture: -1,
    field_city_level: -10,
    wood_to_food_ratio: 0.2,
    city_names: ["Argath", "Moroth", "Thalath", "Grahath", "Omroth", "Grth", "Afath", "Arostagath",
                 "Ungoth", "Tramath", "Etrukrol", "Dimrasta", "Igratas", "Fedrath", "Brastagrath",
                 "Olrath", "Amdaras", "Edrukostarath", "Ostregtha"],
    city_prefix: "Dre-"
})

var violet_player = new AIPlayer('violet','Violet',"#710193","#710193",{
    city_utility: 100000,
    city_culture: -1,
    city_food: 1,
    city_wood: 3,
    colony_base: -40,
    colony_food: 1,
    colony_level: 10,
    max_colonies: 3,
    road_utility: 10000,
    road_to_own_cities: 0,
    road_to_other_cities: 0,
    road_culture: -1,
    field_utility: 100000,
    field_culture: -1,
    field_city_level: -2,
    wood_to_food_ratio: 0.2,
    city_names: ["Omral", "Orna", "Oscila", "Ondo", "Otha", "Omwe", "Oasta", "Odrila", "Ondara",
                 "Okra", "Omrana", "Otria", "Oula", "Ogra", "Onderasta", "Omudira", "Owdamas",
                 "Omkorsta"],
    city_prefix: "Dral"
})
