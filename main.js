var dappyGame = {
    preload: function() { 
        game.load.image('dap', 'assets/dap.png');
        game.load.image('pipe', 'assets/pipe.png');
        game.load.audio('jump', 'assets/jump.wav'); 
        game.load.audio('lose', 'assets/lose.wav'); 
    },
    create: function() { 
        game.stage.backgroundColor = "#71c5cf";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.dap = game.add.sprite(100,245, 'dap');
        game.physics.arcade.enable(this.dap);
        this.dap.body.gravity.y = 1000;
        this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.spacebar.onDown.add(this.jump, this);
        this.pipes = game.add.group(); 
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        this.jumpSound = game.add.audio('jump'); 
        this.loseSound = game.add.audio('lose'); 
        this.dap.anchor.setTo(-0.2,0.5);
        this.score = 0;
        this.mainTitle = game.add.text(120, 400, "Dappy Bird",{font:"32px Arial", fill:"#fff"});
        this.labelForScore = game.add.text(20,20, "0", {font:"30px Arial", fill:"#fff"});
        spacebar.onDown.add(function() {
            if(game.paused) {
                this.lostText.text = "";
                game.paused = false;
            }
        }, self);
        
    },
    removeTitle: function() {
        this.mainTitle.text = "";

    },
    lostGame: function() {
        game.state.start('main');
    },
    addOnePipe: function(x,y) {
        var pipe = game.add.sprite(x,y,'pipe');
        this.pipes.add(pipe);
        game.physics.arcade.enable(pipe);
        pipe.body.velocity.x = -200;
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill == true;
        
        this.labelForScore.text = this.score;
    },
    addRowOfPipes: function() {
        var hole = Math.floor(Math.random() * 5) + 1;
        for(var i = 0; i < 8; i++) {
            if(i != hole && i != hole + 1) {
                this.addOnePipe(400, i*60+10);
            }
        }
        this.score += 1;
        this.mainTitle.text = "";
    },
    update: function() {
        if(this.dap.y < 0 || this.dap.y > 490) {
            this.restartGame();
        } 
        if(this.dap.angle < 30) {
            this.dap.angle += 1;
        }
        game.physics.arcade.overlap(this.dap, this.pipes, this.hitPipe, null, this);
    },
    hitPipe: function() {
        if(this.dap.alive == false) {
            return;
        }
        this.dap.alive = false;
        game.time.events.remove(this.timer);

        this.pipes.forEach(function(p) {
            p.body.velocity.x = 0;
        }, this);
        
    },
    jump: function() {
        if(!this.dap.alive) {
            return;
        }
        this.jumpSound.play(); 
        this.dap.body.velocity.y = -350;
        var angle_animation = game.add.tween(this.dap);
        angle_animation.to({angle: -20}, 100);
        angle_animation.start();
    },
    restartGame: function() {
        this.lostText = game.add.text(90,200, "YOU LOSE", {font:"62px Impact", fill:"#fff"});
        game.time.events.add(3000, this.lostGame ,self);
        this.loseSound.play();
    }
};
var game = new Phaser.Game(400, 490);

game.state.add('main', dappyGame); 

game.state.start('main');