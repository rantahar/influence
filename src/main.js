
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
var road_sprites = [10*7+1]
var building_cite_sprite = 5*7+3

var map_1 = [
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','g','g','g','g','g','g','g','g','g','w','w','w','w','w','w','w'],
    ['w','w','g','g','g','g','g','g','g','g','g','w','w','w','w','w','w','w','w'],
    ['w','g','g','f','f','f','g','g','g','w','w','w','w','w','w','w','w','w','w'],
    ['w','g','g','f','f','f','f','g','g','w','g','g','w','w','w','w','w','w','w'],
    ['w','g','g','f','f','f','g','w','w','w','g','g','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','g','w','g','g','g','g','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','g','w','g','g','g','g','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','g','g','g','g','g','g','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','g','g','g','g','g','g','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','g','g','g','g','g','g','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','g','g','g','g','g','g','w','w','w','w','w','w','w'],
    ['w','g','g','g','w','w','w','g','g','g','g','g','w','w','w','w','w','w','w'],
    ['w','g','g','g','w','w','w','g','g','g','g','f','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','w','w','g','g','g','f','f','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','w','w','g','g','g','f','f','w','w','w','w','w','w','w'],
    ['w','w','g','g','g','w','g','g','g','g','g','w','w','w','w','w','w','w','w'],
    ['w','w','g','w','g','g','g','g','g','g','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w']
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
    'red': {
        color: "#FF0000",
        take_turn: function(){
        }
    },
}


function sum_nb2(x,y,f){
    var msx = map_size_x; var msy = map_size_y;
    var sum = f(x,y);
    sum += f((x+1)%msx,y) + f(x,(y+1)%msy);
    sum += f((x-1+msx)%msx,y) + f(x,(y-1+msy)%msy);

    sum += f((x+1)%msx,(y+1)%msy) + f((x+1)%msx,(y-1+msy)%msy);
    sum += f((x-1+msx)%msx,(y+1)%msy) + f((x-1+msx)%msx,(y-1+msy)%msy);

    sum += f((x+2)%msx,y) + f(x,(y+2)%msy);
    sum += f((x-2+msx)%msx,y) + f(x,(y-2+msy)%msy);
    return sum;
}

