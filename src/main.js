
// Define the map. This should be moved to json files.
var map_sprites = {
    'w': {'map': 24*7},
    'g': {'map': 1},
    'f': {'map': 1, 'sprite': 6}
}

var map_descriptions = {
    'w': 'water',
    'g': 'field',
    'f': 'forest'
}

var city_sprites = [7,8,9,14,15,15,15,15,15]
var building_cite_sprite = 5*7+3

var road_sprites = [2,71,77,70,71,71,72,66,77,84,77,63,86,65,64,78]

var map_1 = [
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','g','g','g','g','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','g','f','g','g','g','g','w','w','w','w','w','w','w','w','w'],
    ['w','g','g','g','f','g','g','g','w','w','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','f','g','w','w','w','w','w','w','w','w','w'],
    ['w','g','f','g','g','g','g','w','w','w','w','w','w','w','w','w','w'],
    ['w','g','f','g','f','g','g','w','w','w','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','g','w','w','w','w','w','w','w','w','w','w'],
    ['w','g','f','g','g','f','g','g','w','w','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','g','g','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w']
]


var map_size_y = map_1.length;
var map_size_x = map_1[0].length;

var tiles;
var layer;
var city_layer;

var turn_counter = 1;


// Create arrays indexed by x and y for each property of a tile
var tile_array = [];


//Players
var players = {
    'green': green_player,
    'blue': blue_player,
    'red': red_player,
}



function neighbour_tiles(x,y){
    var msx = map_size_x; var msy = map_size_y;
    return [[(x+1)%msx,y],[x,(y+1)%msy],
            [(x-1+msx)%msx,y],[x,(y-1+msy)%msy]
           ]
}

function neighbour_square_tiles(x,y){
    var msx = map_size_x; var msy = map_size_y;
     return [[x,y],
             [(x+1)%msx,y],[x,(y+1)%msy],
             [(x-1+msx)%msx,y],[x,(y-1+msy)%msy],
             [(x+1)%msx,(y+1)%msy],[(x-1+msx)%msx,(y+1)%msy],
             [(x+1)%msx,(y-1+msy)%msy],[(x-1+msx)%msx,(y-1+msy)%msy]
            ]
}

function neighbour_2_tiles(x,y){
    var msx = map_size_x; var msy = map_size_y;
    return [[(x+1)%msx,y],[x,(y+1)%msy],
            [(x-1+msx)%msx,y],[x,(y-1+msy)%msy],
            [(x+1)%msx,(y+1)%msy],[(x-1+msx)%msx,(y+1)%msy],
            [(x+1)%msx,(y-1+msy)%msy],[(x-1+msx)%msx,(y-1+msy)%msy],
            [(x+2)%msx,y],[x,(y+2)%msy],
            [(x-2+msx)%msx,y],[x,(y-2+msy)%msy]
         ]
}

function for_tiles(tiles,f){
    var sum = 0;
    for(i in tiles){
        sum += f(tiles[i][0], tiles[i][1]);
    }
    return sum;
}

function sum_tiles(tiles,f){
    var sum = 0;
    for(i in tiles){
        sum += f(tiles[i][0], tiles[i][1]);
    }
    return sum;
}

function max_tiles(tiles,f){
    var max = -1000;
    for(i in tiles){
        var m = f(tiles[i][0], tiles[i][1]);
        if(m>max){
            max = m;
        }
    }
    return max;
}



function is_city_allowed(x,y){
    // check for neighbouring cities
    if( !(tile_array[x][y].is_empty()) ){
        return false;
    }
    var allowed = true;
    for_tiles(neighbour_2_tiles(x,y),function(x,y){
        if(tile_array[x][y].city != undefined ||
           tile_array[x][y].building != undefined){
            allowed = false;
        }
    });
    return allowed;
}

function can_build_road(x,y){
    if( tile_array[x][y].city != undefined || tile_array[x][y].road != undefined){
        return false;
    }
    if( !( tile_array[x][y].land == 'g' || tile_array[x][y].land == 'f') ){
        return false;
    }
    var allowed = false;
    for_tiles(neighbour_tiles(x,y),function(x,y){
        if(tile_array[x][y].road != undefined ||
           tile_array[x][y].city != undefined ){
            return allowed = true;
        }
    });
    return allowed;
}


function tile_food_production(x,y){
    if(tile_array[x][y].land == 'g'){
        return 1;
    }
    if(tile_array[x][y].land == 'w'){
        return 1;
    }
    return 0;
}

