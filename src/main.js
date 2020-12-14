
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

var city_sprites = [7,8,9,15,15,15,15,15]
var building_cite_sprite = 5*7+3

var map_1 = [
    ['w','w','w','w','w','w','w','w','w'],
    ['w','g','g','g','g','g','g','w','w'],
    ['w','g','g','g','g','g','g','g','w'],
    ['w','g','g','f','g','f','g','g','w'],
    ['w','g','g','f','g','f','g','g','w'],
    ['w','g','g','f','g','f','g','g','w'],
    ['w','g','g','g','g','g','g','g','w'],
    ['w','w','g','g','g','g','g','g','w'],
    ['w','w','w','w','w','w','w','w','w']
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



function sum_neighbours(x,y,f){
    var msx = map_size_x; var msy = map_size_y;
    var sum = f(x,y);
    sum += f((x+1)%msx,y) + f(x,(y+1)%msy);
    sum += f((x-1+msx)%msx,y) + f(x,(y-1+msy)%msy);
    return sum;
}

function sum_nb2(x,y,f){
    var msx = map_size_x; var msy = map_size_y;
    var sum = f(x,y);
    sum += f((x+1)%msx,y) + f(x,(y+1)%msy);
    sum += f((x-1+msx)%msx,y) + f(x,(y-1+msy)%msy);

    sum += f((x+1)%msx,(y+1)%msy) + f((x+1)%msx,(y-1+msy)%msy);
    sum += f((x-1+msx)%msx,(y+1)%msy) + f((x-1+msx)%msx,(y-1+msy)%msy);

    sum += f((x+2)%msx,y) + f(x,(y+2)%msy);
    sum += f((x-2+msy)%msx,y) + f(x,(y-2+msy)%msy);
    return sum;
}

function for_neighbours(x,y,f){
    var msx = map_size_x; var msy = map_size_y;
    f(x,y);
    f((x+1)%msx,y); f(x,(y+1)%msy);
    f((x-1+msx)%msx,y); f(x,(y-1+msy)%msy);
}




function is_city_allowed(x,y){
    // check for neighbouring cities
    var nb_cities = sum_nb2(x,y,function(x,y){
        if(tile_array[x][y].city || tile_array[x][y].building=='city'){
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

function city_food_production(x,y,owner){
    var food = sum_neighbours(x,y,function(x,y){
        if(tile_array[x][y].owner == owner &&
          tile_array[x][y].city == undefined &&
          tile_array[x][y].building == undefined){
            if(tile_array[x][y].land == 'g'){
                return 1;
            }
            if(tile_array[x][y].land == 'w'){
                return 1;
            }
        }
        return 0;
    });
    return food;
}




// City class
class City {
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
        this.level = level;
        this.food = 0;
        this.name = "Aztola";
    }

    // Calculate the culture production of the city
    culture(){
        return 10*this.level;
    }

    owner(){
        return tile_array[this.x][this.y].owner;
    }

    // The amount of food produced per turn
    food_production(){
        return city_food_production(this.x,this.y,this.owner());
    }

    // The amount of food consumed each turn
    // Food is consumed after it is gathered
    food_consumption() {
        return this.level;
    }

    // city grows when the city has this much food
    food_limit() {
        //return Math.pow(2,this.level-1);
        return 10*this.level;
    }

    // Update the city
    update(map_scene){
        var x = this.x;
        var y = this.y;
        // Gather resources
        this.food += this.food_production();

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
        html += "</div>";
        return html;
    }

    // Start building a new city
    build_city(x, y, owner){
        // check for neighbouring cities
        if(is_city_allowed(x,y) && tile_array[x][y].owner == owner){
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
        this.cameras.main.setBounds( -100, -100, 200, 200);
        //this.cameras.main.setBackgroundColor("#ffffff");

        // create board
        this.map = this.make.tilemap({ tileWidth: 16, tileHeight: 16});
        tiles = this.map.addTilesetImage('tiles');
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
        tile_array[6][6].owner = 'green';
        this.add_city(6,6, 'green');
        tile_array[6][6].culture = {'green': 5};
    
        this.cursors = this.input.keyboard.createCursorKeys();

        this.scene.launch('UIScene');
        this.scene.launch('RexUIPanel');
        
    }
    
    update (time, delta){
        var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
        var mousePointerX = this.map.worldToTileX(worldPoint.x);
        var mousePointerY = this.map.worldToTileY(worldPoint.y);
    
        if (this.cursors.left.isDown)
        {
            this.cameras.main.x += 4;
        }
        else if (this.cursors.right.isDown)
        {
            this.cameras.main.x -= 4;
        }
        else if (this.cursors.up.isDown)
        {
            this.cameras.main.y += 4;
        }
        else if (this.cursors.down.isDown)
        {
            this.cameras.main.y -= 4;
        }
    }

    draw_map(x, y){
        for (var x = 0; x < map_size_x; x++) {
            for (var y = 0; y < map_size_y; y++) {
                var key = tile_array[x][y].land;
                this.ground_layer.putTileAt(map_sprites[key].map, x, y);
                if(map_sprites[key].sprite) {
                    this.city_layer.putTileAt(map_sprites[key].sprite, x, y);
                }
            }
        }
    }

    add_city(x, y){
        this.city_layer.putTileAt(city_sprites[0], x, y);
        var city = new City(x, y, 1);
        tile_array[x][y].city = city;
        cities.push( city );
        this.draw_boundaries();
    }

    update_city_sprite(x,y,level){
        var city_sprite = city_sprites[level-1];
        this.city_layer.putTileAt(city_sprite, x, y);
    }

    add_building_sprite(x,y){
        this.city_layer.putTileAt(building_cite_sprite, x, y);
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
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
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
    var x = map_scene.map.worldToTileX(worldPoint.x);
    var y = map_scene.map.worldToTileY(worldPoint.y);
    var tile = tile_array[x][y];

    $("#info-page").empty();

    // Show city if there is one
    if(tile.city){
        var div = tile.city.describe()
        $("#info-page").append(div);
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
                let c=0;
                if(tile_array[x][y].city && tile_array[x][y].owner == player){
                    c += tile_array[x][y].city.culture();
                }
                var msx = map_size_x; var msy = map_size_y;
                c += 0.25*get_player_culture(player,(x-1+msx)%msx,y);
                c += 0.25*get_player_culture(player,(x+1)%msx,y);
                c += 0.25*get_player_culture(player,x,(y-1+msy)%msy);
                c += 0.25*get_player_culture(player,x,(y+1)%msy);
                if(c>=1){
                    new_culture_array[x][y][player] = c;
                }
            }
        }
    }

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

    for(city_key in cities){
        cities[city_key].update(map_scene);
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




