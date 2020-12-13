
var blue_player = {
    color: "#0000FF",
    take_turn: function(){
        // Check all tiles to find the best places to build
        var best_utility = -1000;
        var best_x;
        var best_y;
        for (var x = 1; x < map_size_x-1; x++) {
            for (var y = 1; y < map_size_y-1; y++) {
                // Blue Builds as close as possible
                if(is_city_allowed(x,y) && tile_array[x][y].owner == 'blue'){
                    var tile = tile_array[x][y]
                    var utility = tile.culture.blue;
                    
                    // Amount of food should count more
                    var food = sum_neighbours(x,y,function(a,b){
                        var food = 0;
                        if(tile_array[a][b].owner == 'blue' &&
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

        console.log("Blue: best place for a city is at "+best_x+","+best_y);

        // Check if there is anything useful to do in cities
        for(key in cities){
            var city = cities[key];
            if(city.owner() == 'blue'){
                if( city.level > 1 && city.food > 3 ){
                    if(best_x != undefined && best_y != undefined){
                        console.log("Green city at "+city.x+","+city.y+" builds a city at "+best_x+","+best_y);
                        city.build_city(best_x,best_y,'blue');
                    }
                }
            }
        }
    }
};



