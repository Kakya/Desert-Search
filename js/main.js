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

    game.load.image('space', 'assets/BB.png');
    game.load.image('ship', 'assets/planet.png');
	game.load.image('Holes', 'assets/Dark-Black-Hole.jpg');

}

var ship;
var cursors;
var blackHoles;
var starfield;
var timer;
var total = 0;
var stateText;
function create() {

    //  Our world size is 1600 x 1200 pixels
    game.world.setBounds(0, 0, 800, 600);
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.setImpactEvents(true);
	game.physics.p2.restitution = 0.8;
    //  Enable P2 and it will use the updated world size
	timer = game.time.create(false);
	function updateCounter() {

		total++;

	}
	timer.loop(100, updateCounter, this);
	timer.start();
    starfield = game.add.tileSprite(0, 0, 800, 600, 'space');
    starfield.fixedToCamera = true;
	ship = game.add.sprite(50, 50, 'ship');
    ship.scale.set(1);


    //  Create our physics body. The 'true' parameter enables visual debugging.

//  Turn on impact events for the world, without this we get no collision callbacks
    

    //  Create our collision groups. One for the player, one for the pandas
    var playerCollisionGroup = game.physics.p2.createCollisionGroup();
    var blackHolesCollisionGroup = game.physics.p2.createCollisionGroup();

    game.physics.p2.updateBoundsCollisionGroup();
	game.physics.p2.enable(ship, false);
	game.camera.follow(ship);
	blackHoles = game.add.group();
	blackHoles.enableBody = true;
    blackHoles.physicsBodyType = Phaser.Physics.P2JS;
	ship.physicsBodyType = Phaser.Physics.P2JS;
	ship.enableBody = true;
	function createBlackHoles()
	{
		for (var i = 0; i< 2; i++)
		{
			var xplace = game.world.randomX;
			var yplace = game.world.randomY;
			if(xplace != ship.x)
			{
				if(yplace != ship.y)
				{
					var s = blackHoles.create(xplace, yplace, "Holes");
				}
				else
				{
					var s = blackHoles.create(xplace, yplace*2, "Holes");
				}
			}
			else
			{
				if(yplace != ship.y)
				{
					var s = blackHoles.create(xplace*2, yplace, "Holes");
				}
				else
				{
					var s = blackHoles.create(xplace*2, yplace*2, "Holes");
				}
			}
			
			game.physics.enable(s, Phaser.Physics.ARCADE);
			s.body.velocity.x = game.rnd.integerInRange(-200, 200);
			s.body.velocity.y = game.rnd.integerInRange(-200, 200);
			s.body.setCollisionGroup(blackHolesCollisionGroup);
			s.body.collides([blackHolesCollisionGroup, playerCollisionGroup]);
		}
	}	
	createBlackHoles();
	game.time.events.loop(Phaser.Timer.SECOND * 5, createBlackHoles);
	blackHoles.setAll('body.collideWorldBounds', true);
	blackHoles.setAll('body.bounce.x', 200);
	blackHoles.setAll('body.bounce.y', 200);
	blackHoles.setAll('body.minBounceVelocity', 0);
	ship.body.setCircle(25);
	ship.body.setCollisionGroup(playerCollisionGroup);
	
    //  The ship will collide with the pandas, and when it strikes one the hitPanda callback will fire, causing it to alpha out a bit
    //  When pandas collide with each other, nothing happens to them.
	function EndGame() {

		ship.kill();

		stateText.text="You have failed your people.\n \n The final remnant in the universe has gone away, only blackholes remain now. \n Some God you are.";
		stateText.visible = true;
		timer.stop();
     //the "click to restart" handler
	//game.input.onTap.addOnce(restart,this);

	}
    ship.body.collides(blackHolesCollisionGroup, EndGame, this);

    cursors = game.input.keyboard.createCursorKeys();
	stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '20px Times New Roman', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

}




function update() {
   ship.body.setZeroVelocity();

    if (cursors.left.isDown)
    {
		ship.body.moveLeft(200);
    }
    else if (cursors.right.isDown)
    {
		ship.body.moveRight(200);
    }

    if (cursors.up.isDown)
    {
    	ship.body.moveUp(200);
    }
    else if (cursors.down.isDown)
    {
        ship.body.moveDown(200);
    }

    if (!game.camera.atLimit.x)
    {
        starfield.tilePosition.x -= ((ship.body.velocity.x) * game.time.physicsElapsed);
    }

    if (!game.camera.atLimit.y)
    {
        starfield.tilePosition.y -= ((ship.body.velocity.y) * game.time.physicsElapsed);
    }

}


function render() {
	game.debug.text('Days Alive: ' + total, 32, 32);
}
};