function tile_wood_production(x,y){
    if(tile_array[x][y].land == 'f'){
        return 1;
    }
    return 0;
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
        tile_array[x][y].culture[this.owner()] = this.culture();
        tile_array[x][y].road = true;
    }

    // Calculate the culture production of the city
    culture(){
        return 50*this.level;
    }

    owner(){
        return tile_array[this.x][this.y].owner;
    }

    // The amount of food produced per turn
    food_production(){
        var city = this;
        var food = 0;
        for_tiles(neighbour_square_tiles(this.x,this.y), function(x,y){
            if(tile_array[x][y].owner == city.owner()){
                food += tile_food_production(x,y);
            }
        });
        return food;
    }

    // The amount of wood produced per turn
    wood_production(){
        var city = this;
        var wood = 0;
        for_tiles(neighbour_square_tiles(this.x,this.y), function(x,y){
            if(tile_array[x][y].owner == city.owner()){
                wood += tile_wood_production(x,y);
            }
        });
        return wood;
    }

    // The amount of food consumed each turn
    // Food is consumed after it is gathered
    food_consumption() {
        return 3*this.level-2;
    }

    // city grows when the city has this much food
    food_limit() {
        //return Math.pow(2,this.level-1);
        return 20*this.level*this.level;
    }

    // Update the city
    update(map_scene){
        var x = this.x;
        var y = this.y;

        // Gather food
        var food = this.food_production();

        // Consume
        this.food -= this.food_consumption();

        // Check buildings
        if(this.building != undefined){
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
        players[this.owner()].wood += this.wood_production();
    }


    // Describe the city in html
    describe(){
        var html = "<div>";
        html += "<h4>"+this.name+"</h4>";
        html += "<p>Level: "+this.level+"</p>";
        html += "<p>Food: "+this.food+"</p>";
        html += "</div>";
        return html;
    }

    // Start building a new city
    build_city(x, y){
        // check for neighbouring cities
        if(this.building == undefined && is_city_allowed(x,y) && tile_array[x][y].owner == this.owner()){
            var mapscene = game.scene.scenes[0];
            mapscene.add_building_sprite(x, y);
            tile_array[x][y].building = 'city';
            this.building = {'food': 10, 'type': 'city', 'x': x, 'y': y};
        }
    }

    building_done(){
        if(this.building.type == 'city'){
            var mapscene = game.scene.scenes[0];
            mapscene.add_city(this.building.x,this.building.y,this.owner());
        }
        this.building = undefined;
    }
}

// Keep track of existing cities
var cities = [];


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
}


// Create arrays indexed by x and y for each property of a tile
for (var x = 0; x < map_size_x; x++) {
    tile_array[x] = [];
    for (var y = 0; y < map_size_y; y++) {
        tile_array[x][y] = new Tile(x, y, map_1[y][x]);
    }
}





class mapScene extends Phaser.Scene {
    constructor() {
        super('mapScene');
        this.map;
        this.tiles;
        this.layer;
        this.city_layer;

        this.boundary_markers = [];
    }

    preload (){
        this.load.image('tiles', "assets/Toens_Medieval_Strategy_Sprite_Pack/tileset.png");
    }

    create (){
        //this.cameras.main.setBounds( -100, -100, 2400, 2400);
        //this.cameras.main.setBackgroundColor("#ffffff");

        // create board
        this.map = this.make.tilemap({ tileWidth: 16, tileHeight: 16, width: 2*map_size_x, height: 2*map_size_y});
        var tiles = this.map.addTilesetImage('tiles');
        this.ground_layer = this.map.createBlankDynamicLayer('ground', tiles);
        this.ground_layer.setScale(3);
        this.ground_layer.setInteractive();
        this.ground_layer.on('pointerdown',()=>{tile_click(this);} );

        this.road_layer = this.map.createBlankDynamicLayer("roads", tiles);
        this.road_layer.setScale(1); // Roads are drawn on a smaller scale, looks nicer

        this.city_layer = this.map.createBlankDynamicLayer("cities", tiles);
        this.city_layer.setScale(3);

        this.draw_map();
    
        // Add at towns
        tile_array[2][2].owner = 'blue';
        this.add_city(2,2);
        tile_array[6][7].owner = 'green';
        this.add_city(6,7);
        tile_array[1][9].owner = 'red';
        this.add_city(1,9);
    
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cameras.main.removeBounds();
    }
    
    update (time, delta){
        if (this.cursors.left.isDown)
        {
            var x = this.cameras.main.scrollX;
            var mx = map_size_x*16*3;
            x = (x-0.5*delta+mx)%mx;
            this.cameras.main.scrollX = x; 
        }
        else if (this.cursors.right.isDown)
        {
            var x = this.cameras.main.scrollX;
            var mx = map_size_x*16*3;
            x = (x+0.5*delta+mx)%mx;
            this.cameras.main.scrollX = x; 
        }
        else if (this.cursors.up.isDown)
        {
            var y = this.cameras.main.scrollY;
            var my = map_size_y*16*3;
            y = (y-0.5*delta+my)%my;
            this.cameras.main.scrollY = y; 
        }
        else if (this.cursors.down.isDown)
        {
            var y = this.cameras.main.scrollY;
            var my = map_size_y*16*3;
            y = (y+0.5*delta+my)%my;
            this.cameras.main.scrollY = y; 
        }
    }

