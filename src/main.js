
// Items buildable in the ciy screen
var city_items = {
  colony: {
      price: 24
  }
}

// items in the home panel
var home_items = {
    city: {
        name: 'city',
        button_text: '<u>c</u>ity', // Underline the 'c'
        quick_key: 'C',
        price: {colony: 1},
        spritesheet: 'city_tiles', // Only the preview, otherwise special case
        sprite: 1,
        can_build_at(tile){ // Checks if a road is allowed on a tile
            // check for neighbouring cities
            if( !(tile.is_empty()) ){
                return false;
            }
            var allowed = true;
            tile.neighbour_2_tiles().forEach(function(tile){
                if(tile.city != undefined ||
                   tile.building != undefined){
                     allowed = false;
                 }
            });
            return allowed;
        },
        on_build(tile){

        }
    },
    road: {
        name: 'road',
        button_text: '<u>r</u>oad', // Underline the 'f'
        quick_key: 'R',
        price: {wood: 5},
        spritesheet: 'roadtiles', // Only the preview, otherwise special case
        sprite: 0,
        can_build_at(tile){ // Checks if a road is allowed on a tile
            if( tile.city != undefined || tile.road != undefined){
                return false;
            }
            if( !( tile.land == 'g' || tile.land == 'f') ){
                return false;
            }
            var allowed = false;
            tile.neighbours().forEach(function(tile){
                if(tile.road != undefined ||
                   tile.city != undefined ){
                    return allowed = true;
                }
            });
            return allowed;
        },
        on_build(tile){
            tile.road = true;
        }
    },
    field: {
        name: 'field',
        button_text: '<u>f</u>ield', // Underline the 'f'
        quick_key: 'F',
        price: {wood: 10},
        spritesheet: 'allToenstiles',
        sprite: 48,
        can_build_at(tile){ // Checks if a field is allowed on a tile
            if( tile.city != undefined || tile.field ||
                tile.land != 'g' ){
                return false;
            }
            // Check that one of the neighbour tiles has a city
            var allowed = false;
            tile.neighbours().forEach(function(tile){
                if( tile.city != undefined ){
                    return allowed = true;
                }
            });
            return allowed;
        },
        on_build(tile){
            tile.field = true;
        }
    }
}





