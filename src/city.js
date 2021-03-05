// City class.
// Contains all the information about one city. Has a reference to the
// tile the city is on.
class City {
    constructor(tile, level, food) {
        this.tile = tile;
        this.x = tile.x;
        this.y = tile.y;
        this.level = level;
        this.food = food;
        this.name = this.next_name();
        this.workers_food = level;
        this.workers_wood = 0;
        this.priests = 0;

        // workers sent to other cities
        this.merchant_list = [];
        this.tribute_list = [];

        // Change tile properties
        tile.influence[this.owner()] = this.influence(this.owner());
        tile.road = true;
    }

    get merchants() {
        return this.merchant_list.length;
    }

    get foreign_merchants() {
        var number = 0;
        var this_city = this;
        game.cities.forEach(function(city){
            city.merchant_list.forEach(function(destination){
                if(destination == this_city){
                    number += 1;
                }
            });
        });
        return number;
    }

    get tributes() {
        return this.tribute_list.length;
    }

    get foreign_tributes() {
        var number = 0;
        var this_city = this;
        game.cities.forEach(function(city){
            city.tribute_list.forEach(function(destination){
                if(destination == this_city){
                    number += 1;
                }
            });
        });
        return number;
    }

    // Draw a new name from the owners list of names
    next_name(){
        var owner = players[this.owner()];
        console.log(this.owner(), owner, players);
        var name = owner.city_names[owner.cities];
        if(name == undefined){
            name = owner.city_prefix+owner.city_names[owner.cities%owner.city_names.length];
        }
        owner.cities += 1;
        return name;
    }


    // Calculate the base influence of the city
    influence(player){
        //return 3+Math.floor(this.level/3);
        var this_city = this;
        var influence = 0;
        if(player == this.owner()){
            influence += 4 + 0.5*this.priests - this.foreign_merchants
                      + this.foreign_tributes - this.tributes;
        }
        // Check for influence from other cities
        game.cities.forEach(function(city){
            if(city != this_city && city.owner() == player){
                influence += this_city.influence_from(city);
            }
        });
        return influence;
    }

    // How much another city excerts on this one
    influence_from(other_city, player){
        var influence = 0;
        other_city.merchant_list.forEach(function(destination){
            if(destination == this){
                influence += 1;
            }
        });
        return influence;
    }

    // return the owner of the city, which is the owner of the tile
    owner(){
        return this.tile.owner;
    }

    // Calculate the number of free workers
    free_workers() {
        return this.level - this.workers_wood - this.workers_food
               - this.priests - this.merchants - this.tributes;
    }

    // Find the maximum amount of food workers possible. This is the
    // minimum of the number of food tiles and the number of workers not
    // working on food
    // Note: if there will be more city resources, the food and wood functions
    // should be combined and the possible resources separely
    max_food_workers(){
        var max = this.free_workers() + this.workers_food;
        max = Math.min(this.food_tiles(), max);
        return max;
    }

    // Set the number of food workers
    set_food_workers(n){
        if(n >= 0 && n <= this.max_food_workers()){
            this.workers_food = n;
        }
    }

    // Find the maximum possible number of wood gatherers. Similar to
    // the max_food_workers()
    max_wood_workers(){
        var max = this.free_workers() + this.workers_wood;
        max = Math.min(this.wood_tiles(), max);
        return max;
    }

    // Set the number of wood workers. Similar to set_food_workers(n)
    set_wood_workers(n){
      if(n >= 0 && n <= this.max_wood_workers()){
            this.workers_wood = n;
        }
    }

    // Set the number of priests. The maximum number of priests and merchants
    // is just the current number + free workers
    set_priests(n){
       if(n >= 0 && n <= this.priests + this.free_workers()){
           this.priests = n;
       }
    }

    // Count food producing tiles around the city
    food_tiles(){
        var city = this;
        var food_tiles = 0;
        this.tile.neighbours()
        .forEach(function(tile){
            if(tile.owner == city.owner()){
                food_tiles += tile.is_food_tile();
            }
        });
        return food_tiles;
    }

    // Count wood producing tiles around the city
    wood_tiles(){
        var city = this;
        var wood_tiles = 0;
        this.tile.neighbours()
        .forEach(function(tile){
            if(tile.owner == city.owner()){
                wood_tiles += tile.is_wood_tile();
            }
        });
        return wood_tiles;
    }

    // Count fields around the city
    fields(){
        var city = this;
        var fields = 0;
        this.tile.neighbours()
        .forEach(function(tile){
            if(tile.owner == city.owner()){
                if(tile.field){
                    fields += 1;
                }
            }
        });
        return fields;
    }

