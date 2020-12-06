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
        color: "green"
    },
    'red': {
        color: "red"
    },
    'blue': {
        color: "blue"
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
        return 10*this.level;
    }
}

// Keep track of existing cities
var cities = [];



// Create arrays indexed by x and y for each property of a tile
// Updating culture requires a full copy, so structure of arrays
// is better.
var culture_array = [];
var city_array = [];
for (var x = 0; x < map_size_x; x++) {
    culture_array[x] = [];
    city_array[x] = [];
    for (var y = 0; y < map_size_y; y++) {
        culture_array[x][y] = 0;
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
        this.add_city(6,6, 'green');
    
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
        // Factor of 2 from this.layer.setScale(2);
        var width = 2*this.map.tileWidth;
        var height = 2*this.map.tileHeight;

        // Remove old boundaries
        this.boundary_markers.forEach(function(marker, i){
            marker.destroy();
        });

        // Check every tile. There must be a better way?
        for (var x = 1; x < map_size_x-1; x++) {
            for (var y = 1; y < map_size_y-1; y++) {
                if( culture_array[x][y] >= 1 &&
                    culture_array[x+1][y]  < 1 ){
                    var marker = this.add.graphics({ 
                        lineStyle: { width: 5, color: 0xffffff, alpha: 0.4 }
                    });
                    marker.beginPath();
                    marker.moveTo((x+1)*width, (y+1)*height); // start line
                    marker.lineTo((x+1)*width, y*height);
                    marker.strokePath();
                    this.boundary_markers.push(marker);
                }
                if( culture_array[x][y] >= 1 &&
                    culture_array[x-1][y]  < 1 ){
                    var marker = this.add.graphics({ 
                        lineStyle: { width: 5, color: 0xffffff, alpha: 0.4 }
                    });
                    marker.beginPath();
                    marker.moveTo(x*width, (y+1)*height);
                    marker.lineTo(x*width, y*height);
                    marker.strokePath();
                    this.boundary_markers.push(marker);
                }
                if( culture_array[x][y] >= 1 &&
                    culture_array[x][y+1]  < 1 ){
                    var marker = this.add.graphics({ 
                        lineStyle: { width: 5, color: 0xffffff, alpha: 0.4 }
                    });
                    marker.beginPath();
                    marker.moveTo((x+1)*width, (y+1)*height);
                    marker.lineTo(x*width, (y+1)*height);
                    marker.strokePath();
                    this.boundary_markers.push(marker);
                }
                if( culture_array[x][y] >= 1 &&
                    culture_array[x][y-1]  < 1 ){
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
    console.log(city_array[x][y]);
    console.log(culture_array[x][y]);
}


function next_turn(ui_scene){
    var map_scene = ui_scene.map_scene
    console.log(map_scene);

    var new_culture_array = [];
    for (var x = 1; x < map_size_x-1; x++) {
        new_culture_array[x] = [];
        for (var y = 1; y < map_size_y-1; y++) {
            new_culture_array[x][y] = 0;

            // Calculate culture
            for(player in players){
                let c=0;
                if(city_array[x][y]){
                    var city = city_array[x][y];
                    if(city.owner = player){
                        c = city.culture();
                    }
                } else {
                    c += 0.25*culture_array[x-1][y];
                    c += 0.25*culture_array[x+1][y];
                    c += 0.25*culture_array[x][y+1];
                    c += 0.25*culture_array[x][y-1];
                    if( c < 1 ) {
                        c = 0;
                    }
                }
                new_culture_array[x][y] = c;
            }
        }
    }

    for (var x = 1; x < map_size_x-1; x++) {
        for (var y = 1; y < map_size_y-1; y++) {
            culture_array[x][y] = new_culture_array[x][y];
        }
    }

    turn_counter += 1;
    ui_scene.turnCount.setText('Turn '+turn_counter);
}


