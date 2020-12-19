

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

        is_empty(){
            if(this.city == undefined && this.building == undefined &&
               this.land != 'f' && this.land != 'w'){
                return true;
            } else {
                return false;
            }
        }

        food_production(){
            if(tiles[this.x][this.y].land == 'g'){
                return 1;
            }
            if(tiles[this.x][this.y].land == 'w'){
                return 1;
            }
            return 0;
        }
    
        wood_production(){
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
            var r = [];
            for( var dx = -1; dx < 2; dx++){
                for( var dy = -1; dy < 2; dy++){
                    var x = (this.x+dx+msx)%msx;
                    var y = (this.y+dy+msy)%msy;
                    r.push(tiles[x][y]);
                }
            }
            return r;
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
            this.x = x;
            this.y = y;
            this.number = cities.length;
            this.level = level;
            this.food = 0;
            this.name = "Aztola";
            tiles[x][y].culture[this.owner()] = this.culture();
            tiles[x][y].road = true;
        }

        // Calculate the culture production of the city
        culture(){
            return 8*this.level*this.level;
        }

        owner(){
            return tiles[this.x][this.y].owner;
        }

        // The amount of food produced per turn
        food_production(){
            var city = this;
            var food = 0;
            tiles[this.x][this.y].neighbour_square_tiles()
            .forEach(function(tile){
                if(tile.owner == city.owner()){
                    food += tile.food_production(tile.x,tile.y);
                }
            });
            return food;
        }

        // The amount of wood produced per turn
        wood_production(){
            var city = this;
            var wood = 0;
            tiles[this.x][this.y].neighbour_square_tiles()
            .forEach(function(tile){
                if(tile.owner == city.owner()){
                    wood += tile.wood_production(tile.x,tile.y);
                }
            });
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
            //return Math.pow(10,this.level);
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
                var done = true;
                if(this.building.food > food){
                    this.building.food -= food;
                    food = 0;
                    done = false;
                } else {
                    food -= this.building.food;
                }
                if(done){
                    this.building_done();
                }
            }

            this.food += food;

            // Check if the city grows
            if(this.food > this.food_limit()){
                this.food -= this.food_limit();
                this.level += 1;
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
            var html = "<div>";
            html += "<h4>"+this.name+"</h4>";
            html += "<p>Level: "+this.level+"</p>";
            html += "<p>Food: "+this.food+"</p>";
            if(this.building){ 
                html += "<p>Building a "+this.building.type+"</p>";
            }
            html += "</div>";
            return html;
        }

        // Start building a colony
        queue_colony(){
            if(this.building==undefined){
                this.building = {'food': 40, 'type': 'colony'};
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
                this.add_city(start.x,start.y);
                if(player == 'white'){
                    this.center_camera_on(start.x,start.y);
                }
            }
        
            this.cursors = this.input.keyboard.createCursorKeys();
            this.escape_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
            this.cameras.main.removeBounds();
        }

        update (time, delta){
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
                    this.remove_tile_at(this.preview_layer,this.previous_preview.x, this.previous_preview.y);
                }
                this.put_tile_at(this.preview_layer, city_sprites[0], x, y);
                this.previous_preview = {x:x, y:y};
            }

            if(this.preview == 'road'){
                if(this.previous_preview != undefined){
                    this.remove_tile_at(this.preview_layer,this.previous_preview.x, this.previous_preview.y);
                }
                this.put_tile_at(this.preview_layer, road_sprites[1], x, y);
                this.previous_preview = {x:x, y:y};
            }

            if(this.preview == undefined && this.previous_preview){
                this.remove_tile_at(this.preview_layer,this.previous_preview.x, this.previous_preview.y);
                this.previous_preview = undefined;
            }

            if (this.escape_key.isDown)
            {
                this.remove_highlight();
                this.preview = undefined;
            }

        }

        center_camera_on(x,y){
            this.cameras.main.scrollX = 16*3*((x-6.25+tiles.map_size_x)%tiles.map_size_x);
            this.cameras.main.scrollY = 16*3*((y-6.25+tiles.map_size_x)%tiles.map_size_y);
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

        add_city(x, y){
            var city = new City(x, y, 1);
            tiles[x][y].city = city;
            cities.push( city );
            this.draw_boundaries();
            this.update_city_sprite(x, y, 1);

            var map = this;
            map.update_road_sprite(x, y);
            tiles[x][y].neighbours().forEach(function(tile){
                map.update_road_sprite(tile.x, tile.y);
            });
        }

        update_city_sprite(x,y,level){
            this.put_tile_at(this.city_layer, level-1, x, y);
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
    }










    $( "#next_turn_button" ).click(function() {
        mapscene = phaser_game.scene.scenes[0];
        next_turn(mapscene);
        mapscene.draw_boundaries()
    });



    var panel_location = {x:undefined,y:undefined};
    function tile_click(map_scene) {
        var worldPoint = map_scene.input.activePointer.positionToCamera(map_scene.cameras.main);
        var x = map_scene.map.worldToTileX(worldPoint.x) % tiles.map_size_x;
        var y = map_scene.map.worldToTileY(worldPoint.y) % tiles.map_size_y;

        // If building
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
        
        panel_location.x = x;
        panel_location.y = y;
        update_panel();
    }
    
    function build_city(x,y,player_key){
        // check for neighbouring cities
        if(tiles[x][y].is_city_allowed() && tiles[x][y].owner == player_key){
            var mapscene = phaser_game.scene.scenes[0];
            mapscene.add_city(x,y,player_key);
            players[player_key].colonies -= 1;
        }
    }

    function update_panel(){
        if( panel_location.x != undefined){
            var x = panel_location.x;
            var y = panel_location.y;
            var tile = tiles[x][y];
            $("#info-page").empty();

            // Show city if there is one
            if(tile.city){
                var div = tile.city.describe()
                $("#info-page").append(div);

                var mapscene = phaser_game.scene.scenes[0];
                mapscene.view_city = tile.city;
            }

            // Describe the tile
            $("#info-page").append("<p><b>Tile:</b> x="+x+", y="+y+"</p>");
            $("#info-page").append("<p>"+map_descriptions[tile.land]+"</p>");

            // Show owner if there is one
            if(tile.owner != undefined){
                var p = $("<p></p>").text("owner: ");
                var text = $("<span></span>").text(tile.owner).css('color', players[tile.owner].text_color);
                p.append(text);
                $("#info-page").append(p);
                var p = $("<p></p>").text("Culture: ");
                var text = $("<span></span>").text(" "+tile.culture[tile.owner].toFixed(2))
                .css('color', players[tile.owner].text_color);
                p.append(text);
                for(var key in tile.culture){
                    if(key != tile.owner){
                        var text = $("<span></span>").text(" "+tile.culture[key].toFixed(2))
                        .css('color', players[key].text_color);
                        p.append(text);
                    }
                }
                $("#info-page").append(p);
            } else {
                var p = $("<p></p>")
                var first = true;
                for(var key in tile.culture){
                    if(first){
                        p.text("culture: ");
                        first = false;
                    }
                    if(key != tile.owner){
                        var text = $("<span></span>").text(" "+tile.culture[key].toFixed(2))
                        .css('color', players[key].text_color);
                        p.append(text);
                    }
                }
                $("#info-page").append(p);
            }

            // Add colony button
            if(tile.city){
                if(tile.owner == 'white'){
                    var city_button = $("<span></span>").text("Establish colony (turns)");
                    city_button.addClass("btn btn-success");
                    city_button.click(function(){
                         tile.city.queue_colony();
                         update_panel();
                     });
                    $("#info-page").append(city_button);
                }
            }
        }

        player = players.white;
        $("#interaction-page").empty();

        var resource_text = $("<p></p>").text("Wood: " + player.wood);
        $("#interaction-page").append(resource_text);
        var resource_text = $("<p></p>").text("colonies: " + player.colonies);
        $("#interaction-page").append(resource_text);

        var road_button = $("<span></span>").text("Road (10 wood)");
        if(player.wood >= 10){
            road_button.addClass("btn btn-success");
            road_button.click(function(){ start_build_road(); });
        } else {
            road_button.addClass("btn btn-secondary");
        }

        $("#interaction-page").append(road_button);

        var colony_button = $("<span></span>").text("City (1 colony)");
        if(player.colonies >= 1){
            colony_button.addClass("btn btn-success");
            colony_button.click(function(){ start_build_city(); });
        } else {
            colony_button.addClass("btn btn-secondary");
        }
        $("#interaction-page").append(colony_button);

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


    return {
        phaser_game: phaser_game
    };

}

var game = gameboard(random_map(32,32,5,40,5,10,false,['white','blue','green','red']));
//var game = gameboard(map_1);
