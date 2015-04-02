window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

  game.load.tilemap('desert', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'assets/desert_1.png');
    game.load.image('ship', 'assets/Inf.png');
	game.load.image('Holes', 'assets/Inf.png');
	game.load.image('General', 'assets/GeneralMajor.png');
	game.load.audio('boden',  'assets/Sehnsucht.ogg');
}

var ship;
var cursors;
var blackHoles;
var starfield;
var botLayer;
var midLayer;
var topLayer;
var colLayer;
var general;
var timer;
var total = 0;
var stateText;
var text;
var response;
var secondResponse;
var erstResp;
var zweitResp;
var music;
var launched = false;
var survMet = false;
var survHope = false;
var genMet = false;
function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
    game.world.setBounds(0, 0, 2500, 2500);
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.setImpactEvents(true);
	//game.physics.p2.restitution = 0.8;
    //  Enable P2 and it will use the updated world size
    starfield = game.add.tilemap('desert');
    starfield.addTilesetImage('desert_1', 'tiles');
	botLayer = map.createLayer('Tile Layer 1');
	botLayer.resizeWorld();
	midLayer = map.createLayer('Tile Layer 2');
	midLayer.resizeWorld();
	topLayer = map.createLayer('Tile Layer 3');
	topLayer.resizeWorld();
	colLayer = map.createLayer('Coll');
	map.setCollison([
	ship = game.add.sprite(game.world.centerX, game.world.centerY+200, 'ship');
	//ship.animations.add('walk');
    ship.scale.set(0.5);
	game.physics.collide(ship, colLayer);
    //  Create our collision groups. One for the player, one for the pandas
    var playerCollisionGroup = game.physics.p2.createCollisionGroup();
    var blackHolesCollisionGroup = game.physics.p2.createCollisionGroup();
	var generalCollisionGroup = game.physics.p2.createCollisionGroup();
	music = game.add.audio('boden');
    //music.play();
	erstResp = game.input.keyboard.addKey(Phaser.Keyboard.W);
	zweitResp = game.input.keyboard.addKey(Phaser.Keyboard.E);
    game.physics.p2.updateBoundsCollisionGroup();
	game.physics.p2.enable(ship, false);
	game.camera.follow(ship);
	blackHoles = game.add.group();
	blackHoles.enableBody = true;
    blackHoles.physicsBodyType = Phaser.Physics.P2JS;
	general = game.add.group();
	general.enableBody = true;
    general.physicsBodyType = Phaser.Physics.P2JS;
	ship.physicsBodyType = Phaser.Physics.P2JS;
	ship.enableBody = true;	
	ship.body.setCollisionGroup(playerCollisionGroup);
	game.physics.enable(ship, Phaser.Physics.ARCADE);
	text = game.add.text(game.world.centerX, game.world.centerY, "What happened? Where am I? \n Did a SAM hit us? I have to find Jack.", { font: "35px Times New Roman", fill: "#000", align: "center" });
	text.anchor.setTo(0.5, 0.5);
  	game.input.onDown.addOnce(removeText, this);
	function removeText()
	{
		launched = true;
		text.visible = false;
		function createSurvivors()
		{
			for (var i = 0; i< 5; i++)
			{
				var xplace = game.world.randomX;
				var yplace = game.world.randomY;
				if(xplace == ship.x)
				{
					if(yplace == ship.y)
					{
						var s = blackHoles.create(xplace+game.rnd.integerInRange(1, 50), yplace+game.rnd.integerInRange(1, 50), "Holes");
					}
					else
					{
						var s = blackHoles.create(xplace, yplace, "Holes");
					}
				}
				else
				{
					var s = blackHoles.create(xplace, yplace, "Holes");
				}
				game.physics.enable(s, Phaser.Physics.ARCADE);
				s.body.setRectangle(100, 100, 0, 0);
				s.body.velocity = 0;
				s.body.mass = 200000;
				s.body.immovable = true;
				s.body.setCollisionGroup(blackHolesCollisionGroup);
				s.body.collides([generalCollisionGroup, blackHolesCollisionGroup, playerCollisionGroup]);
			}
		}
		createSurvivors();
		function createGeneral()
		{
			var xplace = game.world.randomX;
			var yplace = game.world.randomY;
			if(xplace == ship.x)
			{
				if(yplace == ship.y)
				{
					var g = general.create(xplace+game.rnd.integerInRange(1, 50), yplace+game.rnd.integerInRange(1, 50), "General");
				}
				else
				{
					var g = general.create(xplace, yplace, "General");
				}
				}
				else
				{
					var g = general.create(xplace, yplace, "General");
				}
				game.physics.enable(g, Phaser.Physics.ARCADE);
				g.body.setRectangle(100, 100, 0, 0);
				g.body.velocity = 0;
				g.body.mass = 200000;
				g.body.setCollisionGroup(generalCollisionGroup);
				g.body.collides([generalCollisionGroup, blackHolesCollisionGroup, playerCollisionGroup]);
		}
		createGeneral();
		function encounter()
		{
			if (!survMet&&(stateText.visible == false||stateText == null))
			{
				stateText = game.add.text(ship.x+50,ship.y+50,' Hello there, have you seen any of the others?', { font: '20px Times New Roman', fill: '#000' });
				stateText.anchor.setTo(0.5, 0.5);
				stateText.visible = true;
				survMet = true;
				game.input.onDown.addOnce(removeGreeting, this);
			}
			else
			{
				if(stateText.visible == false)
				{
					stateText = game.add.text(ship.x+50,ship.y+50,' I don\'t want to be so lost', { font: '20px Times New Roman', fill: '#000' });
					stateText.anchor.setTo(0.5, 0.5);
					stateText.visible = true;
					survHope= true;
					game.input.onDown.addOnce(removeGreeting, this);
				}
			}
		}
		function derGeneral(resp)
		{
			if(!genMet)
			{
				stateText = game.add.text(ship.x+50,ship.y+50,'Soldier, what are you doing there?', { font: '20px Times New Roman', fill: '#000' });
				stateText.anchor.setTo(0.5, 0.5);
				stateText.visible = true;
				genMet = true;
				game.input.onDown.addOnce(GeneralMeet, this);
			}
			else
			{
				if(resp == 1)
				{
					response.visible = false;
					SecondResponse.visible = false;
					stateText = game.add.text(ship.x+50,ship.y+50,'Damn right you\'re a soldier. Who\'s this Jack you\'re on about?', { font: '20px Times New Roman', fill: '#000' });
					stateText.anchor.setTo(0.5, 0.5);
					stateText.visible = true;
					game.input.onDown.addOnce(removeGreeting, this);
				}
				else if(resp == 2)
				{
					response.visible = false;
					SecondResponse.visible = false;
					stateText = game.add.text(ship.x+50,ship.y+50,'I will not suffer insubordination soldier!', { font: '20px Times New Roman', fill: '#000' });
					stateText.anchor.setTo(0.5, 0.5);
					stateText.visible = true;
					game.input.onDown.addOnce(removeGreeting, this);
				}
			}
		}
	ship.body.collides(blackHolesCollisionGroup, encounter, this);
	ship.body.collides(generalCollisionGroup, derGeneral, this);
    cursors = game.input.keyboard.createCursorKeys();
	function removeGreeting()
	{
		stateText.visible = false;
	}
	function removeResponse()
	{
		response.visible = false;
	}
	function GeneralMeet()
	{
		stateText.visible = false;
		response = game.add.text(ship.x+50,ship.y+50,'W. I...yes...I\'m a soldier. Do you know where Jack is?', { font: '20px Times New Roman', fill: '#000' });
		response.anchor.setTo(0.5, 0.5);
		response.visible = true;
		secondResponse = game.add.text(ship.x+50,ship.y+100,'E. Do not command me! I need to find Jack!', { font: '20px Times New Roman', fill: '#000' });
		response.anchor.setTo(0.5, 0.5);
		response.visible = true;
		secondResponse.visible = true;
		erstResp.onDown.add(respEins, this);
		function respEins()
		{
			derGeneral(1);
		}
		zweitResp.onDown.add(respZwei, this);
		function respZwei()
		{
			derGeneral(2);
		}
	}
	game.input.onDown.addOnce(removeGreeting, this);
	stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '20px Times New Roman', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;
	}
}




function update() {
	if(launched)
	{
		ship.body.setZeroVelocity();
		if (cursors.left.isDown)
		{
			ship.body.rotateLeft(50);
		}
		else if (cursors.right.isDown)
		{
			ship.body.rotateRight(50);
		}
		else {ship.body.setZeroRotation();}
		if (cursors.up.isDown)
		{
			ship.body.thrust(8000);
		}
		else if (cursors.down.isDown)
		{
			ship.body.thrust(-4000);
		}
	}
}


function render() {
	//game.debug.text('Days Alive: ' + total, 32, 32);
	 //game.debug.body(s);
}
};
