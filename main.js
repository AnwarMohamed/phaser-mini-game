var game = new Phaser.Game(800,600,Phaser.CANVAS,'gameDiv');

var sky;
var superman;
var cursors;
var laser;
var laserTime = 0;
var fireButton;
var aliens;
var state=true;
var score=0;
var scoreText;
var loseText;
var music;
var highScoreText;
var scores=new Array(10);
for (var i = 0 ; i <scores.length; i++) {
	scores[i]=0;
}
 mainState = {
	preload : function(){
		game.load.image('sky',"assets/sky1.png");
		game.load.image('superman',"assets/superman.png");
		game.load.image('laser',"assets/laser.png");
		game.load.image('alien',"assets/alien.png");
		game.load.audio('music',"assets/music.mp3");

	},

	create : function(){
		music = game.add.audio('music');
		music.play();
		sky = game.add.tileSprite(0,0,800,600,'sky');
		superman = game.add.sprite(game.world.centerX-50,game.world.centerY+100,'superman');
		game.physics.enable(superman,Phaser.Physics.ARCADE);
		cursors = game.input.keyboard.createCursorKeys();
		laser = game.add.group();
		laser.enableBody = true;
		laser.physicsBodyType = Phaser.Physics.ARCADE;
		laser.createMultiple(3,'laser');
		laser.setAll('anchor.x',0.5);
		laser.setAll('anchor.y',1);
		laser.setAll('outOfBoundsKill',true);
		laser.setAll('checkWorldBounds',true);
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		aliens = game.add.group();
		aliens.enableBody = true;
		aliens.physicsBodyType = Phaser.Physics.ARCADE;
		game.time.events.loop(Phaser.Timer.SECOND/2, createAlien, this);
		scoreText = game.add.text(0,550,'Score : ',{font : '32px Arcade Classic',fill : 'red'});
		loseText = game.add.text(250,100,"You Loose!!",{font : '32px Arcade Classic',fill : 'black'});
		loseText.visible = false;
		highScoreText = game.add.text(250,170,"x",{font : '25px Arcade Classic',fill : 'black'});
		highScoreText.visible = false;
	},

	update : function(){
		game.physics.arcade.overlap(laser,aliens,collision,null,this);
		game.physics.arcade.overlap(aliens,superman,collision2,null,this);
		superman.body.velocity.x = 0;
		superman.body.velocity.y = 0;

		sky.tilePosition.y += 2;
		if(cursors.left.isDown){
			superman.body.velocity.x = -250;
		}
		if(cursors.right.isDown){
			superman.body.velocity.x = 250;
		}
		if(cursors.up.isDown){
			superman.body.velocity.y = -250;
		}
		if(cursors.down.isDown){
			superman.body.velocity.y = 250;
		}
		if(fireButton.isDown){
			if(state!=false)
			FireLaser();
		}

		scoreText.text = 'Score :' + score;


		if (state==false) {
			loseText.text=" GAME OVER \n Click to restart";
        	loseText.visible = true;
        	highScoreText.text =   " TOP 10 SCORES "+"\n"+
        						   " 1. "+ scores[0]+"\n"+
		  						   " 2. "+ scores[1]+"\n"+
		                           " 3. "+ scores[2]+"\n"+
		                           " 4. "+ scores[3]+"\n"+
		                           " 5. "+ scores[4]+"\n"+
		                           " 6. "+ scores[5]+"\n"+
		                           " 7. "+ scores[6]+"\n"+
		                           " 8. "+ scores[7]+"\n"+
		                           " 9. "+ scores[8]+"\n"+
		                           "10. "+ scores[9]+"\n";
		    highScoreText.visible = true;
        	game.input.onTap.addOnce(restart,this);
			};
	}

}

function FireLaser(){
	if(game.time.now > laserTime){
		l = laser.getFirstExists(false);
	}
	if(l){
		l.reset(superman.x+40,superman.y);
		l.body.velocity.y= -700;
		laserTime = game.time.now+16;
	}
}

function createAlien(){

			var x=Math.floor((Math.random() * 700) + 60);
			var y=0
			var alien = aliens.create(x,y,'alien');
			alien.anchor.setTo(0.5,0.5);
			alien.body.velocity.y = 450;

}



function descend(){
	aliens.y -=10;
}

function collision(l,alien){
	l.kill();
	alien.kill();
	score += 10;

}

function collision2(superman,alien){
	superman.kill();
	state = false;
	if(score > scores[scores.length - 1]){
		scores.push(score);
		scores.sort(sortNumber);
		scores.reverse();
	}
	/*for (var i = 0 ; i <scores.length; i++) {
	alert(scores[i]);
	}*/
	//alert(scores);

}
function restart () {
	 createAlien();
	 superman.revive();
	 state = true;
	 score =0;
    loseText.visible = false;
    highScoreText.visible = false;

}
function sortNumber(a,b) {
    return a - b;
}

function highScore(){
	alert(" 1. "+ scores[0]+"\n"+
		  " 2. "+ scores[1]+"\n"+
		  " 3. "+ scores[2]+"\n"+
		  " 4. "+ scores[3]+"\n"+
		  " 5. "+ scores[4]+"\n"+
		  " 6. "+ scores[5]+"\n"+
		  " 7. "+ scores[6]+"\n"+
		  " 8. "+ scores[7]+"\n"+
		  " 9. "+ scores[8]+"\n"+
		  "10. "+ scores[9]+"\n");
}

game.state.add('mainState',mainState);
game.state.start('mainState');