    draw_map(x, y){
        for (var x = 0; x < map_size_x; x++) {
            for (var y = 0; y < map_size_y; y++) {
                var key = tile_array[x][y].land;
                this.put_tile_at(this.ground_layer, map_sprites[key].map, x, y);
                if(map_sprites[key].sprite) {
                    this.put_tile_at(this.city_layer, map_sprites[key].sprite, x, y);
                }
            }
        }
    }

    put_tile_at(layer,tile,x,y,scale=1){
        layer.putTileAt(tile, x, y);
        layer.putTileAt(tile, x+scale*map_size_x, y);
        layer.putTileAt(tile, x, y+scale*map_size_y);
        layer.putTileAt(tile, x+scale*map_size_x, y+scale*map_size_y);
    }

    add_city(x, y){
        var city = new City(x, y, 1);
        tile_array[x][y].city = city;
        cities.push( city );
        this.draw_boundaries();
        this.update_city_sprite(x, y, 1);

        var map = this;
        map.update_road_sprite(x, y);
        for_tiles(neighbour_tiles(x,y), function(x,y){
            map.update_road_sprite(x, y);
        });
    }

    update_city_sprite(x,y,level){
        var city_sprite = city_sprites[level-1];
        this.put_tile_at(this.city_layer, city_sprite, x, y);
    }

    add_building_sprite(x,y){
        this.put_tile_at(this.city_layer, building_cite_sprite, x, y);
    }

    add_road(x, y){
        tile_array[x][y].road = true;
        var map = this;
        map.update_road_sprite(x, y);
        for_tiles(neighbour_tiles(x,y), function(x,y){
            map.update_road_sprite(x, y);
        });
    }
    
