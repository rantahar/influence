
var blue_player = {
    color: "#0000FF",
    take_turn: function(){
        // Check all tiles to find the best places to build
        var city_utility = -1000;
        var city_x;
        var city_y;
        for (var x = 0; x < map_size_x; x++) {
            for (var y = 0; y < map_size_y; y++) {
                // Blue Builds as close as possible
                if(is_city_allowed(x,y) && tile_array[x][y].owner == 'blue'){
                    var tile = tile_array[x][y]
                    var utility = tile.culture.blue;
                    
                    // Amount of food should count more
                    var food = sum_tiles(neighbour_tiles(x,y),function(a,b){
                        var food = 0;
                        if(tile_array[a][b].owner == 'blue' &&
                        tile_array[a][b].land == 'g' &&
                        tile_array[a][b].city == undefined ){
                            food = 1;
                        }
                        return food;
                    });
                    utility += 2*food;
                    
                    
                    if(utility > city_utility){
                        city_x = x;
                        city_y = y;
                        city_utility = utility;
                    }
                }
            }
        }

        console.log("Blue: best place for a city is at "+city_x+","+city_y);


        // Check if there is anything useful to do in cities
        for(key in cities){
            var city = cities[key];
            if(city.owner() == 'blue'){
                if(city_x != undefined && city_y != undefined){
                    var utility = city_utility - 10 + city.level + city.food;
                    if( utility > 0 ){
                        console.log("Green city at "+city.x+","+city.y+" builds a city at "+city_x+","+city_y);
                        city.build_city(city_x,city_y,'blue');
                    }
                }

                if(city.wood >= 5){
                    var road_utility = -1000;
                    var road_x;
                    var road_y;
                    for (var x = 0; x < map_size_x; x++) {
                        for (var y = 0; y < map_size_y; y++) {
                            if(can_build_road(x,y,city)){
                                var utility = sum_tiles(neighbour_tiles(x,y),function(x,y){
                                    var util = 0;
                                    if( is_city_allowed(x,y) ){
                                        util -= 1;
                                    }
                                    if(tile_array[x][y].owner == 'blue' &&
                                       tile_array[x][y].land == 'g' &&
                                       tile_array[x][y].city == undefined ){
                                        util += 1;
                                    }
                                    return util;
                                });

                                if(utility > road_utility){
                                    road_x = x;
                                    road_y = y;
                                    road_utility = utility;
                                }
                            }
                        }
                    }
                    if(road_utility > 0){
                        city.build_road(road_x,road_y);
                    }
                }
            }
        }
    }
};



