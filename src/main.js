var w = 24*7 + 0
var g = 1
var f = 7
var house_sprite = 7*1+1

var map_1 = [
    [w,w,w,w,w,w,w],
    [w,g,g,g,g,g,w],
    [w,g,g,g,g,g,w],
    [w,g,g,g,g,g,w],
    [w,g,g,g,g,g,w],
    [w,g,g,g,g,g,w],
    [w,w,w,w,w,w,w]
]

var map_size_y = map_1.length;
var map_size_x = map_1[0].length;

var tiles;
var layer;
var city_layer;

var turn_counter = 1;


// Need an array representing the state of each tile
// (or put in game.tiles. ...
var tile_array = [];
for (var x = 0; x < map_size_x; x++) {
    tile_array[x] = [];
    for (var y = 0; y < map_size_y; y++) {
        tile_array[x][y] = {'culture': 0, 'city': 0};
    }
}

// Keep track of existing cities
var cities = [];



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
        this.add_city(1,1)
    
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

    add_city(x, y){
        this.city_layer.putTileAt(house_sprite, 1, 1);
        tile_array[1][1].city = 1;
        cities.push({ 'x':x, 'y':y, 'level': 1 });
        this.draw_boundaries();
    }

    draw_boundaries(){
        // Factor of 2 from this.layer.setScale(2);
        var width = 2*this.map.tileWidth;
        var height = 2*this.map.tileHeight;

        // Remove old boundaries
        this.boundary_markers.forEach(function(marker, i){
            console.log(marker, i);
            marker.destroy();
        });

        // Check every tile. There must be a better way?
        for (var x = 1; x < map_size_x-1; x++) {
            for (var y = 1; y < map_size_y-1; y++) {
                if( tile_array[x][y].culture >= 1 &&
                    tile_array[x+1][y].culture  < 1 ){
                    var marker = this.add.graphics({ 
                        lineStyle: { width: 5, color: 0xffffff, alpha: 0.4 }
                    });
                    marker.beginPath();
                    marker.moveTo((x+1)*width, (y+1)*height); // start line
                    marker.lineTo((x+1)*width, y*height);
                    marker.strokePath();
                    this.boundary_markers.push(marker);
                }
                if( tile_array[x][y].culture >= 1 &&
                    tile_array[x-1][y].culture  < 1 ){
                    var marker = this.add.graphics({ 
                        lineStyle: { width: 5, color: 0xffffff, alpha: 0.4 }
                    });
                    marker.beginPath();
                    marker.moveTo(x*width, (y+1)*height);
                    marker.lineTo(x*width, y*height);
                    marker.strokePath();
                    this.boundary_markers.push(marker);
                }
                if( tile_array[x][y].culture >= 1 &&
                    tile_array[x][y+1].culture  < 1 ){
                    var marker = this.add.graphics({ 
                        lineStyle: { width: 5, color: 0xffffff, alpha: 0.4 }
                    });
                    marker.beginPath();
                    marker.moveTo((x+1)*width, (y+1)*height);
                    marker.lineTo(x*width, (y+1)*height);
                    marker.strokePath();
                    this.boundary_markers.push(marker);
                }
                if( tile_array[x][y].culture >= 1 &&
                    tile_array[x][y-1].culture  < 1 ){
                    var marker = this.add.graphics({ 
                        lineStyle: { width: 5, color: 0xffffff, alpha: 0.4 }
                    });
                    marker.beginPath();
                    marker.moveTo((x+1)*width, y*height);
                    marker.lineTo(x*width, y*height);
                    marker.strokePath();
                    this.boundary_markers.push(marker);
                }
            }
        }
    }

}



var config = {
    type: Phaser.AUTO,
    parent: "Container",
    width: 800,
    height: 600,
    scene: [mapScene, UIScene]
};

var game = new Phaser.Game(config);



function tile_click(map_scene) {
    console.log(map_scene);
    var worldPoint = map_scene.input.activePointer.positionToCamera(map_scene.cameras.main);
    var x = map_scene.map.worldToTileX(worldPoint.x);
    var y = map_scene.map.worldToTileY(worldPoint.y);

    console.log(x,y);
    console.log(tile_array[x][y]);
}


function next_turn(ui_scene){
    var map_scene = ui_scene.map_scene
    console.log(map_scene);

    var new_tile_array = [];

    for (var x = 1; x < map_size_x-1; x++) {
        new_tile_array[x] = [];
        for (var y = 1; y < map_size_y-1; y++) {
            new_tile_array[x][y] = {};

            // Calculate culture
            let c = 5*tile_array[x][y].city;
            c += 0.25*tile_array[x-1][y].culture;
            c += 0.25*tile_array[x+1][y].culture;
            c += 0.25*tile_array[x][y+1].culture;
            c += 0.25*tile_array[x][y-1].culture;
            if( c < 1 ) {
                c = 0;
            }
            new_tile_array[x][y].culture = c;
        }
    }

    for (var x = 1; x < map_size_x-1; x++) {
        for (var y = 1; y < map_size_y-1; y++) {
            tile_array[x][y].culture = new_tile_array[x][y].culture;
        }
    }

    turn_counter += 1;
    ui_scene.turnCount.setText('Turn '+turn_counter);
}


