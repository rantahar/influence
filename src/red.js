
var red_player = {
    color: "#FF0000",
    wood: 0,
    take_turn: function(){
        // Check all tiles to find the best places to build
        var city_utility = -1000;
        var city_x;
        var city_y;
        for (var x = 0; x < map_size_x; x++) {
            for (var y = 0; y < map_size_y; y++) {
                // Red likes to build on the edges, where culture is minimal
                if(is_city_allowed(x,y) && tile_array[x][y].owner == 'red'){
                    var tile = tile_array[x][y]
                    var utility = 50 - tile.culture.red;
                    
                    // Red cares mainly about expansion
                    var food = sum_tiles(neighbour_tiles(x,y),function(a,b){
                        var food = 0;
                        if(tile_array[a][b].owner == 'red' &&
                        tile_array[a][b].land == 'g' &&
                        tile_array[a][b].city == undefined ){
                            food = 1;
                        }
                        return food;
                    });
                    utility += food;
                    
                    if(utility > city_utility){
                        city_x = x;
                        city_y = y;
                        city_utility = utility;
                    }
                }
            }
        }

        console.log("Red: best place for a city is at "+city_x+","+city_y);


        // Check if there is anything useful to do in cities
        for(key in cities){
            var city = cities[key];
            if(city.owner() == 'red'){
                if(city_x != undefined && city_y != undefined){
                    var utility = city_utility - 10 + city.level + city.food;
                    if( utility > 0 ){
                        console.log("Red city at "+city.x+","+city.y+" builds a city at "+city_x+","+city_y);
                        city.build_city(city_x,city_y,'red');
                    }
                }
            }
        }

        var road_utility = -1000;
        var road_x;
        var road_y;
        for (var x = 0; x < map_size_x; x++) {
            for (var y = 0; y < map_size_y; y++) {
                var tile = tile_array[x][y]
                if(tile.owner == 'red' && can_build_road(x,y)){
                    var utility = 1000;
                    for(key in cities){
                        var city = cities[key];
                        var dx = city.x - x;
                        var dy = city.y - y;
                        var dist = dx*dx+dy*dy;
                        utility -= 1/dist;
                    }

                    utility -= 0.1*tile.culture.red;
                    
                    if(utility > road_utility){
                        road_x = x;
                        road_y = y;
                        road_utility = utility;
                    }
                }
            }
        }

        console.log("Red: best place for a road is at "+road_x+","+road_y+" (utility "+utility+")");
        if(this.wood >= 5){
            if(road_utility > 0){
                build_road(this, road_x,road_y);
                console.log("Red builds a road at "+road_x+","+road_y);
            }
        }
    }
};



