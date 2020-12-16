
var blue_player = {
    text_color: "#5555FF",
    map_color: "#0000FF",
    wood: 0,
    take_turn: function(){
        // Check all tiles to find the best places to build
        var city_utility = -1000;
        var city_x;
        var city_y;
        for (var x = 0; x < map_size_x; x++) {
            for (var y = 0; y < map_size_y; y++) {
                // Blue Builds as close as possible
                var tile = tiles[x][y]
                if(is_city_allowed(x,y) && tile.owner == 'blue'){
                    var utility = tile.culture.blue;
                    
                    // Amount of food should count more
                    var food = sum_tiles(neighbour_tiles(x,y),function(a,b){
                        var food = 0;
                        if(tiles[a][b].owner == 'blue' &&
                        tiles[a][b].land == 'g' &&
                        tiles[a][b].city == undefined ){
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
                        console.log("Blue city at "+city.x+","+city.y+" builds a city at "+city_x+","+city_y);
                        city.build_city(city_x,city_y,'blue');
                    }
                }
            }
        }

        var road_utility = -1000;
        var road_x;
        var road_y;
        for (var x = 0; x < map_size_x; x++) {
            for (var y = 0; y < map_size_y; y++) {
                var tile = tiles[x][y]
                if(tile.owner == 'blue' && can_build_road(x,y)){
                    var utility = 0;
                    for(key in cities){
                        var city = cities[key];
                        var dx = city.x - x;
                        var dy = city.y - y;
                        var dist = dx*dx+dy*dy;
                        utility += 1/dist;
                    }

                    utility -= 0.01*tile.culture.blue;
                    
                    if(utility > road_utility){
                        road_x = x;
                        road_y = y;
                        road_utility = utility;
                    }
                }
            }
        }

        console.log("Blue: best place for a road is at "+road_x+","+road_y+" (utility "+utility+")");
        if(this.wood >= 5){
            if(road_utility > 0){
                build_road(this, road_x,road_y);
                console.log("Blue builds a road at "+road_x+","+road_y);
            }
        }
    }
};



