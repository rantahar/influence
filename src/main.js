
// Define the map. This should be moved to json files.
var map_sprites = {
    'w': {'map': 24*7},
    'g': {'map': 1},
    'f': {'map': 1, 'sprite': 6}
}
var city_sprites = [7,8,9,15,15,15,15,15]

var map_1 = [
    ['w','w','w','w','w','w','w','w','w'],
    ['w','w','w','w','w','w','w','w','w'],
    ['w','w','g','g','g','g','g','w','w'],
    ['w','w','g','f','g','g','g','w','w'],
    ['w','w','g','g','g','g','g','w','w'],
    ['w','w','g','g','g','g','g','w','w'],
    ['w','w','g','g','g','g','g','w','w'],
    ['w','w','w','w','w','w','w','w','w'],
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
    'green': {
        color: 0x00aa00
    },
    'red': {
        color: 0xff0000
    },
    'blue': {
        color: 0x0000ff
    }
}

// City class
class City {
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
        this.level = level;
        this.food = 0;
    }

    // Calculate the culture production of the city
    culture(){
        return 10*this.level;
    }

    // Update the city
    update(map_scene){
        var x = this.x;
        var y = this.y;
        // Gather resources
        this.gather(x,y);
        this.gather(x,y+1);
        this.gather(x,y-1);
        this.gather(x+1,y);
        this.gather(x-1,y);

        // Consume
        var food_consumption = Math.pow(2,this.level-1);
        this.food -= food_consumption;

        var food_limit = 5*food_consumption;
        if(this.food > food_limit){
            this.level += 1;
            this.food -= food_limit;
            map_scene.update_city_sprite(x,y,this.level);
        }
        if(this.food < 0){
            this.level -= 1;
            this.food = 0;
            map_scene.update_city_sprite(x,y,this.level);
        }
    }

    gather(x,y){
        if(tile_array[x][y].owner == 
            tile_array[x][y].owner){
            if(map_1[x][y] == 'g'){
                this.food += 1;
            }
        }
    }
}

// Keep track of existing cities
var cities = [];


// Information about each tile
class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.owner = 'unowned';
        this.culture = {};
    }
}


// Create arrays indexed by x and y for each property of a tile
for (var x = 0; x < map_size_x; x++) {
    tile_array[x] = [];
    for (var y = 0; y < map_size_y; y++) {
        tile_array[x][y] = new Tile(x,y);
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
        this.add_city(2,2, 'blue');
        tile_array[5][6].owner = 'green';
        this.add_city(5,6, 'green');
    
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
        for (var x = 1; x < map_size_x-1; x++) {
            for (var y = 1; y < map_size_y-1; y++) {
                var key = map_1[x][y];
                this.ground_layer.putTileAt(map_sprites[key].map, x, y);
                if(map_sprites[key].sprite) {
                    this.city_layer.putTileAt(map_sprites[key].sprite, x, y);
                }
            }
        }
    }

    add_city(x, y){
        console.log("Add city", x, y);
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

    draw_boundaries(){
        var width = 2*this.map.tileWidth;
        var height = 2*this.map.tileHeight;
        // Remove old boundaries
        this.boundary_markers.forEach(function(marker, i){
            marker.destroy();
        });

        // Check every tile. There must be a better way?
        for (var x = 1; x < map_size_x-1; x++) {
            for (var y = 1; y < map_size_y-1; y++) {
                this.check_and_draw_border(x,y,x+1,y,x+1,y+1,x+1,y);
                this.check_and_draw_border(x,y,x-1,y,x,y+1,x,y);
                this.check_and_draw_border(x,y,x,y+1,x+1,y+1,x,y+1);
                this.check_and_draw_border(x,y,x,y-1,x+1,y,x,y);
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
            var marker = this.add.graphics({ 
                lineStyle: { width: 5, color: player.color, alpha: 0.4 }
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
    game.scene.scenes[0].draw_boundaries()
});


function tile_click(map_scene) {
    var worldPoint = map_scene.input.activePointer.positionToCamera(map_scene.cameras.main);
    var x = map_scene.map.worldToTileX(worldPoint.x);
    var y = map_scene.map.worldToTileY(worldPoint.y);

    console.log(tile_array[x][y]);
}


function next_turn(map_scene){
    var new_culture_array = [];
    for (var x = 1; x < map_size_x-1; x++) {
        new_culture_array[x] = [];
        for (var y = 1; y < map_size_y-1; y++) {
            new_culture_array[x][y] = {};

            // Calculate culture
            for(player in players){
                let c=0;
                if(tile_array[x][y].city){
                    if(tile_array[x][y].owner == player){
                        c = tile_array[x][y].city.culture();
                    }
                } else {
                    c += 0.25*get_player_culture(player,x-1,y);
                    c += 0.25*get_player_culture(player,x+1,y);
                    c += 0.25*get_player_culture(player,x,y-1);
                    c += 0.25*get_player_culture(player,x,y+1);
                }
                if(c>=1){
                    new_culture_array[x][y][player] = c;
                }
            }
        }
    }

    for (var x = 1; x < map_size_x-1; x++) {
        for (var y = 1; y < map_size_y-1; y++) {
            tile_array[x][y].culture = new_culture_array[x][y];
        }
    }

    for (var x = 1; x < map_size_x-1; x++) {
        for (var y = 1; y < map_size_y-1; y++) {
            tile_array[x][y].owner = decide_tile_owner(x,y);
        }
    }

    for(city_key in cities){
        cities[city_key].update(map_scene);
    }

    turn_counter += 1;
    $("#turn_number_text").text('Turn '+turn_counter);
    //ui_scene.turnCount.setText('Turn '+turn_counter);
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