// Gameboard contains a lot and probably should be split
function gameboard(map){
    var turn_counter = 1;

    // Reset all players
    make_players();

    // Keep track of existing cities (should this be by player?)
    var cities = [];

    // Format a number for displaying
    function format_number(n){
      var r;
      if( n < 10 ){
        r=n.toFixed(2);
      } else {
        r=n.toFixed(0).toLocaleString();
      }
      return r;
    }


    // A list of all the tiles on the map
    var tiles = [];
    tiles.map_size_y = map.map.length;
    tiles.map_size_x = map.map[0].length;

    // The tile class contains all the information about a given tile and
    // functions for finding neighbours and a checking properties
    class Tile {
        // Construct empty tile with a given land type
        constructor(x, y, land) {
            this.x = x;
            this.y = y;
            this.owner = undefined;
            this.influence = {};
            this.land = land;

            // A list of dynamic sprites on this tile
            this.sprites = [];
        }

        // neighbour on the right
        xup(){
            var msx = tiles.map_size_x;
            return tiles[(this.x+1)%msx][this.y];
        }

        // neighbour on the left
        xdn(){
            var msx = tiles.map_size_x;
            return tiles[(this.x-1+msx)%msx][this.y];
        }

        // neighbour up and left
        yupleft(){
            var msx = tiles.map_size_x; var msy = tiles.map_size_y;
            if(this.y%2) {
                return tiles[this.x][(this.y+1)%msy];
            } else {
                return tiles[(this.x-1+msx)%msx][(this.y+1)%msy];
            }
        }

        // neighbour up and right
        yupright(){
            var msx = tiles.map_size_x; var msy = tiles.map_size_y;
            if(this.y%2) {
                return tiles[(this.x+1)%msx][(this.y+1)%msy];
            } else {
                return tiles[this.x][(this.y+1)%msy];
            }
        }

        // neighbour down and left
        ydnleft(){
            var msx = tiles.map_size_x; var msy = tiles.map_size_y;
            if(this.y%2) {
                return tiles[this.x][(this.y-1+msy)%msy];
            } else {
                return tiles[(this.x-1+msx)%msx][(this.y-1+msy)%msy];
            }
        }

        // neighbour down and right
        ydnright(){
            var msx = tiles.map_size_x; var msy = tiles.map_size_y;
            if(this.y%2) {
                return tiles[(this.x+1)%msx][(this.y-1+msy)%msy];
            } else {
                return tiles[this.x][(this.y-1+msy)%msy];
            }
        }

        // Returns a div element that contains a descricption of the tile
        describe(){
            var div = this.describe_short();
            div.append(this.describe_influence());
            return div;
        }

        // A short description. Tile coordinates and land type
        describe_short(){
            // Return a short description with
            var div = $("<div></div>");
            div.append("<div><b>Tile:</b> x="+this.x+", y="+this.y+"</div>");
            div.append("<div>"+map_descriptions[this.land]+"</div>");
            return div;
        }

        // Div containing the influence on this tile. The number for each player
        // is colored according to their player color.
        describe_influence(){
            // Show owner if there is one
            var div = $("<div></div>");
            var first = true;
            if(this.owner != undefined){
                var influence_p = $("<span></span>").text("Influence: ");
                var text = $("<span></span>").text(" "+format_number(this.influence[this.owner]))
                .css('color', players[this.owner].text_color);
                first = false
                influence_p.append(text);
            }
            for(var key in this.influence){
                if(first) {
                    var influence_p = $("<span></span>").text("Influence: ");
                }
                first = false;
                if(key != this.owner){
                    var text = $("<span></span>").text(" "+format_number(this.influence[key]))
                    .css('color', players[key].text_color);
                    influence_p.append(text);
                }
            }
            div.append(influence_p);
            return div;
        }

        // Checks if the tile is empty and something can be built there
        is_empty(){
            if(this.city == undefined && this.building == undefined &&
               this.field == undefined &&
               this.land != 'f' && this.land != 'w'){
                return true;
            } else {
                return false;
            }
        }

        // Checks if the tile produces food
        is_food_tile(){
            if(tiles[this.x][this.y].land == 'g'){
                return 1;
            }
            if(tiles[this.x][this.y].land == 'w'){
                return 1;
            }
            return 0;
        }

        // Checks if the tile produces wood
        is_wood_tile(){
            if(tiles[this.x][this.y].land == 'f'){
                return 1;
            }
            return 0;
        }


        // Returns a list of the neighbours of this tile
        neighbours(){
            return [
                this.xup(),
                this.yupright(),
                this.yupleft(),
                this.xdn(),
                this.ydnleft(),
                this.ydnright()
            ]
        }

        // Returns neighbours up to 2 tile away
        neighbour_2_tiles(){
            return [
                this.xup(),
                this.xup().xup(),
                this.xup().ydnright(),
                this.ydnright(),
                this.ydnright().ydnright(),
                this.ydnright().ydnleft(),
                this.ydnleft(),
                this.ydnleft().ydnleft(),
                this.ydnleft().xdn(),
                this.xdn(),
                this.xdn().xdn(),
                this.xdn().yupleft(),
                this.yupleft(),
                this.yupleft().yupleft(),
                this.yupleft().yupright(),
                this.yupright(),
                this.yupright().yupright(),
                this.yupright().xup(),
            ]
        }

        // Check which player controls this tile
        // This is run every update
        decide_tile_owner(){
            this.owner = undefined;
            var owner_influence = 0;
            for(var player_key in players){
                var player_influence = this.get_player_influence(player_key);
                if( player_influence == owner_influence ) {
                    // No-one wins ties
                    this.owner = undefined;
                } else if( player_influence > owner_influence ){
                    this.owner = player_key;
                    owner_influence = player_influence;
                }
            }
        }

        // Get the influence a player has on this tile.
        get_player_influence(player){
            if(this.influence[player]){
                return this.influence[player];
            }
            return 0;
        }

        // Return the amount influence is reduced when spreading to this tile
        influence_friction(){
            var friction = 1;
            if(this.land == 'f'){
                friction *= 2;
            }
            if(this.land == 'm'){
                // Essentially impossible to spread to mountains
                friction = 100000;
            }
            if(this.land == 'w'){
                friction *= 2;
            }
            if(this.road){
                friction /= 2;
            }
            if(this.city){
                // Cities are free
                friction = 0;
            }
            return friction;
        }
    } // End class Tile


    // Now build the array of tiles
    for(var x = 0; x < tiles.map_size_x; x++) {
        tiles[x] = [];
        for(var y = 0; y < tiles.map_size_y; y++) {
            tiles[x][y] = new Tile(x, y, map.map[y][x]);
        }
    }




    // The phaser scene. This draws and updates the game board
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
            this.key_down = false;
        }

        // Load sprites at start
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

        // Create the board
        create (){
            // Board size
            this.board_height = this.tile_height*tiles.map_size_x;
            this.board_width = this.tile_width*tiles.map_size_y;

            // Draw the map tiles
            this.draw_map();

            // Add towns at starting positions
            for(var player in map.start){
                var start = map.start[player];
                tiles[start.x][start.y].owner = player;
                this.add_city(start.x,start.y, 1, 0);
                if(player == 'white'){
                    // Center camera on the players town
                    this.center_camera_on(start.x,start.y);
                    active_city = tiles[start.x][start.y].city;
                    active_tile = tiles[start.x][start.y];
                    update_panel();
                }
            }

            // Get key and mouse
            this.cursors = this.input.keyboard.createCursorKeys();
            this.escape_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
            for(let item_key in home_items){
                var item = home_items[item_key];
                if(item.quick_key){
                    item.key_object = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[item.quick_key]);
                }
            }
            this.key_r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
            this.key_n = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
            this.key_c = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

            // remove camera bounds. We will make the board cyclical by adding some
            // padding and moving the camera when it reaches a border
            this.cameras.main.removeBounds();

            // Run any starting functions the map may define
            if(map.at_start){
                map.at_start();
            }

        }

        update(time, delta){
            // Keep track of previous clicks to avoid too fast repeats
            this.click_time += delta;

            // If any of the arrow keys is down, move the camera to that direction
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

            // Translate mouse location to tile xy coordinate
            var x = this.input.activePointer.x;
            var y = this.input.activePointer.y;
            // First check if the mouse is over the map
            if(x > 0 && x<650 && y>0 && y<650){
                // tile width and height in actual pixels
                var width  = this.tile_scale*this.tile_width;
                var height = this.tile_scale*this.tile_height;
                // Add camera position and divide by tile size
                x = (x+this.cameras.main.scrollX)/width;
                y = (y+this.cameras.main.scrollY)/height;
                // Now we have a cartesian tile index.
                // the hex y index is straightforward, take modulo of map size
                y = Math.floor( (y + 0.5 + tiles.map_size_y) % tiles.map_size_y);
                // Same for x, but for odd sites the row is shifted
                if(y%2==0){
                    x = Math.floor( (x + 0.5 + tiles.map_size_x) % tiles.map_size_x);
                } else {
                    x = Math.floor( (x + tiles.map_size_x) % tiles.map_size_x);
                }
                // Now we have coordinates x and y

                // If preview is active, put the appropriate tile there
                if(this.preview == 'city'){
                    // remove previous preview tile, if it exists
                    if(this.previous_preview){
                        this.destroy_sprite(this.previous_preview.x,this.previous_preview.y,this.previous_preview.z);
                    }
                    this.replace_tile_at(x, y, 5, 'citytiles', 1);
                    this.previous_preview = {x: x, y: y, z: 5};
                }
                if(this.preview == 'field'){
                    var item = home_items['field'];
                    if(this.previous_preview){
                        this.destroy_sprite(this.previous_preview.x,this.previous_preview.y,this.previous_preview.z);
                    }
                    this.replace_tile_at(x, y, 5, item.spritesheet, item.sprite);
                    this.previous_preview = {x: x, y: y, z: 5};
                }
                if(this.preview == 'road'){
                    if(this.previous_preview){
                        this.destroy_sprite(this.previous_preview.x,this.previous_preview.y,this.previous_preview.z);
                    }
                    this.replace_tile_at(x, y, 5, 'roadtiles', 0);
                    this.previous_preview = {x: x, y: y, z: 5};
                }

                // If there is an old preview, but the preview has been
                // turned of, remove it
                if(this.preview == undefined && this.previous_preview){
                    this.destroy_sprite(this.previous_preview.x,this.previous_preview.y,this.previous_preview.z);
                    this.previous_preview = undefined;
                }

                // Check for a mouse click. Time to avoid quick repeated clicks
                if(this.input.activePointer.isDown){
                    if(this.click_time > 500){
                        tile_click(this, tiles[x][y]);
                        this.click_time = 0;
                    }
                }
            } // End check for mouse over map

            // Remove higlight if escape is pressed
            if (this.escape_key.isDown) {
                this.remove_highlight();
                this.preview = undefined;
            }

            // Set item shortcuts
            for(let item_key in home_items){
                var item = home_items[item_key];
                if(item.key_object && item.key_object.isDown){
                    if(!this.key_down){
                        start_build(item_key);
                    }
                    this.key_down = true;
                }
            }

            // N for next turn
            if (this.key_n.isDown) {
              if(!this.key_down){
                next_turn(this);
              }
              this.key_down = true;
            }

            // If no key is down, make note. This avoids repeated clicks
            if (this.key_n.isUp ){
                var isdown = false;
                for(let item_key in home_items){
                    var item = home_items[item_key];
                    if(item.key_object && !item.key_object.isUp){
                        isdown = true;
                    }
                }
                this.key_down = isdown;
            }

            // Finally, if the map defines an on_update function, run it
            if(map.on_update){
                map.on_update();
            }
        }

        // Move the camera to a given tile coordinate
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

        // Draw the constant map sprites
        draw_map(){
            for(let x = 0; x < tiles.map_size_x; x++) {
                for(let y = 0; y < tiles.map_size_y; y++) {
                    // Get the sprite index
                    var key = tiles[x][y].land;
                    // Translate hex coordinate to location
                    var yhex = y;
                    var xhex = x;
                    if(y%2){
                        xhex += 0.5;
                    }
                    // Draw four copies, 2 per direction. This way makes it easy to display a
                    // periodic map
                    this.draw_tile(xhex,yhex,tiles[x][y],'hexground', key);
                    this.draw_tile(xhex+tiles.map_size_x,yhex,tiles[x][y],'hexground', key);
                    this.draw_tile(xhex,yhex+tiles.map_size_y,tiles[x][y],'hexground', key);
                    this.draw_tile(xhex+tiles.map_size_x,yhex+tiles.map_size_y,tiles[x][y],'hexground', key);
                }
            }
        }

        // Add the sprites for a single tile
        draw_tile(x,y,tile,sheet, key){
            // Create the sprite
            var sprite = this.add.sprite(
                this.tile_scale*this.tile_width*x,
                this.tile_scale*this.tile_height*y,
                sheet, map_sprites[key].map
            );
            sprite.setScale(this.tile_scale,this.tile_scale);
            sprite.depth=1;
            // If there is a decoration level sprite (above roads),
            // add it as well
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

        // Add a sprite on a tile
        draw_sprite(x,y,z,sheet, key, angle){
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

        // Remove sprites in a given layer and tile coordinate
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

        // Remove all sprites in a given layer in the tile sprite lists
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

        // Remove sprites in a given layer and coordinate
        remove_tiles_at(x,y,z){
            for(var i in tiles[x][y].sprites) {
                var sprite = tiles[x][y].sprites[i];
                if(sprite.depth == z){
                    sprite.destroy();
                    delete tiles[x][y].sprites[i];
                }
            }
        }

        // Add a sprite at given location and layer
        add_tile_at(x,y,z,sheet,key,angle=0){
            var yhex = y;
            var xhex = x;
            if(y%2){
                xhex += 0.5;
            }
            tiles[x][y].sprites.push(
                // add on each copy of the map
                this.draw_sprite(xhex, yhex, z, sheet, key, angle),
                this.draw_sprite(xhex + tiles.map_size_x, yhex, z, sheet, key, angle),
                this.draw_sprite(xhex, yhex+tiles.map_size_y, z, sheet, key, angle),
                this.draw_sprite(xhex + tiles.map_size_x, yhex+tiles.map_size_y, z, sheet, key, angle)
            )
        }

        // Replace tiles in given location and layer
        replace_tile_at(x,y,z,sheet,key,angle=0){
            this.remove_tiles_at(x,y,z);
            this.add_tile_at(x,y,z,sheet,key,angle);
        }


        // Add an item
        add_item(key, x, y){
            if(key == "road"){
                // unfortunately this roads are a special case.
                // We need to redraw neighbour tiles, not just this one
                this.add_road(x, y);
            } else if(key == "city") {
                // Cities are also a special case. Need to update roads
                this.add_city(x, y);
            } else {
                var item = home_items[key];
                this.replace_tile_at(x,y,3,item.spritesheet, item.sprite);
            }
            update_panel();
        }

        // Add a city at given coordinate
        add_city(x, y, level = 0, food = 0){
            // The next three lines should be in home_times,
            // but that would require moving cities outside the
            // map class. So do this later...

            // create the city
            var city = new City(tiles[x][y], level, food);
            // add it to the tile object
            tiles[x][y].city = city;
            // and the list of cities
            cities.push( city );

            // Redraw boundaries in case influence has changed
            this.draw_boundaries();
            // Update the sprite
            this.update_city_sprite(x, y, level);

            // Need to update road sprites as well
            var map = this;
            map.update_road_sprite(x, y);
            tiles[x][y].neighbours().forEach(function(tile){
                map.update_road_sprite(tile.x, tile.y);
            });
        }

        // Update the city sprite at given location
        update_city_sprite(x,y,level){
            if(level < 20){
                var key = Math.floor((level+1)/2);
                this.replace_tile_at(x,y,3,'citytiles', key);
            }
        }

        // Add a road
        add_road(x, y){
            // Update nieghbouring road sprites
            var map = this;
            map.update_road_sprite(x, y);
            tiles[x][y].neighbours().forEach(function(tile){
                map.update_road_sprite(tile.x, tile.y);
            });
        }

        // Update road sprite at location
        update_road_sprite(x, y){
            // First remove old sprites
            this.remove_tiles_at(x,y,2);
            // If there is a road, check neighbours
            if(tiles[x][y].road){
                var nbs = tiles[x][y].neighbours();
                for(var i in nbs){
                    var tile = nbs[i];
                    if(tile.road){
                        // The neighbour has a road. Connect by adding a
                        // sprite on this tile with appropriate angle
                        var angle = i*60;
                        this.add_tile_at(x, y, 2, 'roadtiles', 0, angle);
                    }
                }
            }
        }

        // Redraw boundaries around each players area
        draw_boundaries(){
            // Remove old boundaries
            this.boundary_markers.forEach(function(marker, i){
                marker.destroy();
            });

            // Check each tile and each possible neighbour
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

        // Surely these three functions could be combined...
        // Check borders to the x direction and draw boundaries if necessary
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

        // Check borders to the left y directions and draw boundaries if necessary
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

        // Check borders to the righ y directions and draw boundaries if necessary
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

        // Add a green highlight on a tile
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

        // Remove the green highlight
        remove_highlight(){
            this.highlights.forEach(function(marker, i){
                marker.destroy();
            });
        }

    }

    // Uses the influence of a player to reduce the influence of all other players
    // at all tiles
    function persecute(player_key){
        for(var x = 0; x < tiles.map_size_x; x++) {
            for(var y = 0; y < tiles.map_size_y; y++) {
                // This is a fully local operation so just run on each tile
                if(tiles[x][y].influence[player_key] > 0){
                    // The player has nonzero influence here
                    // Count other players
                    var red_influence = tiles[x][y].influence[player_key];
                    var n_others = 0;
                    for(var player in tiles[x][y].influence) {
                        if(player != player_key && tiles[x][y].influence[player] > 0){
                            n_others += 1;
                        }
                    }
                    // Now loop over a number of times, each time subtracting the
                    // minimum of the influence of other players until none are
                    // left or the player has no more influence
                    for(var n=0;n<10 && red_influence > 0 && n_others > 0; n+=1){
                        var dc = red_influence/n_others; // maximum we can subtract
                        var new_red_influence = red_influence; // keep subtracting also from this
                        n_others = 0; // count again for next iteration
                        for(var player in tiles[x][y].influence) {
                            if(player != player_key){
                                if(tiles[x][y].influence[player] >= dc){
                                    // other player has enough influence, subtract from both
                                    tiles[x][y].influence[player] -= dc;
                                    new_red_influence -= dc;
                                } else {
                                    // The other player will run out. Subtract the remaining amount
                                    new_red_influence -= tiles[x][y].influence[player];
                                    tiles[x][y].influence[player] = 0;
                                }
                                // Count those with influence left
                                if(tiles[x][y].influence[player] > 0){
                                    n_others += 1;
                                }
                            }
                            // Finally set the player influence in the end
                            red_influence = new_red_influence;
                        }
                    }
                    tiles[x][y].influence[player_key] = red_influence;
                }
            }
        }
    }


    // Update the game between turns
    function next_turn(map_scene){

        // AI players take their turns
        for(player in players){
            players[player].take_turn(tiles, cities, build);
        }

        // Spread influence
        // Influence is the maximum of neighbour tiles - friction,
        // where friction depends on the tile type
        var decay = 1; // no decay
        var new_influence_array = [];
        for(var x = 0; x < tiles.map_size_x; x++) {
            new_influence_array[x] = []
            for(var y = 0; y < tiles.map_size_y; y++) {
                new_influence_array[x][y] = {}
                for(player in players){
                    // Influence on this tile is usually the maximum of neighbours - friction
                    let c = 0; // max neighbour
                    tiles[x][y].neighbours().forEach(function(tile){
                        let x = tile.x; let y = tile.y;
                        let cnb = tiles[x][y].get_player_influence(player);
                        if(cnb > c){ // new max found
                          c = cnb;
                        }
                    });

                    // Subtract friction from the max found
                    c -= tiles[x][y].influence_friction();

                    if(tiles[x][y].city && tiles[x][y].owner == player){
                      // There is a city here. Check if it's culture dominates.
                      let city_c = tiles[x][y].city.influence();
                      if(city_c > c){
                        // The city dominates and sets the influence level.
                        c = city_c;
                      }
                    }
                    if(c > 0){
                      new_influence_array[x][y][player] = c;
                    }
                }
            }
        }

        // Write new influence into the array
        for(var x = 0; x < tiles.map_size_x; x++) {
          for(var y = 0; y < tiles.map_size_y; y++) {
            tiles[x][y].influence = new_influence_array[x][y];
          }
        }

        // Red influence does not mix with others. This will use up red
        // influence to reduce the others
        persecute('red');

        // Now decide the owners of each tile
        for(var x = 0; x < tiles.map_size_x; x++) {
            for(var y = 0; y < tiles.map_size_y; y++) {
                tiles[x][y].decide_tile_owner();
            }
        }

        // Update the cities
        for(city_key in cities){
            cities[city_key].update(map_scene);
        }


        // Calculate the number of tiles owned per player
        // and the global sum of influence
        for(player in players){
            players[player].influence = 0;
            players[player].owned_tiles=0;
        }

        for(var x = 0; x < tiles.map_size_x; x++) {
            for(var y = 0; y < tiles.map_size_y; y++) {
                if(tiles[x][y].owner){
                    players[tiles[x][y].owner].owned_tiles += 1;
                }
                for(player in tiles[x][y].influence){
                    players[player].influence += tiles[x][y].influence[player];
                }
            }
        }

        // Check for win conditions
        // On turn 200, the player with most influence wins
        if(turn_counter == 200) {
            var winner;
            var winner_influence = -1;
            for(player_key in players){
                if(players[player_key].influence > winner_influence){
                    winner = player_key;
                    winner_influence = players[player_key].influence;
                }
              }
              console.log(winner+" is the winner!");
              var winner = players[winner];
              popup({
                  title: winner.name + " wins!",
                  text: winner.name + " has won the game!"
              });

        }

        // If any player controls half the map, they win
        for(player_key in players){
            var player = players[player_key];
            if(player.owned_tiles > 0.5*tiles.map_size_x*tiles.map_size_y){
              console.log(player_key+" is the winner!");
              var winner = players[player_key];
              popup({
                  title: winner.name + " wins!",
                  text: winner.name + " has conguered (half) the world!"
              });
            }
        }

        // Increment the turn counter
        turn_counter += 1;

        // Update UI
        update_panel();
        map_scene.draw_boundaries();
    }



    //////////////////////////////////
    // The panel

    // The tile currently shown on the panel
    var active_tile;
    // The city currently shown on the panel
    var active_city;

    // Bind the next turn button to the next_turn function
    $( "#next_turn_button" ).unbind();
    $( "#next_turn_button" ).click(function(e) {
        e.preventDefault();
        mapscene = phaser_game.scene.scenes[0];
        next_turn(mapscene);
    });


    // switch to the given tab
    function show_tab(id) {
        $('#panel-tabs li a').removeClass("active");
        $(id+"-tab").addClass("active");
        $('.tab-pane').hide();
        $(id).show();
    }

    // Bind the tab buttons to the show_tab function
    $('#panel-tabs a').click(function (e) {
        e.preventDefault();
        var id = $(this).attr('href');
        show_tab(id);
    })


    // Handle a click in a tile. This will either build something
    // or display the tile in the panel
    function tile_click(map_scene, tile) {
        var x = tile.x;
        var y = tile.y;

        for(item_key in home_items){
            if( map_scene.preview == item_key){
                build(item_key,'white',x,y);
                map_scene.preview = undefined;
                map_scene.remove_highlight();
                update_home_page();
                return;
            }
        }

        // Did not build. Make the tile active and update the panel
        active_tile = tiles[x][y];

        // If there is a city, make it active and update the panel
        if(active_tile.city){
            active_city = active_tile.city;
            update_city_page();
            show_tab("#city");
        } else {
            // If there is not city, switch to the home panel
            show_tab("#home");
        }
        update_panel();
    }

    function update_city_page(){
        // Remove previous content
        $("#city_card").empty();
        // Add the div created by the city object
        var div = active_city.describe();
        $("#city_card").append(div);
    }

    // Update the home page of the panel
    function update_home_page(){
        // Set the human player (for future...)
        player = players.white;


        $("#turn_number_text").text('Year '+turn_counter);

        if(active_tile){
            $("#tile_info").empty();
            var div = active_tile.describe();
            $("#tile_info").append(div);
        }

        $("#player_info").empty();
        var Title = $("<h4></h4>").html("Your empire:");
        $("#player_info").append(Title);

        var info = $("<div></div>").text("Influence: " + format_number(player.influence));
        $("#player_info").append(info);
        var info = $("<div></div>").text("Tiles controlled: " + player.owned_tiles +
                                     "/" + tiles.map_size_x*tiles.map_size_y);
        $("#player_info").append(info);


        var resource_title = $("<b></b>").html("</br>Resources:");
        $("#player_info").append(resource_title);
        var resource_text = $("<div></div>").text("Wood: " + player.wood);
        $("#player_info").append(resource_text);
        var resource_text = $("<div></div>").text("colonies: " + player.colony);
        $("#player_info").append(resource_text);

        for(let item_key in home_items){
            var item = home_items[item_key];
            var text = item.button_text + " (";
            for(key in item.price){
                text += item.price[key] + " " + key;
            }
            text += ")";
            var button = $("<div></div>").html(text);
            var can_afford = true;
            for(key in item.price){
                if(players['white'][key] < item.price[key]){
                    can_afford = false;
                }
            }
            if(can_afford){
                button.addClass("btn btn-success my-1");
                button.click(function(){ start_build(item_key); });
            } else {
                button.addClass("btn btn-secondary my-1");
            }

            $("#player_info").append(button);
        }
    }

    // Update both city and home page
    function update_panel(){
        if(active_tile){
            update_home_page();
        }
        if(active_city){
            update_city_page();
        }
    }

    // Higlight allowed places for a field and start preview
    function start_build(item_key){
      var item = home_items[item_key];
      // Check the player is allowed to build
      var can_afford = true;
      for(key in item.price){
          if(players['white'][key] < item.price[key]){
              can_afford = false;
          }
      }
      if(can_afford){
        // Set the preview
        var mapscene = phaser_game.scene.scenes[0];
        mapscene.preview = item.name;
        // Highlight the allowed tiles
        mapscene.remove_highlight();
        for(var x = 0; x < tiles.map_size_x; x++) {
            for(var y = 0; y < tiles.map_size_y; y++) {
                if(tiles[x][y].owner == 'white' &&
                   item.can_build_at(tiles[x][y])){
                    mapscene.highlight_allowed_tile(x,y);
                }
            }
        }
      }
    }

    // Player builds a field at given location. This is also the interface the AI uses
    function build(item_key, player_key,x,y){
        // check that we can afford
        var item = home_items[item_key];
        var can_afford = true;
        for(key in item.price){
            if(players[player_key][key] < item.price[key]){
                can_afford = false;
            }
        }
        if(can_afford){
            // Is allowed
            if(tiles[x][y].owner == player_key &&
               item.can_build_at(tiles[x][y])){
                // OK, add the field on the map and subtract the price
                var mapscene = phaser_game.scene.scenes[0];
                // add it to the tile object
                item.on_build(tiles[x][y]);
                // and the map
                mapscene.add_item(item_key, x, y);
                for(key in item.price){
                    players[player_key][key] -= item.price[key];
                }
            }
        }
    }

    // Show a popup with text and title given by content
    function popup(content){
        // Set the title
        if(content.title){
            $("#popup_title").text(content.title);
        }
        // Set the text
        if(content.text){
            $("#popup_content").text(content.text);
        }
        // If there is another popup, add a next button with the content
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

    // Remove the game and any related elements
    function destroy(){
      console.log("destroy");
      phaser_game.destroy();
      $("#game_container").empty();
      $("#game_container").html("<div class='pl-0' id='Container'></div>");
    }


    // Create the phaser game object. Builds the map
    var phaser_game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: "Container",
        width: 650,
        height: 650,
        pixelArt: true,
        roundPixels: true,
        scene: [mapScene]
    });

    // Build and return the interface
    return {
        phaser_game: phaser_game,
        update_panel: update_panel,
        update_city_page: update_city_page,
        update_home_page: update_home_page,
        war: true,
        cities, cities,
        destroy: destroy,
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
    $("#main-menu").fadeOut();
    $('#random-menu').fadeIn();
});