function for_neighbours(x,y,f){
    var msx = map_size_x; var msy = map_size_y;
    f(x,y);
    f((x+1)%msx,y); f(x,(y+1)%msy);
    f((x-1+msx)%msx,y); f(x,(y-1+msy)%msy);
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

function neigbour_tiles(x,y){
    var msx = map_size_x; var msy = map_size_y;
    return [[(x+1)%msx,y],[x,(y+1)%msy],
            [(x-1+msx)%msx,y],[x,(y-1+msy)%msy]
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
    var nb_cities = sum_tiles(neigbour_tiles(x,y),function(x,y){
        if(tile_array[x][y].harvested_by != undefined){
            return 1;
        } else {
            return 0;
        }
    });
    if(nb_cities == 0 && tile_array[x][y].is_empty() ){
        return true;
    } else {
        return false;
    }
}

function can_build_road(x,y,city){
    if( tile_array[x][y].is_empty() ){
        var nb_matches = sum_tiles(neigbour_tiles(x,y),function(x,y){
            if(tile_array[x][y].road == city.number){
                return 1;
            } else {
                return 0;
            }
        });
        if(nb_matches > 0){
            return true;
        }
    }
    return false;
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
        this.wood = 0;
        this.name = "Aztola";
        for_tiles(neighbour_square_tiles(x,y), function(x,y){
            tile_array[x][y].harvested_by = cities.length;
        });
        tile_array[x][y].road = cities.length;
    }

    // Calculate the culture production of the city
    culture(){
        return 3 + this.level;
    }

    owner(){
        return tile_array[this.x][this.y].owner;
    }

    // The amount of food produced per turn
    food_production(){
        return city_food_production(this.x,this.y,this);
    }

    // The amount of food consumed each turn
    // Food is consumed after it is gathered
    food_consumption() {
        return 3*this.level-2;
    }

    // city grows when the city has this much food
    food_limit() {
        //return Math.pow(2,this.level-1);
        return 15*this.level;
    }

    // Update the city
    update(map_scene){
        var x = this.x;
        var y = this.y;

        // Consume
        this.food -= this.food_consumption();

        // Check buildings
        if(this.building != undefined){
            if(this.building.food > this.food){
                this.building.food -= this.food;
                this.food = 0;
            } else {
                this.food -= this.building.food;
                this.building_done();
            }
        }


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
    }

    gather(x,y){
        if(tile_array[x][y].owner == this.owner() &&
           tile_array[x][y].city == undefined &&
           tile_array[x][y].land == 'g'){
            this.food += 1;
        }
    }

    // Describe the city in html
    describe(){
        var html = "<div>";
        html += "<h4>"+this.name+"</h4>";
        html += "<p>Level: "+this.level+"</p>";
        html += "<p>Food: "+this.food+"</p>";
        html += "<p>Wood: "+this.wood+"</p>";
        html += "</div>";
        return html;
    }

    // Start building a new city
    build_city(x, y){
        // check for neighbouring cities
        if(is_city_allowed(x,y) && tile_array[x][y].owner == this.owner()){
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

    add_tiles(tiles){
        var city = this;
        for_tiles(tiles, function(x,y){
            if(tile_array[x][y].harvested_by == undefined){
                tile_array[x][y].harvested_by = city.number;
            }
        });
    }

    // Build a road
    build_road(x, y){
        // Check this is a neighbour tile
        if(this.wood >= 5){
            if(can_build_road(x,y,this)){
                var mapscene = game.scene.scenes[0];
                mapscene.add_road(x,y);
                this.add_tiles(neigbour_tiles(x,y));
                this.wood -= 5;
                tile_array[x][y].road = this.number;
            }
        }
    }
}

// Keep track of existing cities
var cities = [];


// Information about each tile
class Tile {
    constructor(x, y, land) {
        this.x = x;
        this.y = y;
        this.owner = 'unowned';
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
        this.map = this.make.tilemap({ tileWidth: 16, tileHeight: 16, width: 2*map_size_x, height: 2*map_size_y});        var tiles = this.map.addTilesetImage('tiles');
        this.ground_layer = this.map.createBlankDynamicLayer('ground', tiles);
        this.ground_layer.setScale(3);
        this.ground_layer.setInteractive();
        this.ground_layer.on('pointerdown',()=>{tile_click(this);} );
    
        this.city_layer = this.map.createBlankDynamicLayer("cities", tiles);
        this.city_layer.setScale(3);

        this.draw_map();
    
        // Add at towns
        tile_array[2][2].owner = 'blue';
        tile_array[2][2].culture = {'blue': 5};
        this.add_city(2,2, 'blue');
        tile_array[10][10].owner = 'green';
        this.add_city(10,10, 'green');
        tile_array[10][10].culture = {'green': 5};
    
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

    put_tile_at(layer,tile,x,y){
        layer.putTileAt(tile, x, y);
        layer.putTileAt(tile, x+map_size_x, y);
        layer.putTileAt(tile, x, y+map_size_y);
        layer.putTileAt(tile, x+map_size_x, y+map_size_y);
    }

    add_city(x, y){
        this.put_tile_at(this.city_layer, city_sprites[0], x, y);
        var city = new City(x, y, 1);
        tile_array[x][y].city = city;
        cities.push( city );
        this.draw_boundaries();
    }

    update_city_sprite(x,y,level){
        var city_sprite = city_sprites[level-1];
        this.put_tile_at(this.city_layer, city_sprite, x, y);
    }

    add_building_sprite(x,y){
        this.put_tile_at(this.city_layer, building_cite_sprite, x, y);
    }

    add_road(x, y){
        this.put_tile_at(this.city_layer, road_sprites[0], x, y);
    }
    
    update_road_sprite(x, y){
        this.put_tile_at(this.city_layer, road_sprites[0], x, y);
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
        if( tile_array[x][y].owner != 'unowned' &&
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
    if(tile.owner != "unowned"){
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
    
    var new_culture_array = [];
    for (var x = 0; x < map_size_x; x++) {
        new_culture_array[x] = [];
        for (var y = 0; y < map_size_y; y++) {
            new_culture_array[x][y] = {};

            // Calculate culture
            for(player in players){
                let c = 0;
                if(tile_array[x][y].city && tile_array[x][y].owner == player){
                    c += tile_array[x][y].city.culture();
                }
                var nb_tiles = neigbour_tiles(x,y); 
                let dc = max_tiles(nb_tiles, function(x,y){
                    return get_player_culture(player,x,y);
                });

                let distance_decay = 1;
                if(tile_array[x][y].land == 'f'){
                    distance_decay += 0.5;
                }
                if(tile_array[x][y].road != undefined){
                    distance_decay *= 0.5;
                }

                if( dc > c ){
                    c = dc-distance_decay;
                }
                
                if(c>=1){
                    new_culture_array[x][y][player] = c;
                }
            }
        }
    }

    // Send resources to cities
    for (var x = 0; x < map_size_x; x++) {
        for (var y = 0; y < map_size_y; y++) {
            if(tile_array[x][y].harvested_by != undefined) {
                var city = cities[tile_array[x][y].harvested_by];
                if(tile_array[x][y].owner == city.owner()){
                    city.food += tile_food_production(x,y);
                    city.wood += tile_wood_production(x,y);
                }
            }
        }
    }

    // Update the cities
    for(city_key in cities){
        cities[city_key].update(map_scene);
    }

    // Write new culture into the array
    for (var x = 0; x < map_size_x; x++) {
        for (var y = 0; y < map_size_y; y++) {
            tile_array[x][y].culture = new_culture_array[x][y];
            tile_array[x][y].owner = decide_tile_owner(x,y);
        }
    }

    turn_counter += 1;
    $("#turn_number_text").text('Year '+turn_counter);

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
    var owner = tile_array[x][y].owner;
    var owner_culture = get_player_culture(owner,x,y);
    var new_owner = owner;
    for(player_key in players){
        var player_culture = get_player_culture(player_key,x,y);
        if( player_culture == owner_culture ) {
            // Tie goes to the original owner
            new_owner = owner;
        } else if( player_culture > owner_culture ){
            new_owner = player_key;
            owner_culture = player_culture;
        }
    }
    return new_owner;
}




