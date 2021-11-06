// City class.
// Contains all the information about one city. Has a reference to the
// tile the city is on.
class City {
    constructor(tile, level, food) {
        // Add this to the list of cities
        this.index = game.cities.length;
        game.cities.push( this );

        // Set base city properties
        this.tile = tile;
        this.x = tile.x;
        this.y = tile.y;
        this.level = level;
        this.population_counter = 0;
        this.name = this.next_name();

        // workers
        this.builders = 0;
        this.priests = 0;

        // workers sent to other cities
        this.merchant_routes = [];
        this.tribute_routes = [];

        // Assing new workers to
        this.new_worker_type = 'priest';

        // Change tile properties
        tile.road = true;

        this.calculate_influence();
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

    // Recalculates the city's influence
    calculate_influence(){
        var tiles = game.tiles;
        var city = this;
        // First zero this city's influence on all tiles
        game.forTiles(function(tile){
            tile.city_influence[city.index] = {};
            for(var player in players){
                tile.city_influence[city.index][player] = 0;
            }
        });

        // Run for each player. Should be fast if the player has not influence.
        for(var player in players){
            // Get influence at the city for each player
            this.tile.city_influence[city.index][player] = this.influence(player);

            // Now calculate influence. Track tiles that were changed and
            // update the neighbours, untill done.
            var updated = [this.tile];

            while(updated.length > 0){
                var to_do = updated;
                updated = [];
                to_do.forEach(function(tile){
                    var influence = tile.city_influence[city.index][player];
                    tile.neighbours().forEach(function(neighbour){
                        var nb_influence = neighbour.city_influence[city.index][player];
                        var new_influence = influence - neighbour.influence_friction();
                        if(new_influence > 0 && nb_influence < new_influence) {
                            var x = neighbour.x;
                            var y = neighbour.y;
                            var orig = game.tiles[x][y];
                            neighbour.city_influence[city.index][player] = new_influence;
                            updated.push(neighbour);
                        }
                    });
                });

            }
        }

        // update total influence
        game.recalc_influence();
    }



    // Number of a given worker type sent
    number_sent(type) {
        var num = 0;
        this[type+"_routes"].forEach(function(route){
            num += route.number;
        });
        return num;
    }

    // Number of a given worker type received
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
               - this.number_sent('merchant')
               - this.number_sent('tribute');
    }


