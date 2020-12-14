
var green_player = {
    color: "#00AA00",
    take_turn: function(){
        // Check all tiles to find the best places to build
        var best_utility = -1000;
        var best_x;
        var best_y;
        for (var x = 0; x < map_size_x; x++) {
            for (var y = 0; y < map_size_y; y++) {
                // Green likes to build on the edges, where culture is minimal
                if(is_city_allowed(x,y) && tile_array[x][y].owner == 'green'){
                    var tile = tile_array[x][y]
                    var utility = -tile.culture.green;
                    
                    // Amount of food should count more
                    var food = sum_tiles(neighbour_tiles(x,y),function(a,b){
                        var food = 0;
                        if(tile_array[a][b].owner == 'green' &&
                        tile_array[a][b].land == 'g' &&
                        tile_array[a][b].city == undefined ){
                            food = 1;
                        }
                        return food;
                    });
                    utility += 2*food;
                    
                    
                    if(utility > best_utility){
                        best_x = x;
                        best_y = y;
                        best_utility = utility;
                    }
                }
            }
        }

        console.log("Green: best place for a city is at "+best_x+","+best_y);

        // Check if there is anything useful to do in cities
        for(key in cities){
            var city = cities[key];
            if(city.owner() == 'green'){
                if( city.food > 8 ){
                    if(best_x != undefined && best_y != undefined){
                        console.log("Green city at "+city.x+","+city.y+" builds a city at "+best_x+","+best_y);
                        city.build_city(best_x,best_y,'green');
                    }
                }
            }
        }
    }
};



