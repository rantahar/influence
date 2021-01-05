
var items = {
  field_price: 12,
  road_price: 5,
  colony_cost: 12,
}



function gameboard(map){
    var turn_counter = 1;

    //Players
    var players = {
        'white': {
            human: true,
            key: 'white',
            name: "White",
            text_color: '#FFFFFF',
            map_color: '#FFFFFF',
            city_names: ["Aztola", "Sivola", "Thokas", "Loran", "Sinala", "Umdela", "Wendu", "Umar",
                         "Ava-Umar","Atala","Ashtal Emal", "Lordan", "Ulanith", "Thelenula", "Astu",
                         "Omnal", "Eftala", "Alran", "Leran", "Sulona"],
            city_prefix: "Ala-",
            wood: 0,
            colonies: 0,
            culture: 0,
            cities: 0,
            owned_tiles: 1,
            take_turn(){}
        },
        'green': green_player,
        'blue': blue_player,
        'red': red_player,
        'violet': violet_player
    }

    // Format a number for displaying
    function format_number(n){
      var r;
      if( n < 10 ){
        r=n.toFixed(2);
      } else {
        r=n.toLocaleString();
      }
      return r;
    }


    // Create arrays indexed by x and y for each property of a tile
    var tiles = [];
    tiles.map_size_y = map.map.length;
    tiles.map_size_x = map.map[0].length;

    // Information about each tile
    class Tile {
        constructor(x, y, land) {
            this.x = x;
            this.y = y;
            this.owner = undefined;
            this.culture = {};
            this.land = land;

            this.sprites = [];
        }

        xup(){
            var msx = tiles.map_size_x;
            return tiles[(this.x+1)%msx][this.y];
        }

        xdn(){
            var msx = tiles.map_size_x;
            return tiles[(this.x-1+msx)%msx][this.y];
        }

        yupleft(){
            var msx = tiles.map_size_x; var msy = tiles.map_size_y;
            if(this.y%2) {
                return tiles[this.x][(this.y+1)%msy];
            } else {
                return tiles[(this.x-1+msx)%msx][(this.y+1)%msy];
            }
        }

        yupright(){
            var msx = tiles.map_size_x; var msy = tiles.map_size_y;
            if(this.y%2) {
                return tiles[(this.x+1)%msx][(this.y+1)%msy];
            } else {
                return tiles[this.x][(this.y+1)%msy];
            }
        }

        ydnleft(){
            var msx = tiles.map_size_x; var msy = tiles.map_size_y;
            if(this.y%2) {
                return tiles[this.x][(this.y-1+msy)%msy];
            } else {
                return tiles[(this.x-1+msx)%msx][(this.y-1+msy)%msy];
            }
        }

        ydnright(){
            var msx = tiles.map_size_x; var msy = tiles.map_size_y;
            if(this.y%2) {
                return tiles[(this.x+1)%msx][(this.y-1+msy)%msy];
            } else {
                return tiles[this.x][(this.y-1+msy)%msy];
            }
        }

        describe(){
            var div = this.describe_short();
            div.append(this.describe_culture());
            return div;
        }

        describe_short(){
            // Return a short description with
            var div = $("<div></div>");
            div.append("<p><b>Tile:</b> x="+this.x+", y="+this.y+"</p>");
            div.append("<p>"+map_descriptions[this.land]+"</p>");
            return div;
        }

        describe_culture(){
            // Show owner if there is one
            var div = $("<div></div>");
            var first = true;
            if(this.owner != undefined){
                var culture_p = $("<p></p>").text("Culture: ");
                var text = $("<span></span>").text(" "+format_number(this.culture[this.owner]))
                .css('color', players[this.owner].text_color);
                first = false
                culture_p.append(text);
            }
            for(var key in this.culture){
                if(first) {
                    var culture_p = $("<p></p>").text("Culture: ");
                }
                first = false;
                if(key != this.owner){
                    var text = $("<span></span>").text(" "+format_number(this.culture[key]))
                    .css('color', players[key].text_color);
                    culture_p.append(text);
                }
            }
            div.append(culture_p);
            return div;
        }

        is_empty(){
            if(this.city == undefined && this.building == undefined &&
               this.field == undefined &&
               this.land != 'f' && this.land != 'w'){
                return true;
            } else {
                return false;
            }
        }

        is_food_tile(){
            if(tiles[this.x][this.y].land == 'g'){
                return 1;
            }
            if(tiles[this.x][this.y].land == 'w'){
                return 1;
            }
            return 0;
        }

        is_wood_tile(){
            if(tiles[this.x][this.y].land == 'f'){
                return 1;
            }
            return 0;
        }


        neighbours = function (){
            return [
                this.xup(),
                this.yupright(),
                this.yupleft(),
                this.xdn(),
                this.ydnleft(),
                this.ydnright()
            ]
        }

        neighbour_2_tiles(){
            var msx = tiles.map_size_x; var msy = tiles.map_size_y;

            // These are always the same
            var r = [];

            for( var dx = -1; dx < 2; dx++){
                r.push(tiles[(this.x+dx+msx)%msx][(this.y+2)%msy]);
                r.push(tiles[(this.x+dx+msx)%msx][(this.y-2+msy)%msy]);
            }

            for( var dx = -2; dx < 3; dx++){
                r.push(tiles[(this.x+dx+msx)%msx][this.y]);
            }

            // The x-values at dy=+-1 depend on y
            if(this.y%2==1){
                for( var dx = -1; dx < 3; dx++){
                    r.push(tiles[(this.x+dx+msx)%msx][(this.y-1+msy)%msy]);
                    r.push(tiles[(this.x+dx+msx)%msx][(this.y+1+msy)%msy]);
                }
            } else {
                for( var dx = -2; dx < 2; dx++){
                    r.push(tiles[(this.x+dx+msx)%msx][(this.y-1+msy)%msy]);
                    r.push(tiles[(this.x+dx+msx)%msx][(this.y+1+msy)%msy]);
                }
            }
            return r;
        }

        is_city_allowed(){
            // check for neighbouring cities
            if( !(this.is_empty()) ){
                return false;
            }
            var allowed = true;
            this.neighbour_2_tiles().forEach(function(tile){
                if(tile.city != undefined ||
                   tile.building != undefined){
                     allowed = false;
                 }
            });
            return allowed;
        }

        is_road_allowed(){
            if( this.city != undefined || this.road != undefined){
                return false;
            }
            if( !( this.land == 'g' || this.land == 'f') ){
                return false;
            }
            var allowed = false;
            this.neighbours().forEach(function(tile){
                if(tile.road != undefined ||
                   tile.city != undefined ){
                    return allowed = true;
                }
            });
            return allowed;
        }

        is_field_allowed(){
            if( this.city != undefined || this.field != undefined){
                return false;
            }
            if( this.land != 'g' ){
                return false;
            }
            var allowed = false;
            this.neighbours().forEach(function(tile){
                if( tile.city != undefined ){
                    return allowed = true;
                }
            });
            return allowed;
        }

        decide_tile_owner(){
            this.owner = undefined;
            var owner_culture = 0;
            for(var player_key in players){
                var player_culture = this.get_player_culture(player_key);
                if( player_culture == owner_culture ) {
                    // No-one wins ties
                    this.owner = undefined;
                } else if( player_culture > owner_culture ){
                    this.owner = player_key;
                    owner_culture = player_culture;
                }
            }
        }

        get_player_culture(player){
            if(this.culture[player]){
                return this.culture[player];
            }
            return 0;
        }
    }


    // Build the array
    for(var x = 0; x < tiles.map_size_x; x++) {
        tiles[x] = [];
        for(var y = 0; y < tiles.map_size_y; y++) {
            tiles[x][y] = new Tile(x, y, map.map[y][x]);
        }
    }




    // City class
    class City {
        constructor(x, y, level, food) {
            this.number = cities.length;
            this.x = x;
            this.y = y;
            this.tile = tiles[x][y];
            this.level = level;
            this.food = food;
            this.name = this.next_name();
            this.workers_food = level;
            this.workers_wood = 0;
            tiles[x][y].culture[this.owner()] = this.culture();
            tiles[x][y].road = true;
        }

        // Name the city
        next_name(){
            var owner = players[this.owner()];
            var name = owner.city_names[owner.cities];
            if(name == undefined){
                name = owner.city_prefix+owner.city_names[owner.cities%owner.city_names.length];
            }
            owner.cities += 1;
            return name;
        }


        // Calculate the culture production of the city
        culture(){
            return 12*Math.pow(2,this.level);
        }

        owner(){
            return tiles[this.x][this.y].owner;
        }

        free_workers() {
            return this.level - this.workers_wood - this.workers_food;
        }

        set_food_workers(n){
            var min = this.level - this.workers_wood;
            min = Math.min(this.food_tiles(), min);
            console.log(this.food_tiles(), this.level - this.workers_wood);
            if(n >= 0 && n <= min){
                this.workers_food = n;
            }
        }

        set_wood_workers(n){
            var min = this.level - this.workers_food;
            min = Math.min(this.wood_tiles(), min);
            console.log(this.wood_tiles(), this.level - this.workers_food);
            if(n >= 0 && n <= min){
                this.workers_wood = n;
            }
        }

        food_tiles(){
            var city = this;
            var food_tiles = 0;
            tiles[this.x][this.y].neighbours()
            .forEach(function(tile){
                if(tile.owner == city.owner()){
                    food_tiles += tile.is_food_tile();
                }
            });
            return food_tiles;
        }

        wood_tiles(){
            var city = this;
            var wood_tiles = 0;
            tiles[this.x][this.y].neighbours()
            .forEach(function(tile){
                if(tile.owner == city.owner()){
                    wood_tiles += tile.is_wood_tile();
                }
            });
            return wood_tiles;
        }

        fields(){
            var city = this;
            var fields = 0;
            tiles[this.x][this.y].neighbours()
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

        // city grows when the city has this much food
        food_limit() {
            return 10*this.level;
        }

        // Update the city
        update(map_scene){
            var x = this.x;
            var y = this.y;

            // Gather food
            var food = this.food_production();

            // Consume
            food -= this.food_consumption();

            // Check buildings
            if(this.building != undefined){
                if(this.owner()=='white'){
                  console.log(this.building.food);
                }
                var workers = this.free_workers();
                this.building.food -= Math.max(0, workers);
                if(food > 0){
                  var food_diff = Math.min(food,this.building.food);
                  this.building.food -= food_diff;
                  food -= food_diff;
                  if(this.owner()=='white'){
                    console.log(this.building.food, workers, food_diff, food);
                  }
                }
                if(this.building.food <= 0 ) {
                    this.building_done();
                }
            }

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
            if(this.food < 0 && this.level > 1){
                this.level -= 1;
                this.food = this.food_limit()/2;
                if(this.free_workers() == 0){
                    if(this.workers_wood > 0){
                        this.workers_wood -= 1;
                    } else {
                        this.workers_food -= 1;
                    }
                }
                map_scene.update_city_sprite(x,y,this.level);
            }

            // Gather other resources
            if(this.owner() != undefined){
                players[this.owner()].wood += this.wood_production();
            }
        }


        // Describe the city in html
        describe(){
            var city = this;
            var div = $("<div></div>");
            div.append($("<h4></h4>").text(this.name));
            div.append("<p><b>Tile:</b> x="+this.x+", y="+this.y+"</p>");
            div.append(this.tile.describe_culture());
            div.append($("<p></p>").html("<b>Level</b>: "+this.level));
            if(active_city.owner() == 'white'){
                var food_text = $("<p></p>").html("<b>Food</b>: "+this.food+" (");
                var food_prod = this.food_production() - this.food_consumption();
                if(food_prod >= 0){
                    food_text.append($("<span></span>").text("+"+food_prod.toFixed(0)).css('color', 'green'));
                } else {
                    food_text.append($("<span></span>").text(""+food_prod.toFixed(0)).css('color', 'red'));
                }
                food_text.append($("<span></span>").text(")"));
                div.append(food_text);
                div.append($("<p></p>").html("<b>Free workers</b>: "+this.free_workers()));
                if(this.building){
                    console.log(this.building.food);
                    div.append($("<p></p>").text("Building a "+this.building.type
                     + "("+this.building.food+")"));
                    var cancel_button = $("<span></span>").text("Cancel").addClass("btn btn-primary btn-vsm");
                    cancel_button.click(function(){
                        city.cancel_building();
                        update_city_page();
                    });
                    div.append(cancel_button);
                }

                if(this.food_tiles() > 0){
                    var max = Math.min(this.food_tiles(), this.level);
                    var food_slider_div = $("<div></div>").html("Food workers:</br>");
                    var mbutton = $("<span></span>").text("-").addClass("btn btn-primary btn-vsm");
                    mbutton.click(function(){
                        city.set_food_workers(city.workers_food-1);
                        update_city_page();
                    });
                    food_slider_div.append(mbutton);
                    var food_slider = $('<input>').attr({
                        type: "range",
                        min: 0,
                        max: max,
                        value: this.workers_food,
                        class: "slider"
                    }).appendTo(food_slider_div);
                    food_slider.change(function(){
                        city.set_food_workers($(this).val());
                        update_city_page();
                    });
                    var pbutton = $("<span></span>").text("+").addClass("btn btn-primary btn-vsm");
                    pbutton.click(function(){
                        city.set_food_workers(city.workers_food+1);
                        update_city_page();
                    });
                    food_slider_div.append(pbutton);
                    food_slider_div.append(" "+this.workers_food+"/"+max);
                    div.append(food_slider_div);
                }

                if(this.wood_tiles() > 0){
                    var max = Math.min(this.wood_tiles(), this.level);
                    var wood_slider_div = $("<div></div>").html("Wood workers:</br>");
                    var mbutton = $("<span></span>").text("-").addClass("btn btn-primary btn-vsm");
                    mbutton.click(function(){
                        city.set_wood_workers(city.workers_wood-1);
                        update_city_page();
                    });
                    wood_slider_div.append(mbutton);
                    var wood_slider = $('<input>').attr({
                        type: "range",
                        min: 0,
                        max: max,
                        value: this.workers_wood,
                        class: "slider"
                    }).appendTo(wood_slider_div);
                    wood_slider.change(function(){
                        city.set_wood_workers($(this).val());
                        update_city_page();
                    });
                    var pbutton = $("<span></span>").text("+").addClass("btn btn-primary btn-vsm");
                    pbutton.click(function(){
                        city.set_wood_workers(city.workers_wood+1);
                        update_city_page();
                    });
                    wood_slider_div.append(pbutton);
                    wood_slider_div.append(" "+this.workers_wood+"/"+max);
                    div.append(wood_slider_div);
                }

                // Add colony button
                var build_per_turn = (this.food_production() + this.free_workers() - this.food_consumption());
                if(build_per_turn > 0){
                  var turns_left = Math.ceil(items.colony_cost / build_per_turn);
                  if( turns_left < Infinity ) {
                    var colony_button = $("<span></span>").text("Colony ("+turns_left+" turns)");
                    colony_button.addClass("btn btn-success my-1");
                    colony_button.click(function(){
                        active_city.queue_colony();
                        update_city_page();
                    });
                    div.append(colony_button);
                  }
                }
            }

            return div;
        }

        // Start building a colony
        queue_colony(){
            if(this.building==undefined){
                this.building = {'food': items.colony_cost, 'type': 'colony'};
            }
        }

        cancel_building(){
            if(this.building!=undefined){
                this.building = undefined;
            }
        }

        building_done(){
            if(this.building.type == 'colony'){
                players[this.owner()].colonies += 1;
            }
            this.building = undefined;
        }
    }

    // Keep track of existing cities
    var cities = [];






    class mapScene extends Phaser.Scene {
        constructor() {
            super('mapScene');
            this.map;
            this.layer;
            this.city_layer;

            this.boundary_markers = [];
            this.highlights = [];

            this.tile_scale = 1.75;
            this.tile_height = 25;
            this.tile_width = 31;

            this.click_time = 100000;
        }

        preload (){
            this.load.spritesheet(
                'roadtiles',
                "assets/roads.png",
                { frameWidth: 32, frameHeight: 34 }
            );
            this.load.spritesheet(
                'citytiles',
                "assets/Toens_Medieval_Strategy_Sprite_Pack/cities.png",
                { frameWidth: 32, frameHeight: 32 }
            );
            this.load.spritesheet(
                'allToenstiles',
                "assets/Toens_Medieval_Strategy_Sprite_Pack/tileset.png",
                { frameWidth: 16, frameHeight: 16 }
            );
            this.load.spritesheet(
                'hexground',
                "assets/elite_command_art_terrain/tileset.png",
                { frameWidth: 32, frameHeight: 34 }
            );
            this.load.spritesheet(
                'foresttile',
                "assets/elite_command_art_terrain/modified/forest.png",
                { frameWidth: 32, frameHeight: 34 }
            );
        }

        create (){
            // Board size
            this.board_height = this.tile_height*tiles.map_size_x;
            this.board_width = this.tile_width*tiles.map_size_y;

            this.draw_map();

            // Add towns
            for(var player in map.start){
                var start = map.start[player];
                tiles[start.x][start.y].owner = player;
                this.add_city(start.x,start.y, 3, 5);
                if(player == 'white'){
                    this.center_camera_on(start.x,start.y);
                    active_city = tiles[start.x][start.y].city;
                    update_city_page();
                    active_tile = tiles[start.x][start.y];
                    update_panel();
                }
            }

            this.cursors = this.input.keyboard.createCursorKeys();
            this.escape_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
            this.cameras.main.removeBounds();

            if(map.at_start){
                map.at_start();
            }

        }

        update(time, delta){
            this.click_time += delta;

            if (this.cursors.left.isDown)
            {
                var x = this.cameras.main.scrollX;
                var mx = tiles.map_size_x*this.tile_width*this.tile_scale;
                x = (x-0.5*delta+mx)%mx;
                this.cameras.main.scrollX = x;
            }
            else if (this.cursors.right.isDown)
            {
                var x = this.cameras.main.scrollX;
                var mx = tiles.map_size_x*this.tile_width*this.tile_scale;
                x = (x+0.5*delta+mx)%mx;
                this.cameras.main.scrollX = x;
            }
            else if (this.cursors.up.isDown)
            {
                var y = this.cameras.main.scrollY;
                var my = tiles.map_size_y*this.tile_height*this.tile_scale;
                y = (y-0.5*delta+my)%my;
                this.cameras.main.scrollY = y;
            }
            else if (this.cursors.down.isDown)
            {
                var y = this.cameras.main.scrollY;
                var my = tiles.map_size_y*this.tile_height*this.tile_scale;
                y = (y+0.5*delta+my)%my;
                this.cameras.main.scrollY = y;
            }

            // preview
            // Translate mouse location to tile xy coordinate
            var x = this.input.activePointer.x;
            var y = this.input.activePointer.y;
            if(x > 0 && x<650 && y>0 && y<650){
                var width  = this.tile_scale*this.tile_width;
                var height = this.tile_scale*this.tile_height
                x = (x+this.cameras.main.scrollX)/width;
                y = (y+this.cameras.main.scrollY)/height;
                y = Math.floor( (y + 0.5 + tiles.map_size_y) % tiles.map_size_y);
                if(y%2==0){
                    x = Math.floor( (x + 0.5 + tiles.map_size_x) % tiles.map_size_x);
                } else {
                    x = Math.floor( (x + tiles.map_size_x) % tiles.map_size_x);
                }

                if(this.preview == 'city'){
                    if(this.previous_preview){
                        this.destroy_sprite(this.previous_preview.x,this.previous_preview.y,this.previous_preview.z);
                    }
                    this.put_tile_at(x, y, 5, 'citytiles', 1);
                    this.previous_preview = {x: x, y: y, z: 5};
                }

                if(this.preview == 'field'){
                    if(this.previous_preview){
                        this.destroy_sprite(this.previous_preview.x,this.previous_preview.y,this.previous_preview.z);
                    }
                    this.put_tile_at(x, y, 5, 'allToenstiles', 48);
                    this.previous_preview = {x: x, y: y, z: 5};
                }

                if(this.preview == 'road'){
                    if(this.previous_preview){
                        this.destroy_sprite(this.previous_preview.x,this.previous_preview.y,this.previous_preview.z);
                    }
                    this.put_tile_at(x, y, 5, 'roadtiles', 0);
                    this.previous_preview = {x: x, y: y, z: 5};
                }

                if(this.preview == undefined && this.previous_preview){
                    if(this.previous_preview){
                        this.destroy_sprite(this.previous_preview.x,this.previous_preview.y,this.previous_preview.z);
                    }
                    this.previous_preview = undefined;
                }

                if (this.escape_key.isDown)
                {
                    this.remove_highlight();
                    this.preview = undefined;
                }

                if(this.input.activePointer.isDown){
                    if(this.click_time > 500){
                        console.log('click', this.click_time);
                        tile_click(this, tiles[x][y]);
                        this.click_time = 0;
                    }
                }
            }

            if(map.on_update){
                map.on_update();
            }
        }

        center_camera_on(x,y){
            var width = this.tile_scale*this.tile_width;
            var height = this.tile_scale*this.tile_height;
            var loc_x = (x+tiles.map_size_x+1)%(tiles.map_size_x+1);
            var loc_y = (y+tiles.map_size_y+1)%(tiles.map_size_y+1);
            if( loc_x < tiles.map_size_x/2){
                loc_x += tiles.map_size_x;
            }
            if( loc_y < tiles.map_size_y/2){
                loc_y += tiles.map_size_y;
            }
            this.cameras.main.scrollX = width*loc_x - 300;
            this.cameras.main.scrollY = height*loc_y - 300;
        }

        draw_map(){
            for(let x = 0; x < tiles.map_size_x; x++) {
                for(let y = 0; y < tiles.map_size_y; y++) {
                    var key = tiles[x][y].land;
                    var yhex = y;
                    var xhex = x;
                    if(y%2){
                        xhex += 0.5;
                    }
                    this.draw_tile(xhex,yhex,tiles[x][y],'hexground', key);
                    this.draw_tile(xhex+tiles.map_size_x,yhex,tiles[x][y],'hexground', key);
                    this.draw_tile(xhex,yhex+tiles.map_size_y,tiles[x][y],'hexground', key);
                    this.draw_tile(xhex+tiles.map_size_x,yhex+tiles.map_size_y,tiles[x][y],'hexground', key);
                }
            }
        }

        draw_tile(x,y,tile,sheet, key){
            var sprite = this.add.sprite(
                this.tile_scale*this.tile_width*x,
                this.tile_scale*this.tile_height*y,
                sheet, map_sprites[key].map
            );
            sprite.setScale(this.tile_scale,this.tile_scale);
            sprite.depth=1;
            sprite.setInteractive();
            //sprite.on('pointerdown',function() {
            //    tile_click(phaser_game.scene.scenes[0],tile);
            //});
            if(map_sprites[key].decor){
                var sprite = this.add.sprite(
                    this.tile_scale*this.tile_width*x,
                    this.tile_scale*this.tile_height*y,
                    map_sprites[key].decor[0], map_sprites[key].decor[1]
                );
                sprite.setScale(this.tile_scale,this.tile_scale);
                sprite.depth=3; // above the road layer
            }
        }

        draw_dynamic_tile(x,y,z,sheet, key, angle){
            var sprite = this.add.sprite(
                this.tile_scale*this.tile_width*x,
                this.tile_scale*this.tile_height*y,
                sheet, key
            );
            sprite.setScale(this.tile_scale,this.tile_scale);
            sprite.depth=z;
            sprite.angle=angle;
            return sprite;
        }

        destroy_sprite(x,y,z){
            if(tiles[x][y].sprites){
                for(var i in tiles[x][y].sprites) {
                    var sprite = tiles[x][y].sprites[i];
                    if(sprite.depth == z){
                        sprite.destroy();
                        delete tiles[x][y].sprites[i];
                    }
                }
            }
        }

        destroy_layer(z){
            for(let x = 0; x < tiles.map_size_x; x++) {
                for(let y = 0; y < tiles.map_size_y; y++) {
                    for(var i in tiles[x][y].sprites) {
                        var sprite = tiles[x][y].sprites[i];
                        if(sprite.depth == z){
                            sprite.destroy();
                            delete tiles[x][y].sprites[i];
                        }
                    }
                }
            }
        }

        remove_tiles_at(x,y,z){
            for(var i in tiles[x][y].sprites) {
                var sprite = tiles[x][y].sprites[i];
                if(sprite.depth == z){
                    sprite.destroy();
                    delete tiles[x][y].sprites[i];
                }
            }
        }

        add_tile_at(x,y,z,sheet,key,angle=0){
            var yhex = y;
            var xhex = x;
            if(y%2){
                xhex += 0.5;
            }
            tiles[x][y].sprites.push(
                this.draw_dynamic_tile(xhex, yhex, z, sheet, key, angle),
                this.draw_dynamic_tile(xhex + tiles.map_size_x, yhex, z, sheet, key, angle),
                this.draw_dynamic_tile(xhex, yhex+tiles.map_size_y, z, sheet, key, angle),
                this.draw_dynamic_tile(xhex + tiles.map_size_x, yhex+tiles.map_size_y, z, sheet, key, angle)
            )
        }

        put_tile_at(x,y,z,sheet,key,angle=0){
            this.remove_tiles_at(x,y,z);
            this.add_tile_at(x,y,z,sheet,key,angle);
        }

        add_city(x, y, level = 0, food = 0){
            var city = new City(x, y, level, food);
            tiles[x][y].city = city;
            cities.push( city );
            this.draw_boundaries();
            this.update_city_sprite(x, y, level);

            var map = this;
            map.update_road_sprite(x, y);
            tiles[x][y].neighbours().forEach(function(tile){
                map.update_road_sprite(tile.x, tile.y);
            });
        }

        update_city_sprite(x,y,level){
            if(level < 20){
                var key = Math.floor((level+1)/2);
                this.put_tile_at(x,y,3,'citytiles', key);
            }
        }

        add_road(x, y){
            tiles[x][y].road = true;
            var map = this;
            map.update_road_sprite(x, y);
            tiles[x][y].neighbours().forEach(function(tile){
                map.update_road_sprite(tile.x, tile.y);
            });
        }

        add_field(x, y){
            console.log("adding field at ",x,y);
            tiles[x][y].field = true;
            this.put_tile_at(x,y,3,'allToenstiles', 48);
        }


        update_road_sprite(x, y){
            this.remove_tiles_at(x,y,2);
            if(tiles[x][y].road){
                var nbs = tiles[x][y].neighbours();
                for(var i in nbs){
                    var tile = nbs[i];
                    if(tile.road){
                        var angle = i*60;
                        this.add_tile_at(x, y, 2, 'roadtiles', 0, angle);
                    }
                }
            }
        }

        draw_boundaries(){
            // Remove old boundaries
            this.boundary_markers.forEach(function(marker, i){
                marker.destroy();
            });

            for(var x = 0; x < tiles.map_size_x; x++) {
                for(var y = 0; y < tiles.map_size_y; y++) {
                    this.check_border_x(x,y,1);
                    this.check_border_x(x,y,-1);
                    this.check_border_y1(x,y,1);
                    this.check_border_y1(x,y,-1);
                    this.check_border_y2(x,y,1);
                    this.check_border_y2(x,y,-1);
                }
            }
        }

        check_border_x(x,y,dx){
            var width =  this.tile_scale*this.tile_width;
            var height = this.tile_scale*this.tile_height;
            var side = this.tile_scale*this.tile_width/2;
            var msx = tiles.map_size_x;
            var xp = (x+dx+msx)%msx;
            var yhex = y;
            var xhex = x;
            if(y%2){
                xhex += 0.5;
            }

            if( tiles[x][y].owner != undefined &&
                tiles[x][y].owner != tiles[xp][y].owner )
            {
                var player = players[tiles[x][y].owner];
                var color = Phaser.Display.Color.HexStringToColor(player.map_color);
                var marker = this.add.graphics({
                    lineStyle: { width: 5, color: color.color, alpha: 0.4 }
                });
                marker.beginPath();
                var dy1 = side/2;
                var dy2 = -side/2;
                var dx1 = side-4;
                var dx2 = side-4;
                marker.moveTo(xhex*width + dx*dx1, yhex*height + dx*dy1);
                marker.lineTo(xhex*width + dx*dx2, yhex*height + dx*dy2);
                marker.moveTo(xhex*width + dx*dx1, (yhex+tiles.map_size_y)*height + dx*dy1);
                marker.lineTo(xhex*width + dx*dx2, (yhex+tiles.map_size_y)*height + dx*dy2);
                marker.moveTo((xhex+tiles.map_size_x)*width + dx*dx1, yhex*height + dx*dy1);
                marker.lineTo((xhex+tiles.map_size_x)*width + dx*dx2, yhex*height + dx*dy2);
                marker.moveTo((xhex+tiles.map_size_x)*width + dx*dx1, (yhex+tiles.map_size_y)*height + dx*dy1);
                marker.lineTo((xhex+tiles.map_size_x)*width + dx*dx2, (yhex+tiles.map_size_y)*height + dx*dy2);
                marker.strokePath();
                marker.depth=2;
                this.boundary_markers.push(marker);
            }
        }

        check_border_y1(x,y,dy){
            var width =  this.tile_scale*this.tile_width;
            var height = this.tile_scale*this.tile_height;
            var side = this.tile_scale*this.tile_width/2;
            var msy = tiles.map_size_y;
            var msx = tiles.map_size_x;
            var yp = (y+dy+msy)%msy;
            if(y%2){
                var xp = (x+msx)%msx;
            } else {
                var xp = (x-1+msx)%msx;
            }
            var yhex = y;
            var xhex = x;
            if(y%2){
                xhex += 0.5;
            }

            if( tiles[x][y].owner != undefined &&
                tiles[x][y].owner != tiles[xp][yp].owner )
            {
                var player = players[tiles[x][y].owner];
                var color = Phaser.Display.Color.HexStringToColor(player.map_color);
                var marker = this.add.graphics({
                    lineStyle: { width: 5, color: color.color, alpha: 0.4 }
                });
                marker.beginPath();
                var dy1 = height-side/2-4;
                var dy2 = side/2;
                var dx2 = side-4;
                marker.moveTo(xhex*width, yhex*height + dy*dy1);
                marker.lineTo(xhex*width - dx2, yhex*height + dy*dy2);
                marker.moveTo(xhex*width, (yhex+tiles.map_size_y)*height + dy*dy1);
                marker.lineTo(xhex*width - dx2, (yhex+tiles.map_size_y)*height + dy*dy2);
                marker.moveTo((xhex+tiles.map_size_x)*width, yhex*height + dy*dy1);
                marker.lineTo((xhex+tiles.map_size_x)*width - dx2, yhex*height + dy*dy2);
                marker.moveTo((xhex+tiles.map_size_x)*width, (yhex+tiles.map_size_y)*height + dy*dy1);
                marker.lineTo((xhex+tiles.map_size_x)*width - dx2, (yhex+tiles.map_size_y)*height + dy*dy2);
                marker.strokePath();
                marker.depth=2;
                this.boundary_markers.push(marker);
            }
        }

        check_border_y2(x,y,dy){
            var width =  this.tile_scale*this.tile_width;
            var height = this.tile_scale*this.tile_height;
            var side = this.tile_scale*this.tile_width/2;
            var msy = tiles.map_size_y;
            var msx = tiles.map_size_x;
            var yp = (y+dy+msy)%msy;
            if(y%2){
                var xp = (x+1+msx)%msx;
            } else {
                var xp = (x+msx)%msx;
            }
            var yhex = y;
            var xhex = x;
            if(y%2){
                xhex += 0.5;
            }

            if( tiles[x][y].owner != undefined &&
                tiles[x][y].owner != tiles[xp][yp].owner )
            {
                var player = players[tiles[x][y].owner];
                var color = Phaser.Display.Color.HexStringToColor(player.map_color);
                var marker = this.add.graphics({
                    lineStyle: { width: 5, color: color.color, alpha: 0.4 }
                });
                marker.beginPath();
                var dy1 = height-side/2-4;
                var dy2 = side/2;
                var dx2 = side-4;
                marker.moveTo(xhex*width, yhex*height + dy*dy1);
                marker.lineTo(xhex*width + dx2, yhex*height + dy*dy2);
                marker.moveTo(xhex*width, (yhex+tiles.map_size_y)*height + dy*dy1);
                marker.lineTo(xhex*width + dx2, (yhex+tiles.map_size_y)*height + dy*dy2);
                marker.moveTo((xhex+tiles.map_size_x)*width, yhex*height + dy*dy1);
                marker.lineTo((xhex+tiles.map_size_x)*width + dx2, yhex*height + dy*dy2);
                marker.moveTo((xhex+tiles.map_size_x)*width, (yhex+tiles.map_size_y)*height + dy*dy1);
                marker.lineTo((xhex+tiles.map_size_x)*width + dx2, (yhex+tiles.map_size_y)*height + dy*dy2);
                marker.strokePath();
                marker.depth=2;
                this.boundary_markers.push(marker);
            }
        }

        highlight_allowed_tile(x,y){
            var width =  this.tile_scale*this.tile_width;
            var height = this.tile_scale*this.tile_height;
            var side = width/2;
            var yhex = y;
            var xhex = x;
            if(y%2){
                xhex += 0.5;
            }
            var dy = height-side;
            var corners = [side,height+dy, 0,side+dy, 0,dy, side,0, 2*side,dy, 2*side,side+dy];
            var tile = this.add.polygon(width*xhex, height*yhex, corners, 0x55ff55, 0.5);
            tile.depth=2;
            this.highlights.push(tile);
            var tile = this.add.polygon(width*xhex, height*(yhex+tiles.map_size_y), corners, 0x55ff55, 0.5);
            tile.depth=2;
            this.highlights.push(tile);
            var tile = this.add.polygon(width*(xhex+tiles.map_size_x), height*yhex, corners, 0x55ff55, 0.5);
            tile.depth=2;
            this.highlights.push(tile);
            var tile = this.add.polygon(width*(xhex+tiles.map_size_x), height*(yhex+tiles.map_size_y), corners, 0x55ff55, 0.5);
            tile.depth=2;
            this.highlights.push(tile);
        }

        remove_highlight(){
            this.highlights.forEach(function(marker, i){
                marker.destroy();
            });
        }

    }



    function persecute(player_key){
        for(var x = 0; x < tiles.map_size_x; x++) {
            for(var y = 0; y < tiles.map_size_y; y++) {
                if(tiles[x][y].culture[player_key] > 0){
                    var red_culture = tiles[x][y].culture[player_key];
                    var n_others = 0;
                    for(var player in tiles[x][y].culture) {
                        if(player != player_key && tiles[x][y].culture[player] > 0){
                            n_others += 1;
                        }
                    }
                    for(var n=0;n<10 && red_culture > 0 && n_others > 0; n+=1){
                        var dc = red_culture/n_others;
                        var new_red_culture = red_culture;
                        n_others = 0;
                        for(var player in tiles[x][y].culture) {
                            if(player != player_key){
                                if(tiles[x][y].culture[player] >= dc){
                                    tiles[x][y].culture[player] -= dc;
                                    new_red_culture -= dc;
                                } else {
                                    new_red_culture -= tiles[x][y].culture[player];
                                    tiles[x][y].culture[player] = 0;
                                }
                                if(tiles[x][y].culture[player] > 0){
                                    n_others += 1;
                                }
                            }
                            red_culture = new_red_culture;
                        }
                    }
                    tiles[x][y].culture[player_key] = red_culture;
                }
            }
        }
    }


    function next_turn(map_scene){

        for(player in players){
            players[player].take_turn(tiles, cities, build_road, build_city, build_field);
        }

        // Update the cities
        for(city_key in cities){
            cities[city_key].update(map_scene);
        }

        var new_culture_array = [];
        for(var x = 0; x < tiles.map_size_x; x++) {
            new_culture_array[x] = [];
            for(var y = 0; y < tiles.map_size_y; y++) {
                new_culture_array[x][y] = {};

                // Calculate culture
                for(player in players){
                    var friction = 0.5;
                    var decay = 0.1;
                    let c = tiles[x][y].get_player_culture(player);

                    // sum of difference to neighbours
                    let dc = 0;
                    tiles[x][y].neighbours().forEach(function(tile){
                        let friction = 1;
                        if(tile.land == 'f'){
                            friction /=1.414;
                        }
                        if(tile.land == 'm'){
                            friction =0;
                        }
                        if(tile.land == 'w'){
                            friction /=1.414;
                        }
                        if(tile.road){
                            friction *=1.414;
                        }
                        dc += friction*(tile.get_player_culture(player)-c);
                    });

                    if(tiles[x][y].land == 'f'){
                        friction /=1.414;
                    }
                    if(tiles[x][y].land == 'm'){
                        friction =0;
                    }
                    if(tiles[x][y].land == 'w'){
                        friction /=1.414;
                    }
                    if(tiles[x][y].road){
                        friction *=1.414;
                    }

                    c += 0.1666*friction*dc;
                    c*= 1-decay;

                    if(tiles[x][y].city && tiles[x][y].owner == player){
                        c += tiles[x][y].city.culture();
                    }

                    if(c>=1){
                        new_culture_array[x][y][player] = c;
                    }
                }
            }
        }

        // Write new culture into the array
        for(var x = 0; x < tiles.map_size_x; x++) {
            for(var y = 0; y < tiles.map_size_y; y++) {
                tiles[x][y].culture = new_culture_array[x][y];
            }
        }

        persecute('red');

        for(var x = 0; x < tiles.map_size_x; x++) {
            for(var y = 0; y < tiles.map_size_y; y++) {
                tiles[x][y].decide_tile_owner();
            }
        }

        // Calculate the number of tiles owned per player
        // and the global sum of culture
        for(player in players){
            players[player].culture = 0;
            players[player].owned_tiles=0;
        }

        for(var x = 0; x < tiles.map_size_x; x++) {
            for(var y = 0; y < tiles.map_size_y; y++) {
                if(tiles[x][y].owner){
                    players[tiles[x][y].owner].owned_tiles += 1;
                }
                for(player in tiles[x][y].culture){
                    players[player].culture += tiles[x][y].culture[player];
                }
            }
        }

        turn_counter += 1;
        $("#turn_number_text").text('Year '+turn_counter);

        update_panel();
        update_city_page();

        // Check for win conditions
        if(turn_counter == 201) {
            var winner;
            var winner_culture = -1;
            for(player_key in players){
                if(players[player_key].culture > winner_culture){
                    winner = player_key;
                    winner_culture = players[player_key].culture;
                }
                announce_winner(winner);
            }

        }
        for(player_key in players){
            var player = players[player_key];
            if(player.owned_tiles > 0.5*tiles.map_size_x*tiles.map_size_y){
                announce_winner(player_key);
            }
        }
    }




    $( "#next_turn_button" ).click(function(e) {
        e.preventDefault();
        mapscene = phaser_game.scene.scenes[0];
        next_turn(mapscene);
        mapscene.draw_boundaries()
    });


    function show_tab(id) {
        $('#panel-tabs li a').removeClass("active");
        $(id+"-tab").addClass("active");
        $('.tab-pane').hide();
        $(id).show();
    }

    $('#panel-tabs a').click(function (e) {
        e.preventDefault();
        var id = $(this).attr('href');
        show_tab(id);
    })


    var active_tile;
    function tile_click(map_scene, tile) {
        var x = tile.x;
        var y = tile.y;

        // If building, try here and do nothing else
        if( map_scene.preview == 'road'){
            build_road('white', x, y);
            map_scene.preview = undefined;
            map_scene.remove_highlight();
            update_panel();
            return;
        }

        if( map_scene.preview == 'field'){
            build_field('white',x,y);
            map_scene.preview = undefined;
            map_scene.remove_highlight();
            update_panel();
            return;
        }

        if( map_scene.preview == 'city'){
            build_city('white', x, y);
            map_scene.preview = undefined;
            map_scene.remove_highlight();
            update_panel();
            return;
        }

        // Describe the selected tile
        active_tile = tiles[x][y];
        update_panel();

        // Now check for a city and update
        if(active_tile.city){
            active_city = active_tile.city;
            update_city_page();
            show_tab("#city");
        } else {
            show_tab("#home");
        }
    }

    var active_city;
    function update_city_page(){
        $("#city_card").empty();
        // Describe the tile
        var div = active_city.describe();
        $("#city_card").append(div);

        //var back_button = $("<span></span>").text("Back");
        //back_button.addClass("btn btn-primary");
        //back_button.click(function(){ show_tab("#home"); });
        //$("#city_card").append(back_button);
    }


    function update_panel(){
        player = players.white;

        if(active_tile){
            $("#tile_info").empty();
            var div = active_tile.describe();
            $("#tile_info").append(div);
        }

        $("#player_info").empty();
        var Title = $("<h4></h4>").html("Your empire:");
        $("#player_info").append(Title);

        var info = $("<p></p>").text("Culture: " + format_number(player.culture));
        $("#player_info").append(info);
        var info = $("<p></p>").text("Tiles controlled: " + player.owned_tiles +
                                     "/" + tiles.map_size_x*tiles.map_size_y);
        $("#player_info").append(info);


        var resource_title = $("<b></b>").html("</br>resources:");
        $("#player_info").append(resource_title);
        var resource_text = $("<p></p>").text("Wood: " + player.wood);
        $("#player_info").append(resource_text);
        var resource_text = $("<p></p>").text("colonies: " + player.colonies);
        $("#player_info").append(resource_text);

        var road_button = $("<div></div>").text("Road ("+items.road_price+" wood)");
        if(player.wood >= items.road_price){
            road_button.addClass("btn btn-success my-1");
            road_button.click(function(){ start_build_road(); });
        } else {
            road_button.addClass("btn btn-secondary my-1");
        }

        $("#player_info").append(road_button);

        var field_button = $("<div></div>").text("field ("+items.field_price+" wood)");
        if(player.wood >= items.field_price){
            field_button.addClass("btn btn-success my-1");
            field_button.click(function(){ start_build_field(); });
        } else {
            field_button.addClass("btn btn-secondary my-1");
        }

        $("#player_info").append(field_button);

        var colony_button = $("<div></div>").text("City (1 colony)");
        if(player.colonies >= 1){
            colony_button.addClass("btn btn-success my-1");
            colony_button.click(function(){ start_build_city(); });
        } else {
            colony_button.addClass("btn btn-secondary my-1");
        }
        $("#player_info").append(colony_button);

    }




    function start_build_road(){
        var mapscene = phaser_game.scene.scenes[0];
        mapscene.preview = 'road';
        mapscene.remove_highlight();
        for(var x = 0; x < tiles.map_size_x; x++) {
            for(var y = 0; y < tiles.map_size_y; y++) {
                if(tiles[x][y].owner == 'white' && tiles[x][y].is_road_allowed()){
                    mapscene.highlight_allowed_tile(x,y);
                }
            }
        }
    }

    function start_build_city(){
        var mapscene = phaser_game.scene.scenes[0];
        mapscene.preview = 'city';
        mapscene.remove_highlight();
        for(var x = 0; x < tiles.map_size_x; x++) {
            for(var y = 0; y < tiles.map_size_y; y++) {
                if(tiles[x][y].owner == 'white' && tiles[x][y].is_city_allowed()){
                    mapscene.highlight_allowed_tile(x,y);
                }
            }
        }
    }

    function start_build_field(){
        var mapscene = phaser_game.scene.scenes[0];
        mapscene.preview = 'field';
        mapscene.remove_highlight();
        for(var x = 0; x < tiles.map_size_x; x++) {
            for(var y = 0; y < tiles.map_size_y; y++) {
                if(tiles[x][y].owner == 'white' && tiles[x][y].is_field_allowed()){
                    mapscene.highlight_allowed_tile(x,y);
                }
            }
        }
    }

    function build_field(player_key,x,y){
        // check for neighbouring cities
        if(players[player_key].wood >= items.field_price){
            if(tiles[x][y].owner == player_key && tiles[x][y].is_field_allowed()){
                var mapscene = phaser_game.scene.scenes[0];
                mapscene.add_field(x,y);
                players[player_key].wood -= items.field_price;
            }
        }
    }

    function build_city(player_key,x,y){
        // check for neighbouring cities
        if(players[player_key].colonies > 0){
            if(tiles[x][y].owner == player_key && tiles[x][y].is_city_allowed()){
                var mapscene = phaser_game.scene.scenes[0];
                mapscene.add_city(x,y);
                players[player_key].colonies -= 1;
                if(player_key == "white"){
                    active_city = tiles[x][y].city;
                    update_city_page();
                }
            }
        }
    }

    // Build a road
    function build_road(player_key, x, y){
        if(players[player_key].wood >= items.road_price){
            if(tiles[x][y].owner == player_key && tiles[x][y].is_road_allowed()){
                var mapscene = phaser_game.scene.scenes[0];
                mapscene.add_road(x,y);
                players[player_key].wood -= items.road_price;
                tiles[x][y].road = true;
            }
        }
    }

    function announce_winner(key){
        console.log(key+" is the winner!");
        var winner = players[key];
        popup({
            title: winner.name + " Wins!",
            text: winner.name + " has conquered the known world!"
        });
    }


    var config = {
        type: Phaser.AUTO,
        parent: "Container",
        width: 650,
        height: 650,
        pixelArt: true,
        roundPixels: true,
        scene: [mapScene]
    };


    var phaser_game = new Phaser.Game(config);

    update_panel()

    function popup(content){
        if(content.title){
            $("#popup_title").text(content.title);
        }
        if(content.text){
            $("#popup_content").text(content.text);
        }
        if(content.next){
            $("#popup_next").show();
            $("#popup_next").click(function(e){
                e.preventDefault();
                popup(content.next);
            });
            // Prevent the mousedown event on the canvas
            $("#popup_next").mousedown(function(e){
                return false;
            });
        } else {
            $("#popup_next").hide();
        }
        $("#popup").show();
    }

    return {
        phaser_game: phaser_game,
        cities, cities,
        popup: popup,
        player: players['white'],
        get turn() { return turn_counter; },
    };

}

var game;



// Prevent the mousedown event on the canvas
$("#popup_dismiss").mousedown(function(e){
    return false;
});


// Click on random map
$("#random-map").click(function(e){
    console.log("random clicked");
    $("#main-menu").fadeOut();
    $('#random-menu').fadeIn();
});

// Start button click
$("#start").click(function(e){
    e.preventDefault();
    var size = 2*Math.floor($("#map_size").val());
    var water = Math.floor($("#water_percentage").val());
    var water_continuity = Math.floor($("#water_continuity").val());
    var forests = Math.floor($("#forest_percentage").val());
    var mountains = Math.floor($("#mountain_percentage").val());
    var island = $("#is_island").is(':checked');
    var players = ['white',]
    if( $("#blue").is(':checked') ){
      players.push('blue');
    }
    if( $("#green").is(':checked') ){
      players.push('green');
    }
    if( $("#red").is(':checked') ){
      players.push('red');
    }
    if( $("#violet").is(':checked') ){
      players.push('violet');
    }
    console.log(size, water, water_continuity, forests, mountains, island);
    console.log(players);
    game = gameboard(random_map(size, size, water, water_continuity, forests, mountains, island, players));
    $("#random-menu").hide();
    $('#scenario-div').fadeIn();
});

$("#random_back").click(function(e){
    $("#random-menu").hide();
    $("#main-menu").fadeIn();
});


// Click on tutorial maps
$("#tutorial-maps").click(function(e){
    $("#main-menu").fadeOut();
    $('#tutorial-menu').fadeIn();
});

// tutorial map click
$("#tutorial_1").click(function(e){
    e.preventDefault();
    game = gameboard(tutorial_1);
    $("#tutorial-menu").hide();
    $('#scenario-div').fadeIn();
});

$("#tutorial_2").click(function(e){
    e.preventDefault();
    game = gameboard(tutorial_2);
    $("#tutorial-menu").hide();
    $('#scenario-div').fadeIn();
});

$("#tutorial_3").click(function(e){
    e.preventDefault();
    game = gameboard(tutorial_3);
    $("#tutorial-menu").hide();
    $('#scenario-div').fadeIn();
});

$("#tutorial_4").click(function(e){
    e.preventDefault();
    game = gameboard(tutorial_4);
    $("#tutorial-menu").hide();
    $('#scenario-div').fadeIn();
});

$("#tutorial_5").click(function(e){
    e.preventDefault();
    game = gameboard(tutorial_5);
    $("#tutorial-menu").hide();
    $('#scenario-div').fadeIn();
});

$("#tutorial_back").click(function(e){
    $("#tutorial-menu").hide();
    $("#main-menu").fadeIn();
});

// Prevent the mousedown event on the canvas
$("#popup_dismiss").mousedown(function(e){
    return false;
});

// popup dismiss button
$("#popup_dismiss").click(function(e){
    e.preventDefault();
    $("#popup").hide();
    return false;
});

// Prevent the mousedown event on the canvas
$("#popup_dismiss").mousedown(function(e){
    return false;
});
