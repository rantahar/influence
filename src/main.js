var w = 24*7 + 0
var g = 1
var f = 6
var house_sprite = 7*1+1

var map_1 = [
    [w,w,w,w,w,w,w,w,w],
    [w,w,w,w,w,w,w,w,w],
    [w,w,g,g,g,g,g,w,w],
    [w,w,g,g,g,g,g,w,w],
    [w,w,g,g,g,g,g,w,w],
    [w,w,g,g,g,g,g,w,w],
    [w,w,g,g,g,g,g,w,w],
    [w,w,w,w,w,w,w,w,w],
    [w,w,w,w,w,w,w,w,w]
]

var map_size_y = map_1.length;
var map_size_x = map_1[0].length;

var tiles;
var layer;
var city_layer;

var turn_counter = 1;



//Players
var players = {
    'green': {
        color: 0x00ff00
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
    constructor(owner, x, y, level) {
        this.owner = owner;
        this.x = x;
        this.y = y;
        this.level = level;
    }

    culture(){
        return 30*this.level;
    }
}

// Keep track of existing cities
var cities = [];



// Create arrays indexed by x and y for each property of a tile
// Updating culture requires a full copy, so structure of arrays
// is better.
var culture_array = [];
var city_array = [];
var owner_array = [];
for (var x = 0; x < map_size_x; x++) {
    culture_array[x] = [];
    city_array[x] = [];
    owner_array[x] = [];
    for (var y = 0; y < map_size_y; y++) {
        culture_array[x][y] = {};
        owner_array[x][y] = 'unowned';
    }
}




class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
        this.turnCount;
        this.endTurnButton;
        this.mapScene;
    }
    
    preload() {}

    create() {
        console.log('UI');
        this.mapScene = this.scene.get('mapScene');
		// End turn button
        this.turnCount = this.add.text(10, 10, 'Turn '+turn_counter, { fill: '#008' });
        this.endTurnButton = this.add.text(10, 30, 'Next Turn', { fill: '#008' });
        this.endTurnButton.setInteractive();
        this.endTurnButton.on('pointerdown', ()=>{
            next_turn(this);
            this.mapScene.draw_boundaries();
        } );
    }

    update(){}
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
        this.cameras.main.setBackgroundColor("#ffffff");

        // create board
        this.map = this.make.tilemap({ data: map_1, tileWidth: 16, tileHeight: 16});
        tiles = this.map.addTilesetImage('tiles');
        this.layer = this.map.createDynamicLayer(0, tiles, 0, 0);
        this.layer.setScale(2);
        this.layer.setInteractive();
        this.layer.on('pointerdown',()=>{tile_click(this);} );
    
        this.city_layer = this.map.createBlankDynamicLayer("cities", tiles);
        this.city_layer.setScale(2);
    
        // Add at town at 1,1
        this.add_city(2,2, 'blue');
        this.add_city(5,6, 'green');
    
        this.cursors = this.input.keyboard.createCursorKeys();

        this.scene.launch('UIScene');
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

    add_city(x, y, owner){
        console.log("Add city", x, y, owner);
        this.city_layer.putTileAt(house_sprite, x, y);
        var city = new City(owner, x, y, 1);
        city_array[x][y] = city;
        cities.push( city );
        this.draw_boundaries();
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
                for(var player in players){
                    this.check_and_draw_border(player,x,y,x+1,y,x+1,y+1,x+1,y);
                    this.check_and_draw_border(player,x,y,x-1,y,x,y+1,x,y);
                    this.check_and_draw_border(player,x,y,x,y+1,x+1,y+1,x,y+1);
                    this.check_and_draw_border(player,x,y,x,y-1,x+1,y,x,y);
                }
            }
        }
    }

    check_and_draw_border(player_key,x,y,xnb,ynb,xf,yf,xt,yt){
        var width = 2*this.map.tileWidth;
        var height = 2*this.map.tileHeight;
        var player = players[player_key];
        if( owner_array[x][y] == player_key &&
            owner_array[xnb][ynb] != player_key)
        {
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
    scene: [mapScene, UIScene]
};

var game = new Phaser.Game(config);



function tile_click(map_scene) {
    var worldPoint = map_scene.input.activePointer.positionToCamera(map_scene.cameras.main);
    var x = map_scene.map.worldToTileX(worldPoint.x);
    var y = map_scene.map.worldToTileY(worldPoint.y);

    console.log(x,y);
    console.log(city_array[x][y]);
    console.log(culture_array[x][y]);
    console.log(owner_array[x][y]);
}


function next_turn(ui_scene){
    var map_scene = ui_scene.map_scene
    console.log(map_scene);

    var new_culture_array = [];
    for (var x = 1; x < map_size_x-1; x++) {
        new_culture_array[x] = [];
        for (var y = 1; y < map_size_y-1; y++) {
            new_culture_array[x][y] = {};

            // Calculate culture
            for(player in players){
                let c=0;
                if(city_array[x][y]){
                    var city = city_array[x][y];
                    if(city.owner == player){
                        c = city.culture();
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
            culture_array[x][y] = new_culture_array[x][y];
        }
    }

    for (var x = 1; x < map_size_x-1; x++) {
        for (var y = 1; y < map_size_y-1; y++) {
            owner_array[x][y] = decide_tile_owner(x,y);
        }
    }

    turn_counter += 1;
    ui_scene.turnCount.setText('Turn '+turn_counter);
}



function get_player_culture(player, x, y){
    if(culture_array[x][y][player]){
        return culture_array[x][y][player];
    }
    return 0;
}

function decide_tile_owner(x,y){
    var owner = owner_array[x][y];
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


