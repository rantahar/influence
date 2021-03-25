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

        // Set current influence to start with
        this.current_influence = {};
        for(key in players){
            this.current_influence[key] = 0;
        }
        this.current_influence[this.owner()] = 10;

        // workers
        this.builders = 0;
        this.food_workers = level;
        this.wood_workers = 0;
        this.priests = 0;

        // workers sent to other cities
        this.merchant_routes = [];
        this.tribute_routes = [];

        // Assing new workers to
        this.new_worker_type = 'food_worker';

        // Change tile properties
        tile.influence[this.owner()] = this.influence(this.owner());
        tile.road = true;
    }

    number_sent(type) {
        var num = 0;
        this[type+"_routes"].forEach(function(route){
            num += route.number;
        });
        return num;
    }

    number_received(type) {
        var num = 0;
        var this_city = this;
        game.cities.forEach(function(city){
            city[type+"_routes"].forEach(function(route){
                if(route.destination == this_city){
                    num += route.number;
                }
            });
        });
        return num;
    }

    // Draw a new name from the owners list of names
    next_name(){
        var owner = players[this.owner()];
        var name = owner.city_names[owner.cities];
        if(name == undefined){
            name = owner.city_prefix+owner.city_names[owner.cities%owner.city_names.length];
        }
        owner.cities += 1;
        return name;
    }


    // Calculate the base influence of the city
    influence(player){
        var influence = 0;
        if(player == this.owner()){
            // base influence of the city goes to the owner
            influence += 10;
            // Foreign and local workers
            influence += this.priests;
            // Tributes increase influence in the receiving city and decrease
            // in the sender
            influence += this.number_received('tribute')
                       - this.number_sent('tribute');
            // Trade routes take one influence from here and send it to the
            // other city. But we also receive from the other city (below).
            influence -= this.number_received('merchant')
                       + this.number_sent('merchant');

        }
        // Merchants effect on influence.
        // Each trade route bring 1 of the controlling influence in the other
        // city
        var trade_cities = this.get_trade_cities();
        for(var key in trade_cities){
            var other_city = trade_cities[key];
            if(other_city.owner() == player){
                influence += 1;
            }
        }
        influence = Math.max(influence, 0);
        return influence;
    }

    // Count merchants to a given city
    merchants_to(other_city){
        var merchants = 0;
        this.merchant_routes.forEach(function(route){
            if(route.destination == other_city){
                merchants += route.number;
            }
        });
        return merchants;
    }

    // return the owner of the city, which is the owner of the tile
    owner(){
        return this.tile.owner;
    }

    // Calculate the number of free workers
    free_workers() {
        return this.level - this.builders - this.priests
               - this.wood_workers - this.food_workers
               - this.number_sent('merchant')
               - this.number_sent('tribute');
    }

    // Find the maximum amount of food workers possible. This is the
    // minimum of the number of food tiles and the number of workers not
    // working on food
    // Note: if there will be more city resources, the food and wood functions
    // should be combined and the possible resources separely
    max_food_workers(){
        var max = this.free_workers() + this.food_workers;
        max = Math.min(this.food_tiles(), max);
        return max;
    }

    // Find the maximum possible number of wood gatherers. Similar to
    // the max_food_workers()
    max_wood_workers(){
        var max = this.free_workers() + this.wood_workers;
        max = Math.min(this.wood_tiles(), max);
        return max;
    }

    // Set the number of a given type of worker
    _set_worker(type, n){
        var max = this[type+'s'] + this.free_workers();
        if(type == 'food_worker'){
            max = Math.min(this.food_tiles(), max);
        }
        if(type == 'wood_worker'){
            max = Math.min(this.wood_tiles(), max);
        }
        if(n >= 0 && n <= max ){
            this[type+'s'] = n;
        }
    }

    // Assign worker interactively:
    // Assign, clear the highlighting and update the city page
    set_worker(type, n){
       this._set_worker(type,n);
       game.update_city_page();
       game.remove_highlight();
    }


    // Set the number workers sent to city
    set_route_count(route, n){
       if(n >= 0 && n <= route.number + this.free_workers()){
           route.number = n;
       }
       // Clear routes with 0 workers
       this.merchant_routes.forEach(function(route, i, list){
           if(route.number == 0){
               list.splice(i, 1);
           }
       });
       this.tribute_routes.forEach(function(route, i, list){
           if(route.number == 0){
               list.splice(i, 1);
           }
       });
        // Remove any active highlight or onclick action and update page
        game.remove_highlight();
        game.update_city_page();
    }

    get_trade_cities(player){
        // Check that there are no other merchants of this type
        var cities = [];
        for(var key in this.merchant_routes){
            var route = this.merchant_routes[key];
            cities.push(route.destination);
        }
        for(var key in game.cities){
            var other_city = game.cities[key];
            for(var key in other_city.merchant_routes){
                var route = other_city.merchant_routes[key];
                if(route.destination == this){
                    cities.push(route.source);
                }
            }
        }
        return cities;
    }

    has_trade_route_with(other_city){
        // Check that there are no other merchants of this type
        for(var key in this.merchant_routes){
            var route = this.merchant_routes[key];
            if(route.destination == other_city){
                return true;
            }
        }
        for(var key in other_city.merchant_routes){
            var route = other_city.merchant_routes[key];
            if(route.destination == this){
                return true;
            }
        }
        return false;
    }

    // Send a worker to another city
    send(worker_type, other_city){
        if(worker_type == 'merchant' && this.has_trade_route_with(other_city)){
            return; //cannot set
        }
        if(this.free_workers() > 0){
           this[worker_type+'_routes'].push({
               'source': this,
               'destination': other_city,
               'number': 1
           });
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
        var workers = this.food_workers;
        var food_tiles = this.food_tiles();
        var fields = this.fields();
        var food = 1; // City always produces 1 food

        // 2 food / worker on a tile
        food += 2*Math.min(workers, food_tiles);

        // +1 extra for fields
        food += Math.min(workers, fields);

        // +1 for each trading route
        food += this.number_sent('merchant')
              + this.number_received('merchant');

        // Tributes received and sent
        food -= 5*this.number_sent('tribute');
        return food;
    }

    // The amount of wood produced per turn
    wood_production(){
        var wood = Math.min(this.wood_workers, this.wood_tiles());
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
        if(this.food_workers > this.max_food_workers()){
          this.food_workers = this.max_food_workers();
        }

        if(this.wood_workers > this.max_wood_workers()){
          this.wood_workers = this.max_wood_workers();
        }


        // Gather food
        var food = this.food_production();

        // Consume
        food -= this.food_consumption();

        // Check buildings
        if(this.building != undefined){
            // Free workers have no positive effect now
            //var workers = this.free_workers();
            this.building.price -= Math.max(0, this.builders);
            if(this.building.price <= 0 ) {
               this.building_done();
            }
        }

        // Add the any remaining food to reserves (or consume from reserves)
        this.food += food;

        // Check if the city grows
        if(this.food >= this.food_limit()){
            this.food -= this.food_limit();
            this.level += 1;
            this._set_worker(this.new_worker_type, this[this.new_worker_type+'s']+1);
            map_scene.update_city_sprite(x,y,this.level);
        }
        // Or if the city shrinks
        if(this.food < 0 && this.level > 0){
            this.level -= 1;
            this.force_remove_worker();
            this.food = this.food_limit()/4;
            map_scene.update_city_sprite(x,y,this.level);
        }

        // Gather other resources (wood)
        if(this.owner() != undefined){
            players[this.owner()].wood += this.wood_production();
        }
    }

    // Update current city influence by one turn and return it.
    // Current influence either increases or decreases by 1 untill
    // it reaches the city influence value
    update_influence(player){
        if(this.current_influence[player] > this.influence(player)){
            this.current_influence[player] = Math.max(this.current_influence[player]-1, this.influence(player));
        } else {
            this.current_influence[player] = Math.min(this.current_influence[player]+1, this.influence(player));
        }
        return this.current_influence[player];
    }

    // Remove a worker
    force_remove_worker(){
        if(this.free_workers() < 0){
            // First check the type the city is currently assigning
            var type = this.new_worker_type;
            if(this[type+'s'] > 0){
                this._set_worker(type, this[type+'s']-1);

            // Try every other type is somewhat arbitrary order
            } else if(this.tribute_routes.length > 0){
                this.tribute_routes.pop();
            } else if(this.merchant_routes.length > 0){
                this.merchant_routes.pop();
            } else if(this.priests > 0){
                this.priests -= 1;
            } else if(this.builders > 0){
                this.builders -= 1;
            } else if(this.wood_workers > 0){
                this.wood_workers -= 1;
            } else if(this.food_workers > 0){
                this.food_workers -= 1;
            } else {
                //this should never happen
                this.food_workers = 0;
                this.wood_workers = 0;
                this.builders = 0;
                this.priests = 0;
                this.tribute_routes = [];
                this.merchant_routes = [];
            }
        }
    }

    // Build a display line for a worker type
    make_worker_div(current, max, description, send, delete_button, setter){
        var city = this;
        var worker_div = $("<div></div>").html(description + " ");
        // Also print the number of workers
        if(max){
            worker_div.append(" "+current+"/"+max);
        } else{
            worker_div.append(" "+current);
        }
        if(setter != undefined && !send && !delete_button){
            // add worker button
            var pbutton = $("<span></span>").text("+").addClass("btn btn-vsm");
            if( this.free_workers() < 1 || (max > 0 && current == max) ){
                pbutton.addClass("btn-secondary")
            } else {
                pbutton.click(function(){
                    setter(current+1);
                    game.update_city_page();
                });
                pbutton.addClass("btn-primary")
            }
            // remove worker button
            var mbutton = $("<span></span>").text("-").addClass("btn btn-vsm");
            if(current == 0){
                mbutton.addClass("btn-secondary")
            } else {
                mbutton.click(function(){
                    setter(current-1);
                    game.update_city_page();
                });
                mbutton.addClass("btn-primary")
            }
            worker_div.append(pbutton);
            worker_div.append(mbutton);
        }
        if(setter != undefined && send){
            // Send a new worker of this type to another city
            var sendbutton = $("<span></span>").text("send").addClass("btn btn-vsm");
            if( this.free_workers() < 1 || (max > 0 && current == max) ){
                sendbutton.addClass("btn-secondary")
            } else {
                sendbutton.click(function(){
                    setter();
                });
                sendbutton.addClass("btn-primary")
            }
            worker_div.append(sendbutton);
        }
        if(setter != undefined && delete_button){
            // Send a new worker of this type to another city
            var deletebutton = $("<span></span>").text("delete").addClass("btn btn-primary btn-vsm");
            deletebutton.click(function(){
                setter(0);
            });
            worker_div.append(deletebutton);
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
            div.append(this.food_production_line());

            // Show the number of free workers
            div.append($("<div></div>").html("<b>Free workers</b>: "+this.free_workers()));

            // And building projects (only colony exists for now)
            if(this.building){
                div.append($("<span></span>").text("Building a "+this.building.type
                 + "("+this.building.price+")"));
                var cancel_button = $("<span></span>").text("Cancel").addClass("btn btn-primary btn-vsm");
                cancel_button.click(function(){
                    city.cancel_building();
                    game.update_city_page();
                });
                div.append(cancel_button);
            }

            // Worker controls
            div.append(this.local_worker_div());
            div.append(this.remote_worker_div());

            // Build colony button
            var turns_left = Math.ceil(city_items.colony.price / this.builders);
            var colony_button = $("<span></span>").text("Colony ("+city_items.colony.price+")");
            colony_button.addClass("btn btn-success my-1");
            var city = this;
            colony_button.click(function(){
                city.queue_colony();
                game.update_city_page();
            });
            div.append(colony_button);
        }

        return div;
    }

    food_production_line(){
        var food_text = $("<div></div>").html("<b>Food</b>: "+this.food+"/"+
                                          this.food_limit()+" (");
        var food_prod = this.food_production() - this.food_consumption();
        if(food_prod >= 0){
            food_text.append($("<span></span>").text("+"+food_prod.toFixed(0)).css('color', 'green'));
        } else {
            food_text.append($("<span></span>").text(""+food_prod.toFixed(0)).css('color', 'red'));
        }
        food_text.append($("<span></span>").text(")"));
        return food_text;
    }

    // List local workers
    local_worker_div(){
        var div = $("<div></div>");
        var city = this;
        // Builders first
        var worker_div = this.make_worker_div(
            city.builders, 0, "Builder:", false, false,
            function(n){city.set_worker('builder', n)}
        );
        div.append(worker_div);

        if(this.food_tiles() > 0){
            // Food can be collected. Show food worker control
            var max = this.food_tiles();
            var worker_div = this.make_worker_div(
                city.food_workers, max, "Farmers / Fishers:", false, false,
                function(n){city.set_worker('food_worker', n)}
            );
            div.append(worker_div);
        }

        if(this.wood_tiles() > 0){
            // Wood can be collected. Add a similar slider
            var max = this.wood_tiles();
            var worker_div = this.make_worker_div(
                city.wood_workers, max, "Wood gatherers:", false, false,
                function(n){city.set_worker('wood_worker', n)}
            );
            div.append(worker_div);
        }

        var worker_div = this.make_worker_div(
            city.priests, 0, "Priests:", false, false,
            function(n){city.set_worker('priest', n)}
        );
        div.append(worker_div);
        return div;
    }

    // div with the number of workers sent to other cities
    remote_worker_div(){
        var div = $("<div></div>");
        var city = this;

        var worker_div = this.make_worker_div(
            city.number_sent('merchant'), 0, "Merchants:", true, false,
            function(n){
                if(city.free_workers() > 0){
                    game.send_worker(city, 'merchant')
                }
            }
        );
        div.append(worker_div);

        var worker_div = this.make_worker_div(
            city.number_sent('tribute'), 0, "Tributes:", true, false,
            function(n){
                if(city.free_workers() > 0){
                    game.send_worker(city, 'tribute')
                }
            }
        );
        div.append(worker_div);
        return div;
    }

    // Button for sending a worker
    create_send_button(type){
        // Send a new worker of this type to another city
        var sendbutton = $("<span></span>").text("send").addClass("btn btn-primary btn-vsm");
        var city = this;
        sendbutton.click(function(){
            if(city.free_workers() > 0){
                game.send_worker(city, type)
            }
        });
        return sendbutton;
    }

    // Build and return a div containing a list of merchants and controls for
    // deleting and sending them
    worker_panel(){
        var city = this;
        var div = $("<div></div>");
        // Name as an h4 tag
        div.append($("<h4></h4>").text(this.name));
        if(this.owner() == 'white'){
            div.append(this.food_production_line());

            var assign_div = $("<div></div>").html("New workers are ");
            var assign_workers_to =$("<select></select>");
            assign_workers_to.append("<option value='food_worker'>Farmers / Fishers</option>");
            assign_workers_to.append("<option value='wood_worker'>Wood gatherers</option>");
            assign_workers_to.append("<option value='builder'>Builders</option>");
            assign_workers_to.append("<option value='priest'>Priests</option>");
            assign_workers_to.val(city.new_worker_type);
            assign_div.append(assign_workers_to);
            div.append(assign_div);
            assign_workers_to.change(function(){
                var value = $(this).val();
                city.new_worker_type = value;
            });

            div.append($("<div></div>").html("<b>Free workers</b>: "+this.free_workers()));
            div.append(this.local_worker_div());

            // Lists of each worker type sent to cities
            div.append($("<div></div>").html("<b>Merchants Sent</b>:").append(this.create_send_button('merchant')));
            div.append(this.merchant_list(this.merchant_routes));
            div.append($("<div></div>").html("<b>Tributes Sent</b>:").append(this.create_send_button('tribute')));
            div.append(this.worker_list(this.tribute_routes));
        }
        // List of workers from other cities
        var this_city = this;
        var merchant_list = [];
        var tribute_list = [];
        game.cities.forEach(function(city){
            city.merchant_routes.forEach(function(route){
                if(route.destination == this_city){
                    merchant_list.push(route);
                }
            });
            city.tribute_routes.forEach(function(route){
                if(route.destination == this_city){
                    tribute_list.push(route);
                }
            });
        });
        div.append($("<div></div>").html("<b>Foreign Merchants</b>:"));
        div.append(this.foreign_merchant_list(merchant_list));
        div.append($("<div></div>").html("<b>Tributes Received</b>:"));
        div.append(this.foreign_worker_list(tribute_list));
        return div;
    }

    // Given a list of merchants, return a table with a delete button
    merchant_list(list){
        var list_div = $("<table></table>")
        var city = this;
        list.forEach(function(route){
            var row = $("<tr></tr>");
            var worker_div = city.make_worker_div(
                route.number, 0, route.destination.name, false, true,
                function(n){route.source.set_route_count(route, n)}
            );
            row.append($("<td></td>").append(worker_div));
            list_div.append(row);
        });
        return list_div;
    }

    // Given a list of remote workers, return a table with +- buttons
    worker_list(list){
        var list_div = $("<table></table>")
        var city = this;
        list.forEach(function(route){
            var row = $("<tr></tr>");
            var worker_div = city.make_worker_div(
                route.number, 0, route.destination.name, false, false,
                function(n){route.source.set_route_count(route, n)}
            );
            row.append($("<td></td>").append(worker_div));
            list_div.append(row);
        });
        return list_div;
    }

    // Table of foreign merchants in a list. Include delete button
    foreign_merchant_list(list){
        var list_div = $("<table></table>")
        var city = this;
        list.forEach(function(route){
            var row = $("<tr></tr>");
            var sender = route.source;
            if(sender.owner() && sender.owner() == 'white'){
                var set = function(n){sender.set_route_count(route, n)};
            }
            var worker_div = city.make_worker_div(
                route.number, 0, sender.name, false, true, set
            );
            if(sender.owner()){
                worker_div.css('color', players[sender.owner()].text_color);
            } else {
                worker_div.css('color', 'gray');
            }
            row.append($("<td></td>").append(worker_div));
            list_div.append(row);
        });
        return list_div;
    }

    // Table foreign workers in a list. Include +- buttons
    foreign_worker_list(list){
        var list_div = $("<table></table>")
        var city = this;
        list.forEach(function(route){
            var row = $("<tr></tr>");
            var sender = route.source;
            if(sender.owner() && sender.owner() == 'white'){
                var set = function(n){sender.set_route_count(route, n)};
            }
            var worker_div = city.make_worker_div(
                route.number, 0, sender.name, false, false, set
            );
            if(sender.owner()){
                worker_div.css('color', players[sender.owner()].text_color);
            } else {
                worker_div.css('color', 'gray');
            }
            row.append($("<td></td>").append(worker_div));
            list_div.append(row);
        });
        return list_div;
    }

    // Start building a colony
    queue_colony(){
        if(this.building==undefined){
            this.building = {'price': city_items.colony.price, 'type': 'colony'};
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