// Start button click
$("#start").click(function(e){
    if(game){
      game.destroy();
    }
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
    if(game){
      game.destroy();
    }
    game = gameboard(tutorial_1);
    $("#tutorial-menu").hide();
    $('#scenario-div').fadeIn();
});

$("#tutorial_2").click(function(e){
    e.preventDefault();
    if(game){
      game.destroy();
    }
    game = gameboard(tutorial_2);
    $("#tutorial-menu").hide();
    $('#scenario-div').fadeIn();
});

$("#tutorial_3").click(function(e){
    e.preventDefault();
    if(game){
      game.destroy();
    }
    game = gameboard(tutorial_3);
    $("#tutorial-menu").hide();
    $('#scenario-div').fadeIn();
});

$("#tutorial_4").click(function(e){
    e.preventDefault();
    if(game){
      game.destroy();
    }
    game = gameboard(tutorial_4);
    $("#tutorial-menu").hide();
    $('#scenario-div').fadeIn();
});

$("#tutorial_5").click(function(e){
    e.preventDefault();
    if(game){
      game.destroy();
    }
    game = gameboard(tutorial_5);
    $("#tutorial-menu").hide();
    $('#scenario-div').fadeIn();
});

$("#tutorial_back").click(function(e){
    $("#tutorial-menu").hide();
    $("#main-menu").fadeIn();
});

// Credits click
$("#Credits").click(function(e){
    $("#main-menu").fadeOut();
    $('#credits-page').fadeIn();
});

$("#credits-back").click(function(e){
    $("#credits-page").hide();
    $("#main-menu").fadeIn();
});

$("#main_menu_button").click(function(e){
    $("#scenario-div").hide();
    $("#popup").hide();
    $("#main-menu").fadeIn();
    $("#continue").fadeIn();
});

$("#continue").click(function(e){
    $("#main-menu").hide();
    $("#scenario-div").fadeIn();
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