    // The amount of food produced per turn
    food_production(){
        var workers = this.workers_food;
        var food_tiles = this.food_tiles();
        var fields = this.fields();
        var food = 1; // City always produces 1 food

        // 2 food / worker on a tile
        food += 2*Math.min(workers, food_tiles);

        // +1 extra for fields
        food += Math.min(workers, fields);

        // Tribute
        food += this.foreign_tributes - this.tributes;
        return food;
    }

    // The amount of wood produced per turn
    wood_production(){
        var wood = Math.min(this.workers_wood, this.wood_tiles());
        return wood;
    }

    // The amount of food consumed each turn
    // Food is consumed after it is gathered
    food_consumption() {
        return this.level;
    }

    // city grows when it has this much food
    food_limit() {
        return 10*this.level;
    }

    // Update the city. Run after each turn
    update(map_scene){
        var x = this.x;
        var y = this.y;

        // Check for newly unemployed workers. This can
        // happen if a tile is lost to another player.
        if(this.workers_food > this.max_food_workers()){
          this.workers_food = this.max_food_workers();
        }

        if(this.workers_wood > this.max_wood_workers()){
          this.workers_wood = this.max_wood_workers();
        }


        // Gather food
        var food = this.food_production();

        // Consume
        food -= this.food_consumption();

        // Check buildings
        if(this.building != undefined){
            var workers = this.free_workers();
            this.building.food -= Math.max(0, workers);
            if(food > 0){
              var food_diff = Math.min(food,this.building.food);
              this.building.food -= food_diff;
              food -= food_diff;
            }
            if(this.building.food <= 0 ) {
                this.building_done();
            }
        }

        // Add the any remaining food to reserves (or consume from reserves)
        this.food += food;

        // Check if the city grows
        if(this.food >= this.food_limit()){
            this.food -= this.food_limit();
            this.level += 1;
            // Automatically assign to food, then wood
            if(this.workers_food < this.food_tiles()){
                this.workers_food += 1;
            } else if(this.workers_wood < this.wood_tiles()){
                this.workers_wood += 1;
            }
            map_scene.update_city_sprite(x,y,this.level);
        }
        // Or if the city shrinks
        if(this.food < 0){
            this.level -= 1;
            this.food = this.food_limit()/4;
            if(this.free_workers() == 0){
                // Take workers first from wood, then food
                if(this.workers_wood > 0){
                    this.workers_wood -= 1;
                } else {
                    this.workers_food -= 1;
                }
            }
            map_scene.update_city_sprite(x,y,this.level);
        }

        // Gather other resources (wood)
        if(this.owner() != undefined){
            players[this.owner()].wood += this.wood_production();
        }
    }

    // Build a display line for a worker type
    make_worker_div(current, max, description, send, setter){
        var city = this;
        var worker_div = $("<div></div>").html(description + " ");
        // Also print the number of workers
        if(max){
            worker_div.append(" "+current+"/"+max);
        } else{
            worker_div.append(" "+current);
        }
        if(!send){
            // add worker button
            var pbutton = $("<span></span>").text("+").addClass("btn btn-primary btn-vsm");
            pbutton.click(function(){
                setter(current+1);
                game.update_city_page();
            });
            // remove worker button
            var mbutton = $("<span></span>").text("-").addClass("btn btn-primary btn-vsm");
            mbutton.click(function(){
                setter(current-1);
                game.update_city_page();
            });
            worker_div.append(pbutton);
            worker_div.append(mbutton);
        } else {
            // Send a new worker of this type to another city
            var sendbutton = $("<span></span>").text("send").addClass("btn btn-primary btn-vsm");
            sendbutton.click(function(){
                setter();
            });
            worker_div.append(sendbutton);
        }
        return worker_div;
    }


