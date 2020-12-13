
var green_player = {
    color: "#00AA00",
    take_turn: function(){
        // Check all tiles to find the best places to build
        var best_utility = -1000;
        var best_x;
        var best_y;
        for (var x = 1; x < map_size_x-1; x++) {
            for (var y = 1; y < map_size_y-1; y++) {
                // Green likes to build on the edges, where culture is minimal
                if(is_city_allowed(x,y)){
                    var tile = tile_array[x][y]
                    utility = -tile.culture.green;
                    
                    // Amount of food should count more
                    var food = sum_neighbours(x,y,function(a,b){
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
                        console.log("Green city at "+x+","+y+" builds a city at "+x+","+y);
                        city.build_city(best_x,best_y,'green');
                    }
                }
            }
        }
    }
};