    update_road_sprite(x, y){
        if(tile_array[x][y].road){
            // a binary representation of the possibilities, some are repeated.
            var crossing = 0;
            var type = 0;
            if(tile_array[(x+1)%map_size_x][y].road){
                crossing += 1;
                type += 1;
                this.put_tile_at(this.road_layer, road_sprites[1], 3*x+2, 3*y+1, 3); // Middle tile, with intersections
            }
            if(tile_array[x][(y+1)%map_size_y].road){
                crossing += 1;
                type += 2;
                this.put_tile_at(this.road_layer, road_sprites[2], 3*x+1, 3*y+2, 3); // Middle tile, with intersections
            }
            if(tile_array[(x-1+map_size_x)%map_size_x][y].road){
                crossing += 1;
                type += 4;
                this.put_tile_at(this.road_layer, road_sprites[4], 3*x, 3*y+1, 3); // Middle tile, with intersections
            }
            if(tile_array[x][(y-1+map_size_y)%map_size_y].road){
                crossing += 1;
                type += 8;
                this.put_tile_at(this.road_layer, road_sprites[8], 3*x+1, 3*y, 3); // Middle tile, with intersections
            }
            console.log(x,y,crossing);
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

        for (var x = 0; x < map_size_x; x++) {
            for (var y = 0; y < map_size_y; y++) {
                var msx = map_size_x; var msy = map_size_y;
                var xp = (x+1)%msx; var yp = (y+1)%msy;
                var xm = (x-1+msx)%msx; var ym = (y-1+msy)%msy;
                this.check_and_draw_border(x,y,xp,y,x+1,y+1,x+1,y);
                this.check_and_draw_border(x,y,xm,y,x,y+1,x,y);
                this.check_and_draw_border(x,y,x,yp,x+1,y+1,x,y+1);
                this.check_and_draw_border(x,y,x,ym,x+1,y,x,y);
            }
        }
    }

    check_and_draw_border(x,y,xnb,ynb,xf,yf,xt,yt){
        var width =  3*this.map.tileWidth;
        var height = 3*this.map.tileHeight;
        if( tile_array[x][y].owner != undefined &&
            tile_array[x][y].owner != tile_array[xnb][ynb].owner )
        {
            var player = players[tile_array[x][y].owner];
            var color = Phaser.Display.Color.HexStringToColor(player.color);
            var marker = this.add.graphics({ 
                lineStyle: { width: 5, color: color.color, alpha: 0.4 }
            });
            marker.beginPath();
            marker.moveTo(xf*width, yf*height);
            marker.lineTo(xt*width, yt*height);
            marker.moveTo((xf+map_size_x)*width, yf*height);
            marker.lineTo((xt+map_size_x)*width, yt*height);
            marker.moveTo(xf*width, (yf+map_size_y)*height);
            marker.lineTo(xt*width, (yt+map_size_y)*height);
            marker.moveTo((xf+map_size_x)*width, (yf+map_size_y)*height);
            marker.lineTo((xt+map_size_x)*width, (yt+map_size_y)*height);
            marker.strokePath();
            this.boundary_markers.push(marker);
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

var game = new Phaser.Game(config);



$( "#next_turn_button" ).click(function() {
    mapscene = game.scene.scenes[0];
    next_turn(mapscene);
    mapscene.draw_boundaries()
});


function tile_click(map_scene) {
    var worldPoint = map_scene.input.activePointer.positionToCamera(map_scene.cameras.main);
    var x = map_scene.map.worldToTileX(worldPoint.x) % map_size_x;
    var y = map_scene.map.worldToTileY(worldPoint.y) % map_size_y;
    var tile = tile_array[x][y];

    $("#info-page").empty();

    // Show city if there is one
    if(tile.city){
        var div = tile.city.describe()
        $("#info-page").append(div);
    } else {
        if(tile.harvested_by != undefined){
            var p = $("<p></p>").text("Harvested by ");
            var text = $("<span></span>").text(cities[tile.harvested_by].name);
            p.append(text);
            $("#info-page").append(p);
        }
    }

    // Describe the tile
    $("#info-page").append("<p><b>Tile:</b> x="+x+", y="+y+"</p>");
    $("#info-page").append("<p>"+map_descriptions[tile.land]+"</p>");

    // If there is an owner, show owner and culture
    if(tile.owner != undefined){
        var p = $("<p></p>").text("owner: ");
        var text = $("<span></span>").text(tile.owner).css('color', players[tile.owner].color);
        p.append(text);
        $("#info-page").append(p);
        var p = $("<p></p>").text("Culture: ");
        var text = $("<span></span>").text(" "+tile.culture[tile.owner].toFixed(2))
        .css('color', players[tile.owner].color);
        p.append(text);
        for(var key in tile.culture){
            if(key != tile.owner){
                var text = $("<span></span>").text(" "+tile.culture[key].toFixed(2))
                .css('color', players[key].color);
                p.append(text);
            }
        }
    }
    $("#info-page").append(p);


    console.log(tile_array[x][y]);
}


function next_turn(map_scene){
    
    // Update the cities
    for(city_key in cities){
        cities[city_key].update(map_scene);
    }

    var new_culture_array = [];
    for (var x = 0; x < map_size_x; x++) {
        new_culture_array[x] = [];
        for (var y = 0; y < map_size_y; y++) {
            new_culture_array[x][y] = {};

            // Calculate culture
            for(player in players){
                let c = 0;
                let dc = 0;
                for_tiles(neighbour_tiles(x,y), function(x,y){
                    dc += get_player_culture(player,x,y);
                });

                c = 0.125*dc;

                if(tile_array[x][y].land == 'f'){
                    c *= 0.5;
                }
                if(tile_array[x][y].road){
                    c *= 2;
                }

                // Add the culture production of city if there is one
                if(tile_array[x][y].city && tile_array[x][y].owner == player){
                    c += tile_array[x][y].city.culture();
                }
                
                if(c>=1){
                    new_culture_array[x][y][player] = c;
                }
            }
        }
    }

    // Write new culture into the array
    for (var x = 0; x < map_size_x; x++) {
        for (var y = 0; y < map_size_y; y++) {
            tile_array[x][y].culture = new_culture_array[x][y];
        }
    }
    for (var x = 0; x < map_size_x; x++) {
        for (var y = 0; y < map_size_y; y++) {
            tile_array[x][y].owner = decide_tile_owner(x,y);
        }
    }

    turn_counter += 1;
    $("#turn_number_text").text('Year '+turn_counter);

    console.log(players);

    for(player in players){
        players[player].take_turn();
    }
}



function get_player_culture(player, x, y){
    if(tile_array[x][y].culture[player]){
        return tile_array[x][y].culture[player];
    }
    return 0;
}

function decide_tile_owner(x,y){
    var new_owner = undefined;
    var owner_culture = 0;
    for(player_key in players){
        var player_culture = get_player_culture(player_key,x,y);
        if( player_culture == owner_culture ) {
            // No-one wins ties
            new_owner = undefined;
        } else if( player_culture > owner_culture ){
            new_owner = player_key;
            owner_culture = player_culture;
        }
    }
    return new_owner;
}



// Build a road
function build_road(player, x, y){
    if(player.wood >= 5){
        if(can_build_road(x,y)){
            var mapscene = game.scene.scenes[0];
            mapscene.add_road(x,y);
            player.wood -= 5;
            tile_array[x][y].road = true;
        }
    }
}