    // Describe the city in a div element
    describe(){
        var city = this;
        var div = $("<div></div>");
        // Name as an h4 tag
        div.append($("<h4></h4>").text(this.name));
        // Location
        div.append("<div><b>Tile:</b> x="+this.x+", y="+this.y+"</div>");
        // Print the amount of influence each player has here
        div.append(this.tile.describe_influence());
        // The city level
        div.append($("<div></div>").html("<b>Population</b>: "+this.level));
        // It's influence level
        div.append($("<div></div>").html("<b>City influence</b>: "+this.influence(this.owner())));

        // For the human player show more details and controls
        if(this.owner() == 'white'){
            // Show the amount of food and production rate
            var food_text = $("<div></div>").html("<b>Food</b>: "+this.food+"/"+
                                              this.food_limit()+" (");
            var food_prod = this.food_production() - this.food_consumption();
            if(food_prod >= 0){
                food_text.append($("<span></span>").text("+"+food_prod.toFixed(0)).css('color', 'green'));
            } else {
                food_text.append($("<span></span>").text(""+food_prod.toFixed(0)).css('color', 'red'));
            }
            food_text.append($("<span></span>").text(")"));
            div.append(food_text);

            // Show the number of free workers
            div.append($("<div></div>").html("<b>Free workers</b>: "+this.free_workers()));

            // And building projects (only colony exists for now)
            if(this.building){
                div.append($("<span></span>").text("Building a "+this.building.type
                 + "("+this.building.food+")"));
                var cancel_button = $("<span></span>").text("Cancel").addClass("btn btn-primary btn-vsm");
                cancel_button.click(function(){
                    city.cancel_building();
                    game.update_city_page();
                });
                div.append(cancel_button);
            }

            // Worker controls
            if(this.food_tiles() > 0){
                // Food can be collected. Show food worker control
                var worker_div = this.make_worker_div(
                    city.workers_food,
                    Math.min(this.food_tiles(), this.level),
                    "Farmers / Fishers:",
                    false,
                    function(n){city.set_food_workers(n)}
                );
                div.append(worker_div);
            }

            if(this.wood_tiles() > 0){
                // Wood can be collected. Add a similar slider
                var worker_div = this.make_worker_div(
                    city.workers_wood,
                    Math.min(this.wood_tiles(), this.level),
                    "Wood gatherers:",
                    false,
                    function(n){city.set_wood_workers(n)}
                );
                div.append(worker_div);
            }

                // Now priests and merchants are allowed
                var worker_div = this.make_worker_div(
                    city.priests,
                    0,
                    "Priests:",
                    false,
                    function(n){city.set_priests(n)}
                );
                div.append(worker_div);

                var worker_div = this.make_worker_div(
                    city.merchants,
                    0,
                    "Merchants:",
                    true,
                    function(n){
                        if(city.free_workers() > 0){
                            game.send_worker(city, 'merchant')
                        }
                    }
                );
                div.append(worker_div);

                var worker_div = this.make_worker_div(
                    city.tributes,
                    0,
                    "Tributes:",
                    true,
                    function(n){
                        if(city.free_workers() > 0){
                            game.send_worker(city, 'tribute')
                        }
                    }
                );
                div.append(worker_div);

            // Build colony button
            var build_per_turn = (this.food_production() + this.free_workers() - this.food_consumption());
            if(build_per_turn > 0){
              // Only add it if the city can ever finish a colony
              var turns_left = Math.ceil(city_items.colony.price / build_per_turn);
              if( turns_left < Infinity ) {
                var colony_button = $("<span></span>").text("Colony ("+turns_left+" turns)");
                colony_button.addClass("btn btn-success my-1");
                var city = this;
                colony_button.click(function(){
                    city.queue_colony();
                    game.update_city_page();
                });
                div.append(colony_button);
              }
            }
        }

        return div;
    }

    // Build and return a div containing a list of merchants and controls for
    // deleting and sending them
    worker_panel(){
        var div = $("<div></div>");
        // Name as an h4 tag
        div.append($("<h4></h4>").text(this.name));
        // title for the list of merchants
        div.append($("<div></div>").html("<b>Merchants</b>:"));
        // the list is a table
        var merchant_list = $("<table></table>")
        this.merchant_list.forEach(function(destination, i, list){
            var row = $("<tr></tr>");
            row.append($("<td></td>").html(destination.name));
            var deletebutton = $("<span></span>").text("remove").addClass("btn btn-primary btn-vsm");
            deletebutton.click(function(){
                list.splice(i, 1);
                game.update_city_page();
            });
            row.append($("<td></td>").append(deletebutton));
            merchant_list.append(row);
        });
        div.append(merchant_list);

        div.append($("<div></div>").html("<b>Tributes</b>:"));
        // the list is a table
        var tribute_list = $("<table></table>")
        this.tribute_list.forEach(function(destination, i, list){
            var row = $("<tr></tr>");
            row.append($("<td></td>").html(destination.name));
            var deletebutton = $("<span></span>").text("remove").addClass("btn btn-primary btn-vsm");
            deletebutton.click(function(){
                list.splice(i, 1);
                game.update_city_page();
            });
            row.append($("<td></td>").append(deletebutton));
            tribute_list.append(row);
        });
        div.append(tribute_list);
        return div;
    }

    // Start building a colony
    queue_colony(){
        if(this.building==undefined){
            this.building = {'food': city_items.colony.price, 'type': 'colony'};
        }
    }

    // Cancel the current building
    cancel_building(){
        if(this.building!=undefined){
            this.building = undefined;
        }
    }

    // Building is done
    building_done(){
        if(this.building.type == 'colony'){
            // add colony to the current owner
            if(this.owner()){
                players[this.owner()].colony += 1;
            }
        }
        this.building = undefined;
    }
}