    // Set the number of a given type of worker
    _set_worker(type, n){
        var max = this[type+'s'] + this.free_workers();
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

    // Get a list of cities with a trade route with this city
    get_trade_cities(player){
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

    // Check if a given city has a trade route with this
    has_trade_route_with(other_city){
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

    // Check if a worker can be sent
    can_send(worker_type, other_city){
        if(this.free_workers() < 1 || other_city == this){
            return false;
        }
        if(worker_type == 'merchant' && this.has_trade_route_with(other_city)){
            return false;
        }
        if(other_city.tile.influence[this.owner()] > 0){
            return true;
        }
        return false;
    }

    // Send a worker to another city
    send(worker_type, other_city){
       if(this.can_send(worker_type, other_city) && this.free_workers() > 0){
          // If the route already exists, add one. Otherwise create new route.
          for(var key in this[worker_type+'_routes']){
             var route = this[worker_type+'_routes'][key];
             if(route.destination == other_city){
                route.number += 1;
                return;
             }
          }
          // This is reached when no route already exists.
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

    // The amount of food produced
    food_production(){
        var food_tiles = this.food_tiles();
        var fields = this.fields();
        var food = 1; // City always produces 1 food

        // 1 food per food tile
        food += food_tiles;

        // +1 extra for fields
        food += fields;

        // +1 for each trading route
        food += this.number_sent('merchant')
              + this.number_received('merchant');

        // Tributes received and sent
        food -= 5*this.number_sent('tribute');
        return food;
    }

    // The amount of wood produced
    wood_production(){
        return this.wood_tiles();
    }

    // The amount of food consumed
    // Food is consumed after it is gathered
    food_consumption() {
        return this.level;
    }

    // The balance of food produced and consumed
    food_balance(){
        return this.food_production() - this.food_consumption();
    }

    // Update the city. Run after each turn
    update(map_scene){
        var x = this.x;
        var y = this.y;

        // Gather food
        var food = this.food_balance();

        if(food > 0){
            // Increase population growth counter if there is food
            this.population_counter += 1;
        }
        if(food < 0){
            // Decrease population growth counter if the population is starving
            this.population_counter -= 1;
        }

        // Check if the city grows
        var growth_limit = 10;
        if(this.population_counter >= growth_limit){
            this.population_counter = 0;
            this.level += 1;
            this._set_worker(this.new_worker_type, this[this.new_worker_type+'s']+1);
            map_scene.update_city_sprite(x,y,this.level);
        }
        // Or if the city shrinks
        var pop_after_shrink = 3;
        if(this.population_counter < 0 && this.level > 0){
            this.population_counter = pop_after_shrink;
            this.level -= 1;
            this.force_remove_worker();
            map_scene.update_city_sprite(x,y,this.level);
        }

        // Check buildings
        if(this.builders > 0){
            if(this.building == undefined){
                this.queue_colony();
            }
            this.building.price -= Math.max(0, this.builders);
            if(this.building.price <= 0 ) {
                this.building_done();
                this.queue_colony();
            }
        }

        // Gather other resources (wood)
        if(this.owner() != undefined){
            players[this.owner()].wood += this.wood_production();
        }
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
            } else {
                //this should never happen
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

        if(this.owner() == 'white'){
            // Show a growth bar and food balance rate, which it depends on
            div.append(this.growth_div());
        }

        // Print the amount of influence each player has here
        var influence_line = $("<div></div>").text("Influence on tile: ");
        if(this.owner() != undefined){
            var text = $("<span></span>").text(" "+this.tile.influence[this.owner()])
            .css('color', players[this.owner()].text_color);
            influence_line.append(text);
        }
        for(var key in players){
            if(key != this.owner()){
                var inf = this.tile.influence[key];
                if(inf > 0){
                   var text = $("<span></span>").text(" "+inf)
                   .css('color', players[key].text_color);
                   influence_line.append(text);
               }
            }
        }
        div.append(influence_line);
        // The city's influence level
        var influence_p = $("<div></div>").text("City influence: ");
        if(this.owner() != undefined){
            var text = $("<span></span>").text(" "+this.influence(this.owner()))
            .css('color', players[this.owner()].text_color);
            influence_p.append(text);
        }
        for(var key in this.influence){
            if(key != this.owner()){
                var inf = this.influence(key);
                if(inf > 0){
                    var text = $("<span></span>").text(" "+this.influence(key))
                    .css('color', players[key].text_color);
                    influence_p.append(text);
                }
            }
        }
        div.append(influence_p);

        // For the human player show more details and controls
        if(this.owner() == 'white'){
            // And building projects (only colony exists for now)
            if(this.building){
                var price = city_items[this.building.type].price;
                var left = this.building.price;
                div.append($("<span></span>").html("<b>Building "+this.building.type
                 + "</b> ("+left+")"));
                var percentage = 100*(price-left)/price;
                var progress = $('<div class="progress" style="height: 14px;"></div>"')
                progress.append('<div class="progress-bar bg-secondary" role="progressbar" style="width: '+percentage+'%"></div>');
                div.append(progress);
            }

            // Worker controls
            div.append($("<div></div>").html("<b>Workers</b>"));
            var assign_div = $("<div></div>").html("New workers are ");
            var assign_workers_to =$("<select></select>");
            assign_workers_to.append("<option value='priest'>Priests</option>");
            assign_workers_to.append("<option value='builder'>Builders</option>");
            assign_workers_to.val(city.new_worker_type);
            assign_div.append(assign_workers_to);
            div.append(assign_div);
            assign_workers_to.change(function(){
                var value = $(this).val();
                city.new_worker_type = value;
            });

            div.append($("<div></div>").html("Free workers: "+this.free_workers()));
            div.append(this.local_worker_div());

            // Lists of each worker type sent to cities
            div.append($("<div></div>").html("Merchants Sent:").append(this.create_send_button('merchant')));
            div.append(this.merchant_list(this.merchant_routes));
            div.append($("<div></div>").html("Tributes Sent:").append(this.create_send_button('tribute')));
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
        div.append($("<div></div>").html("Foreign Merchants:"));
        div.append(this.foreign_merchant_list(merchant_list));
        div.append($("<div></div>").html("Tributes Received:"));
        div.append(this.foreign_worker_list(tribute_list));

        return div;
    }

    growth_div(){
        var div = $("<div></div>");
        // Growth bar
        var progress = $('<div class="progress" style="height: 14px;"></div>"')
        progress.append('<div class="progress-bar" role="progressbar" style="width: '+this.population_counter+'0%"></div>');
        div.append(progress);
        // The city level
        if(this.food_balance() > 0){
            div.append($("<div></div>").html("<b>Population</b>: "+this.level+' (growing in '+(10-this.population_counter)+')'));
        }
        if(this.food_balance() == 0){
            div.append($("<div></div>").html("<b>Population</b>: "+this.level));
        }
        if(this.food_balance() < 0){
            div.append($("<div></div>").html("<b>Population</b>: "+this.level+' (shrinking in '+this.population_counter+')'));
        }
        // Food balance
        var food_balance = this.food_balance();
        var food_text = $("<div></div>").html("<b>Food balance</b>: "+this.food_balance());
        if(food_balance > 0){
            food_text.css('color', 'green');
        }
        if(food_balance < 0){
            food_text.css('color', 'red');
        }
        div.append(food_text);
        return div;
    }

    // List local workers
    local_worker_div(){
        var div = $("<div></div>");
        var city = this;

        var worker_div = this.make_worker_div(
            city.priests, 0, "Priests:", false, false,
            function(n){city.set_worker('priest', n)}
        );
        div.append(worker_div);

        var worker_div = this.make_worker_div(
            city.builders, 0, "Builder:", false, false,
            function(n){city.set_worker('builder', n)}
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
        var sendbutton = $("<span></span>").text("send").addClass("btn btn-vsm");
        var any_sendable = false;
        for(var key in game.cities){
            var city = game.cities[key];
            if(this.can_send(type, city)){
                any_sendable = true;
            }
        }
        if(this.free_workers() > 0 && any_sendable){
            sendbutton.addClass("btn-primary")
            var city = this;
            sendbutton.click(function(){
                if(city.free_workers() > 0){
                    game.send_worker(city, type)
                }
            });
        } else {
            sendbutton.addClass("btn-secondary")
        }
        return sendbutton;
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
        var show = city.owner() == "white";
        list.forEach(function(route){
            var row = $("<tr></tr>");
            var sender = route.source;
            if(sender.owner() && sender.owner() == 'white'){
                show = true;
                var set = function(n){sender.set_route_count(route, n)};
            }
            if(show){
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
            }
        });
        return list_div;
    }

    // Table foreign workers in a list. Include +- buttons
    foreign_worker_list(list){
        var list_div = $("<table></table>")
        var city = this;
        var show = city.owner() == "white";
        list.forEach(function(route){
            var row = $("<tr></tr>");
            var sender = route.source;
            if(show){
                if(sender.owner() && sender.owner() == 'white'){
                    var set = function(n){sender.set_route_count(route, n)};
                    show = true;
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
            }
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
