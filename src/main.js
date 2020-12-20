

function gameboard(map){

    var turn_counter = 1;

    //Players
    var players = {
        'white': {
            human: true,
            text_color: '#FFFFFF',
            map_color: '#FFFFFF',
            wood: 0,
            colonies: 0,
            take_turn(){}
        },
        'green': green_player,
        'blue': blue_player,
        'red': red_player
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
            if(this.owner != undefined){
                var p = $("<p></p>").text("owner: ");
                var text = $("<span></span>").text(this.owner).css('color', players[this.owner].text_color);
                p.append(text);
            }
            div.append(p);
            div.append("<p>"+map_descriptions[this.land]+"</p>");
            return div;
        }
        
        describe_culture(){
            // Show owner if there is one
            var div = $("<div></div>");
            var culture_p = $("<p></p>").text("Culture: ");
            var first = true;
            if(this.owner != undefined){
                var text = $("<span></span>").text(" "+this.culture[this.owner].toFixed(2))
                .css('color', players[this.owner].text_color);
                first = false
                culture_p.append(text);
            }
            for(var key in this.culture){
                if(key != this.owner){
                    var text = $("<span></span>").text(" "+this.culture[key].toFixed(2))
                    .css('color', players[key].text_color);
                    culture_p.append(text);
                }
            }
            div.append(culture_p);
            return div;
        }

        is_empty(){
            if(this.city == undefined && this.building == undefined &&
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
            var msx = tiles.map_size_x; var msy = tiles.map_size_y;
            return [tiles[(this.x+1)%msx][this.y],
                    tiles[this.x][(this.y+1)%msy],
                    tiles[(this.x-1+msx)%msx][this.y],
                    tiles[this.x][(this.y-1+msy)%msy]
                   ]
        }

        neighbour_square_tiles(){
            var msx = tiles.map_size_x; var msy = tiles.map_size_y;
            return [tiles[(this.x+1)%msx][this.y],
                    tiles[(this.x+1)%msx][(this.y+1)%msy],
                    tiles[this.x][(this.y+1)%msy],
                    tiles[(this.x-1+msx)%msx][(this.y+1)%msy],
                    tiles[(this.x-1+msx)%msx][this.y],
                    tiles[(this.x-1+msx)%msx][(this.y-1+msy)%msy],
                    tiles[this.x][(this.y-1+msy)%msy],
                    tiles[(this.x+1)%msx][(this.y-1+msy)%msy]
                    ]
        }

        neighbour_2_tiles(){
            var msx = tiles.map_size_x; var msy = tiles.map_size_y;
            var r = [];
            for( var dx = -2; dx < 3; dx++){
                for( var dy = -2; dy < 3; dy++){
                    var x = (this.x+dx+msx)%msx;
                    var y = (this.y+dy+msy)%msy;
                    r.push(tiles[x][y]);
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
        constructor(x, y, level) {
            this.number = cities.length;
            this.x = x;
            this.y = y;
            this.tile = tiles[x][y];
            this.level = level;
            this.food = 0;
            this.name = "Aztola";
            this.workers_food=level;
            this.workers_wood=0;
            tiles[x][y].culture[this.owner()] = this.culture();
            tiles[x][y].road = true;
        }

        // Calculate the culture production of the city
        culture(){
            return 16*this.level*this.level;
        }

        owner(){
            return tiles[this.x][this.y].owner;
        }

        free_workers() {
            return this.level - this.workers_wood  - this.workers_food;
        }

        set_food_workers(n){
            console.log("food workers setting to ",n);
            var max = this.level - this.workers_wood;
            if(n >= 0 && n <= max){
                this.workers_food = n;
            }
            console.log(max,this.workers_food);
        }

        set_wood_workers(n){
            var max = this.level - this.workers_food;
            if(n >= 0 && n <= max){
                this.workers_wood = n;
            }
        }

        food_tiles(){
            var city = this;
            var food_tiles = 0; // City always produces 1 food
            tiles[this.x][this.y].neighbour_square_tiles()
            .forEach(function(tile){
                if(tile.owner == city.owner()){
                    food_tiles += tile.is_food_tile();
                }
            });
            return food_tiles;
        }

        wood_tiles(){
            var city = this;
            var wood_tiles = 0; // City always produces 1 wood
            tiles[this.x][this.y].neighbour_square_tiles()
            .forEach(function(tile){
                if(tile.owner == city.owner()){
                    wood_tiles += tile.is_wood_tile();
                }
            });
            return wood_tiles;
        }

        fields(){
            var city = this;
            var fields = 0; // City always produces 1 food
            tiles[this.x][this.y].neighbour_square_tiles()
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
            // 1 extra for fields
            food += Math.min(workers, fields);
            console.log(food_tiles,fields,workers,food);
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
            if(food > 0 && this.building != undefined){
                var workers = this.free_workers();
                this.building.food -= Math.min(0,workers);
                var food_diff = Math.min(food,this.building.food);
                this.building.food -= food_diff;
                food -= food_diff;
                if(this.building.food <= 0 ) {
                    this.building_done();
                }
            }

            this.food += food;

            // Check if the city grows
            if(this.food > this.food_limit()){
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
                this.food = 0;
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
                div.append($("<p></p>").html("<b>Food</b>: "+this.food));
                div.append($("<p></p>").html("<b>Free workers</b>: "+this.free_workers()));
                if(this.building){
                    div.append($("<p></p>").text("Building a "+this.building.type
                     + "("+this.building.food+")"));
                }

                if(this.food_tiles() > 0){
                    var max = Math.min(this.food_tiles(), this.level);
                    var food_slider_div = $("<div></div>").text("Food workers: ");
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
                    food_slider_div.append(" "+this.workers_food+"/"+max);
                    div.append(food_slider_div);
                }

                if(this.wood_tiles() > 0){
                    var max = Math.min(this.wood_tiles(), this.level);
                    var wood_slider_div = $("<div></div>").text("Wood workers: ");
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
                    wood_slider_div.append(" "+this.workers_wood+"/"+max);
                    div.append(wood_slider_div);
                }

                // Add colony button
                var colony_button = $("<span></span>").text("Establish colony (turns)");
                colony_button.addClass("btn btn-success");
                colony_button.click(function(){
                    active_city.queue_colony();
                    update_city_page();
                });
                div.append(colony_button);
            }

            return div;
        }

        // Start building a colony
        queue_colony(){
            if(this.building==undefined){
                this.building = {'food': 12, 'type': 'colony'};
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
        }

        preload (){
            this.load.image('tileset', "assets/Toens_Medieval_Strategy_Sprite_Pack/tileset.png");
            this.load.image('citytiles', "assets/Toens_Medieval_Strategy_Sprite_Pack/cities.png");
        }

        create (){
            // create board
            this.map = this.make.tilemap({ tileWidth: 16, tileHeight: 16, width: 6*tiles.map_size_x, height: 6*tiles.map_size_y});
            var tileset = this.map.addTilesetImage('tileset');
        
            // Base ground layer. Set it interactive to capture clicks on the map
            this.ground_layer = this.map.createBlankDynamicLayer('ground', tileset);
            this.ground_layer.setScale(3);
            this.ground_layer.setInteractive();
            this.ground_layer.on('pointerdown',()=>{tile_click(this);} );

            // Separate layer for shore tiles
            this.shore_layer = this.map.createBlankDynamicLayer("shore", tileset);
            this.shore_layer.setScale(1);

            // and for road tiles
            this.road_layer = this.map.createBlankDynamicLayer("roads", tileset);
            this.road_layer.setScale(1); // Roads are drawn on a smaller scale, looks nicer

            // Second ground layer, for mountains, forests and such. Roads go below these
            // if allowed
            this.ground_2 = this.map.createBlankDynamicLayer("ground_2", tileset);
            this.ground_2.setScale(3); 

            this.preview_layer = this.map.createBlankDynamicLayer("preview", tileset);
            this.preview_layer.setScale(3); // Roads are drawn on a smaller scale, looks nicer
            this.preview_layer.setAlpha(0.5); // Roads are drawn on a smaller scale, looks nicer


            // Cities on a separate map
            this.city_map = this.make.tilemap({ tileWidth: 32, tileHeight: 32, width: 2*tiles.map_size_x, height: 2*tiles.map_size_y});
            var citytiles = this.city_map.addTilesetImage('citytiles');
            this.city_layer = this.city_map.createBlankDynamicLayer("cities", citytiles);
            this.city_layer.setScale(1.5);

            this.city_preview_layer = this.city_map.createBlankDynamicLayer("city_preview", citytiles);
            this.city_preview_layer.setScale(1.5); // Roads are drawn on a smaller scale, looks nicer
            this.city_preview_layer.setAlpha(0.5); // Roads are drawn on a smaller scale, looks nicer


            this.draw_map();
        
            // Add at towns
            for(player in map.start){
                var start = map.start[player];
                tiles[start.x][start.y].owner = player;
                this.add_city(start.x,start.y, 1);
                if(player == 'white'){
                    this.center_camera_on(start.x,start.y);
                    active_city = tiles[start.x][start.y].city;
                    update_city_page();
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
            if (this.cursors.left.isDown)
            {
                var x = this.cameras.main.scrollX;
                var mx = tiles.map_size_x*16*3;
                x = (x-0.5*delta+mx)%mx;
                this.cameras.main.scrollX = x; 
            }
            else if (this.cursors.right.isDown)
            {
                var x = this.cameras.main.scrollX;
                var mx = tiles.map_size_x*16*3;
                x = (x+0.5*delta+mx)%mx;
                this.cameras.main.scrollX = x; 
            }
            else if (this.cursors.up.isDown)
            {
                var y = this.cameras.main.scrollY;
                var my = tiles.map_size_y*16*3;
                y = (y-0.5*delta+my)%my;
                this.cameras.main.scrollY = y; 
            }
            else if (this.cursors.down.isDown)
            {
                var y = this.cameras.main.scrollY;
                var my = tiles.map_size_y*16*3;
                y = (y+0.5*delta+my)%my;
                this.cameras.main.scrollY = y; 
            }

            // preview
            var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
            var x = this.map.worldToTileX(worldPoint.x) % tiles.map_size_x;
            var y = this.map.worldToTileY(worldPoint.y) % tiles.map_size_y;

            if(this.preview == 'city'){
                if(this.previous_preview != undefined){
                    this.remove_tile_at(this.city_preview_layer,this.previous_preview.x, this.previous_preview.y);
                    this.remove_tile_at(this.preview_layer,this.previous_preview.x, this.previous_preview.y);
                }
                this.put_tile_at(this.city_preview_layer, 1, x, y);
                this.previous_preview = {x:x, y:y};
            }

            if(this.preview == 'road'){
                if(this.previous_preview != undefined){
                    this.remove_tile_at(this.city_preview_layer,this.previous_preview.x, this.previous_preview.y);
                    this.remove_tile_at(this.preview_layer,this.previous_preview.x, this.previous_preview.y);
                }
                this.put_tile_at(this.preview_layer, road_sprites[1], x, y);
                this.previous_preview = {x:x, y:y};
            }

            if(this.preview == undefined && this.previous_preview){
                this.remove_tile_at(this.city_preview_layer,this.previous_preview.x, this.previous_preview.y);
                this.remove_tile_at(this.preview_layer,this.previous_preview.x, this.previous_preview.y);
                this.previous_preview = undefined;
            }

            if (this.escape_key.isDown)
            {
                this.remove_highlight();
                this.preview = undefined;
            }

            if(map.on_update){
                map.on_update();
            }
        }

        center_camera_on(x,y){
            this.cameras.main.scrollX = 16*3*((x-6.25+(tiles.map_size_x+1))%(tiles.map_size_x+1));
            this.cameras.main.scrollY = 16*3*((y-6.25+(tiles.map_size_y+1))%(tiles.map_size_y+1));
        }

        draw_map(){
            for(var x = 0; x < tiles.map_size_x; x++) {
                for(var y = 0; y < tiles.map_size_y; y++) {
                    var key = tiles[x][y].land;
                    this.put_tile_at(this.ground_layer, map_sprites[key].map, x, y);
                    if(map_sprites[key].sprite) {
                        this.put_tile_at(this.ground_2, map_sprites[key].sprite, x, y);
                    }
                    if(key=='w'){
                        this.draw_shore(x,y);
                    }
                }
            }
        }

        put_tile_at(layer,tile,x,y,scale=1){
            layer.putTileAt(tile, x, y);
            layer.putTileAt(tile, x+scale*tiles.map_size_x, y);
            layer.putTileAt(tile, x, y+scale*tiles.map_size_y);
            layer.putTileAt(tile, x+scale*tiles.map_size_x, y+scale*tiles.map_size_y);
        }

        remove_tile_at(layer,x,y,scale=1){
            layer.removeTileAt(x, y);
            layer.removeTileAt(x+scale*tiles.map_size_x, y);
            layer.removeTileAt(x, y+scale*tiles.map_size_y);
            layer.removeTileAt(x+scale*tiles.map_size_x, y+scale*tiles.map_size_y);
        }

        add_city(x, y, level = 0){
            var city = new City(x, y, level);
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
                var sprite = Math.floor((level+1)/2);
                this.put_tile_at(this.city_layer, sprite, x, y);
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

        draw_shore(x,y){
            // Check if a shore tile is required
            if(tiles[(x+1)%tiles.map_size_x][y].land!='w'){
                this.put_tile_at(this.shore_layer, shore_straight[0], 3*x+2, 3*y+1, 3);
                if(tiles[x][(y+1)%tiles.map_size_y].land!='w'){
                    this.put_tile_at(this.shore_layer, shore_turn_in[0], 3*x+2, 3*y+2, 3);
                } else {
                    this.put_tile_at(this.shore_layer, shore_straight[0], 3*x+2, 3*y+2, 3);
                }
                if(tiles[x][(y-1+tiles.map_size_y)%tiles.map_size_y].land!='w'){
                    this.put_tile_at(this.shore_layer, shore_turn_in[3], 3*x+2, 3*y, 3);
                } else {
                    this.put_tile_at(this.shore_layer, shore_straight[0], 3*x+2, 3*y, 3);
                }
            }
            if(tiles[(x-1+tiles.map_size_x)%tiles.map_size_x][y].land!='w'){
                this.put_tile_at(this.shore_layer, shore_straight[2], 3*x, 3*y+1, 3);
                if(tiles[x][(y+1)%tiles.map_size_y].land!='w'){
                    this.put_tile_at(this.shore_layer, shore_turn_in[1], 3*x, 3*y+2, 3);
                } else {
                    this.put_tile_at(this.shore_layer, shore_straight[2], 3*x, 3*y+2, 3);
                }
                if(tiles[x][(y-1+tiles.map_size_y)%tiles.map_size_y].land!='w'){
                    this.put_tile_at(this.shore_layer, shore_turn_in[2], 3*x, 3*y, 3);
                } else {
                    this.put_tile_at(this.shore_layer, shore_straight[2], 3*x, 3*y, 3);
                }
            }
            if(tiles[x][(y+1)%tiles.map_size_y].land!='w'){
                this.put_tile_at(this.shore_layer, shore_straight[1], 3*x+1, 3*y+2, 3);
                if(tiles[(x-1+tiles.map_size_x)%tiles.map_size_x][y].land=='w'){
                    this.put_tile_at(this.shore_layer, shore_straight[1], 3*x, 3*y+2, 3);
                }
                if(tiles[(x+1)%tiles.map_size_x][y].land=='w'){
                    this.put_tile_at(this.shore_layer, shore_straight[1], 3*x+2, 3*y+2, 3);
                }
            }
            if(tiles[x][(y-1+tiles.map_size_y)%tiles.map_size_y].land!='w'){
                this.put_tile_at(this.shore_layer, shore_straight[3], 3*x+1, 3*y, 3);
                if(tiles[(x-1+tiles.map_size_x)%tiles.map_size_x][y].land=='w'){
                    this.put_tile_at(this.shore_layer, shore_straight[3], 3*x, 3*y, 3);
                }
                if(tiles[(x+1)%tiles.map_size_x][y].land=='w'){
                    this.put_tile_at(this.shore_layer, shore_straight[3], 3*x+2, 3*y, 3);
                }
            }
            if(tiles[(x+1)%tiles.map_size_x][y].land=='w'){
                if(tiles[x][(y+1)%tiles.map_size_y].land=='w' && 
                   tiles[(x+1)%tiles.map_size_x][(y+1)%tiles.map_size_y].land != 'w'){
                    this.put_tile_at(this.shore_layer, shore_turn_out[0], 3*x+2, 3*y+2, 3);
                }
                if(tiles[x][(y-1+tiles.map_size_y)%tiles.map_size_y].land=='w' && 
                   tiles[(x+1)%tiles.map_size_x][(y-1+tiles.map_size_y)%tiles.map_size_y].land != 'w'){
                    this.put_tile_at(this.shore_layer, shore_turn_out[3], 3*x+2, 3*y, 3);
                }
            }
            if(tiles[(x-1+tiles.map_size_x)%tiles.map_size_x][y].land=='w'){
                if(tiles[x][(y+1)%tiles.map_size_y].land=='w' && 
                   tiles[(x-1+tiles.map_size_x)%tiles.map_size_x][(y+1)%tiles.map_size_y].land != 'w'){
                    this.put_tile_at(this.shore_layer, shore_turn_out[1], 3*x, 3*y+2, 3);
                }
                if(tiles[x][(y-1+tiles.map_size_y)%tiles.map_size_y].land=='w' && 
                   tiles[(x-1+tiles.map_size_x)%tiles.map_size_x][(y-1+tiles.map_size_y)%tiles.map_size_y].land != 'w'){
                    this.put_tile_at(this.shore_layer, shore_turn_out[2], 3*x, 3*y, 3);
                }
            }
        }

        update_road_sprite(x, y){
            if(tiles[x][y].road){
                // a binary representation of the possibilities, some are repeated.
                var crossing = 0;
                var type = 0;
                if(tiles[(x+1)%tiles.map_size_x][y].road){
                    crossing += 1;
                    type += 1;
                    this.put_tile_at(this.road_layer, road_sprites[1], 3*x+2, 3*y+1, 3); // Middle tile, with intersections
                }
                if(tiles[x][(y+1)%tiles.map_size_y].road){
                    crossing += 1;
                    type += 2;
                    this.put_tile_at(this.road_layer, road_sprites[2], 3*x+1, 3*y+2, 3); // Middle tile, with intersections
                }
                if(tiles[(x-1+tiles.map_size_x)%tiles.map_size_x][y].road){
                    crossing += 1;
                    type += 4;
                    this.put_tile_at(this.road_layer, road_sprites[4], 3*x, 3*y+1, 3); // Middle tile, with intersections
                }
                if(tiles[x][(y-1+tiles.map_size_y)%tiles.map_size_y].road){
                    crossing += 1;
                    type += 8;
                    this.put_tile_at(this.road_layer, road_sprites[8], 3*x+1, 3*y, 3); // Middle tile, with intersections
                }
                if( crossing > 1 ){
                    this.put_tile_at(this.road_layer, road_sprites[type], 3*x+1, 3*y+1, 3); // Middle tile, with intersections
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
                    var msx = tiles.map_size_x; var msy = tiles.map_size_y;
                    var xp = (x+1)%msx; var yp = (y+1)%msy;
                    var xm = (x-1+msx)%msx; var ym = (y-1+msy)%msy;
                    this.check_and_draw_border(x,y,xp,y,x+0.98,y+1,x+0.98,y);
                    this.check_and_draw_border(x,y,xm,y,x+0.02,y+1,x+0.072,y);
                    this.check_and_draw_border(x,y,x,yp,x+1,y+0.98,x,y+0.98);
                    this.check_and_draw_border(x,y,x,ym,x+1,y+0.02,x,y+0.02);
                }
            }
        }

        check_and_draw_border(x,y,xnb,ynb,xf,yf,xt,yt){
            var width =  3*this.map.tileWidth;
            var height = 3*this.map.tileHeight;
            if( tiles[x][y].owner != undefined &&
                tiles[x][y].owner != tiles[xnb][ynb].owner )
            {
                var player = players[tiles[x][y].owner];
                var color = Phaser.Display.Color.HexStringToColor(player.map_color);
                var marker = this.add.graphics({ 
                    lineStyle: { width: 5, color: color.color, alpha: 0.4 }
                });
                marker.beginPath();
                marker.moveTo(xf*width, yf*height);
                marker.lineTo(xt*width, yt*height);
                marker.moveTo((xf+tiles.map_size_x)*width, yf*height);
                marker.lineTo((xt+tiles.map_size_x)*width, yt*height);
                marker.moveTo(xf*width, (yf+tiles.map_size_y)*height);
                marker.lineTo(xt*width, (yt+tiles.map_size_y)*height);
                marker.moveTo((xf+tiles.map_size_x)*width, (yf+tiles.map_size_y)*height);
                marker.lineTo((xt+tiles.map_size_x)*width, (yt+tiles.map_size_y)*height);
                marker.strokePath();
                this.boundary_markers.push(marker);
            }
        }

        highlight_allowed_square(x,y){
            var square = this.add.graphics()
            square.fillStyle(0x55ff55, 0.5);
            square.fillRect(16*3*x, 16*3*y, 16*3, 16*3);
            square.fillRect(16*3*(x+tiles.map_size_x), 16*3*y, 16*3, 16*3);
            square.fillRect(16*3*x, 16*3*(y+tiles.map_size_y), 16*3, 16*3);
            square.fillRect(16*3*(x+tiles.map_size_x), 16*3*(y+tiles.map_size_y), 16*3, 16*3);
            this.highlights.push(square);
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
            players[player].take_turn(tiles, cities, build_road, build_city);
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

                    c += 0.25*friction*dc;
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

        turn_counter += 1;
        $("#turn_number_text").text('Year '+turn_counter);

        update_panel();
        update_city_page();
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
    function tile_click(map_scene) {
        var worldPoint = map_scene.input.activePointer.positionToCamera(map_scene.cameras.main);
        var x = map_scene.map.worldToTileX(worldPoint.x) % tiles.map_size_x;
        var y = map_scene.map.worldToTileY(worldPoint.y) % tiles.map_size_y;

        // If building, try here and do nothing else
        if( map_scene.preview == 'road'){
            build_road(players.white, x, y);
            map_scene.preview = undefined;
            map_scene.remove_highlight();
            update_panel();
            return;
        }

        if( map_scene.preview == 'city'){
            build_city(x,y,'white');
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
            console.log()
            active_city = active_tile.city;
            update_city_page();
            show_tab("#city");
        } else {
            show_tab("#home");
        }
    }
    
    function build_city(x,y,player_key){
        // check for neighbouring cities
        if(tiles[x][y].is_city_allowed() && tiles[x][y].owner == player_key){
            var mapscene = phaser_game.scene.scenes[0];
            mapscene.add_city(x,y);
            players[player_key].colonies -= 1;
            if(player_key == "white"){
                active_city = tiles[x][y].city;
                update_city_page();
            }
        }
    }

    var active_city;
    function update_city_page(){
        $("#city").empty();
        // Describe the tile
        var div = active_city.describe();
        $("#city").append(div);

        //var back_button = $("<span></span>").text("Back");
        //back_button.addClass("btn btn-primary");
        //back_button.click(function(){ show_tab("#home"); });
        //$("#city").append(back_button);
    }


    function update_panel(){
        player = players.white;
        $("#home").empty();

        if(active_tile){
            var div = active_tile.describe();
            console.log(div);
            $("#home").append(div);
        }

        var resource_text = $("<p></p>").text("Wood: " + player.wood);
        $("#home").append(resource_text);
        var resource_text = $("<p></p>").text("colonies: " + player.colonies);
        $("#home").append(resource_text);

        var road_button = $("<span></span>").text("Road (10 wood)");
        if(player.wood >= 10){
            road_button.addClass("btn btn-success");
            road_button.click(function(){ start_build_road(); });
        } else {
            road_button.addClass("btn btn-secondary");
        }

        $("#home").append(road_button);

        var colony_button = $("<span></span>").text("City (1 colony)");
        if(player.colonies >= 1){
            colony_button.addClass("btn btn-success");
            colony_button.click(function(){ start_build_city(); });
        } else {
            colony_button.addClass("btn btn-secondary");
        }
        $("#home").append(colony_button);

    }




    function start_build_road(){
        var mapscene = phaser_game.scene.scenes[0];
        mapscene.preview = 'road';
        mapscene.remove_highlight();
        for(var x = 0; x < tiles.map_size_x; x++) {
            for(var y = 0; y < tiles.map_size_y; y++) {
                if(tiles[x][y].owner == 'white' && tiles[x][y].is_road_allowed()){
                    mapscene.highlight_allowed_square(x,y);
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
                    mapscene.highlight_allowed_square(x,y);
                }
            }
        }
    }

    // Build a road
    function build_road(player, x, y){
        if(player.wood >= 10){
            if(players[tiles[x][y].owner] == player && tiles[x][y].is_road_allowed()){
                var mapscene = phaser_game.scene.scenes[0];
                mapscene.add_road(x,y);
                player.wood -= 10;
                tiles[x][y].road = true;
            }
        }
    }


    var config = {
        type: Phaser.AUTO,
        parent: "Container",
        width: 600,
        height: 600,
        pixelArt: true,
        roundPixels: true,
        scene: [mapScene]
    };
        
        
    var phaser_game = new Phaser.Game(config);

    update_panel()

    function popup(content){
        console.log(content);
        if(content.title){
            $("#popup_title").text(content.title);
        }
        if(content.text){
            $("#popup_content").text(content.text);
        }
        if(content.next){
            $("#popup_next").show();
            console.log(content.next);
            $("#popup_next").click(function(e){
                e.preventDefault();
                popup(content.next);
            });
        } else {
            $("#popup_next").hide();
        }
        $("#popup").show();
    }


    return {
        phaser_game: phaser_game,
        cities, cities,
        turn: turn_counter,
        popup: popup,
        player: players['white']
    };

}

var game;


$("#start").click(function(e){
    e.preventDefault();
    game = gameboard(random_map(32,32,5,40,5,10,false,['white','blue','green','red']));
    $("#main-menu").hide();
    $('#scenario-div').fadeIn();    
});

$("#tutorial").click(function(e){
    e.preventDefault();
    game = gameboard(tutorial_1);
    $("#main-menu").hide();
    $('#scenario-div').fadeIn();
});

$("#popup_dismiss").click(function(e){
    e.preventDefault();
    $("#popup").hide();
});


