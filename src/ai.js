

class AIPlayer {
    constructor(key, name, text_color, map_color,aiconfig) {
        this.key = key;
        this.name = name;
        this.text_color= text_color;
        this.map_color= map_color;
        this.city_closeness = aiconfig.city_closeness;
        this.city_food = aiconfig.city_food;
        this.build_food= 1;
        this.build_level= 1;
        this.build_city_utility= 0;
        this.build_base= -10;
        this.new_city_utility = aiconfig.new_city_utility;
        this.road_city_connecting = aiconfig.road_city_connecting;
        this.road_culture = aiconfig.road_culture;
        this.new_road_utility = aiconfig.new_road_utility;
        
        this.wood = 0;
    }

    take_turn(tiles, cities, build_road) {
        // Check all tiles to find the best places to build
        var city_utility = -1000;
        var city_x;
        var city_y;
        for (var x = 0; x < tiles.map_size_x; x++) {
            for (var y = 0; y < tiles.map_size_y; y++) {
                // Green likes to build on the edges, where culture is minimal
                if(tiles[x][y].is_city_allowed() && tiles[x][y].owner == this.key){
                    var tile = tiles[x][y]
                    var utility = this.new_city_utility;
                    utility += this.city_closeness*tile.culture[this.key];
                    
                    // Amount of food should count more
                    var key = this.key;
                    var food = 0;
                    tiles[x][y].neighbours().forEach(function(tile){
                        if(tile.owner == key &&
                        tile.land == 'g' &&
                        tile.city == undefined ){
                            food += 1;
                        }
                    });
                    utility += this.city_food*food;
                    
                    
                    
                    if(utility > city_utility){
                        city_x = x;
                        city_y = y;
                        city_utility = utility;
                    }
                }
            }
        }

        console.log(this.name+": best place for a city is at "+city_x+","+city_y);


        // Check if there is anything useful to do in cities
        for(var key in cities){
            var city = cities[key];
            if(city.owner() == this.key){
                if(city_x != undefined && city_y != undefined){
                    var utility = this.build_base +
                                  this.build_food*city.food +
                                  this.build_level*city.level +
                                  this.build_city_utility*city_utility;
                    if( utility > 0 ){
                        console.log(this.name+" city at "+city.x+","+city.y+" builds a city at "+city_x+","+city_y);
                        city.build_city(city_x,city_y,this.key);
                    }
                }
            }
        }

        var road_utility = -1000;
        var road_x;
        var road_y;
        for (var x = 0; x < tiles.map_size_x; x++) {
            for (var y = 0; y < tiles.map_size_y; y++) {
                var tile = tiles[x][y]
                if(tile.owner == this.key && tiles[x][y].is_road_allowed()){
                    var utility = this.new_road_utility;
                    for(key in cities){
                        var city = cities[key];
                        var dx = city.x - x;
                        var dy = city.y - y;
                        var dist = dx*dx+dy*dy;
                        utility += this.road_city_connecting/dist;
                    }

                    utility += this.road_culture*tile.culture[this.key];
                    
                    if(utility > road_utility){
                        road_x = x;
                        road_y = y;
                        road_utility = utility;
                    }
                }
            }
        }

        console.log(this.name+": best place for a road is at "+road_x+","+road_y+" (utility "+utility+")");
        if(this.wood >= 5){
            if(road_utility > 0){
                build_road(this, road_x,road_y);
                console.log(this.name+" builds a road at "+road_x+","+road_y);
            }
        }
    }

}


var human_player_city_names = ["Aztola", "Sivola", "Thokas", "Loran", "Sinala", "Umdela", "Wendu"];


var green_player = new AIPlayer('green','Green',"#00AA00","#00AA00",{
    new_city_utility: 20,
    city_closeness: -10,
    city_food: 1,
    build_food: 1,
    build_level: 1,
    build_city_utility: 0,
    build_base: -10,
    new_road_utility: 10,
    road_culture: -1,
    road_city_connecting: -1,
    city_names: ["Ystan", "Damasy", "Amary", "Orna", "Inestan", "Ynila", "Donla"]
})

var blue_player = new AIPlayer('blue','Blue',"#5555FF","#0000FF",{
    new_city_utility: -10,
    city_closeness: 10,
    city_food: 1,
    build_food: 1,
    build_level: 2,
    build_city_utility: 0,
    build_base: -14,
    new_road_utility: -5,
    road_culture: 5,
    road_city_connecting: 1,
    city_names: ["Ilnam", "Alaman", "Gellon", "Umman", "Aka-Ilnam", "Omolla", "Nala"]
})

var red_player = new AIPlayer('red','Red',"#FF5555","#FF0000",{
    new_city_utility: -10,
    city_closeness: 10,
    city_food: 1,
    build_food: 1,
    build_level: 2,
    build_city_utility: 0,
    build_base: -14,
    new_road_utility: -5,
    road_culture: 5,
    road_city_connecting: 1,
    city_names: ["Argath", "Moroth", "Thalath", "Grahath", "Omroth", "Grth", "Afath"]
})







