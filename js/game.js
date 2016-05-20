function Game(){
    var me = this;

    this.CANVAS_WIDTH = 700;
    this.CANVAS_HEIGHT = 500;
    this.FPS = 35;
    this.ENEMY_GROUP_OFFSET_X = 10;
    this.LEFT = 'left', RIGHT = 'right', UP = 'up', DOWN = 'down';
    this.waveCount = 0;
    this.canvas = getCanvas();

    this.player = new Player({game   : me});

    this.stat = new Stat({
        game    : me
        ,el     : document.getElementById('stat')
    });

    this.stat.initStat();
    this.player.initStat()

    this.ec = new EnemiesController({game   : me});

    this.components = [
        this.player
        ,this.ec
        ,this.stat
    ];

    this.gt = {}; //game time
    this.gt.lastTime = Date.now();


    this.ec.init();
    launchGame();
    var gameInterval, infoInterval, launched;

    
    
    function launchGame(){
        launched = true;
        gameInterval = setInterval(function() {
            if ( !launched ){
                return;
            }

            me.gt.now = Date.now();
            me.gt.dt = (me.gt.now - me.gt.lastTime) / 1000.0;

            launched && update();
            launched && draw();

            me.gt.lastTime = me.gt.now;
        }, 1000/me.FPS);

        /*setInterval(function() {
            info();
        }, 2000);*/
    }

    function pauseGame(){
        if ( isLaunched() ){
            clearInterval(gameInterval);
            toggleLaunched();
        }else{
            launchGame();
        }
    }
    
    function restartGame(){
        var i = 0;
        while (i < me.components.length){
            me.components[i].restart && me.components[i].restart();
            i++;
        }
    }

    function update() {
        //console.log('game time',  me.gt.dt);
        
        if(keydown.space || keydown.up) {
            me.player.shoot();
        }

        me.player.move(keydown);

        me.player.x = me.player.x.clamp(0, me.CANVAS_WIDTH - me.player.width);

        me.player.bullets.forEach(function(bullet) {
            bullet.update();
        });

        me.player.bullets = me.player.bullets.filter(function(bullet) {
            return bullet.active;
        });

        me.ec.bullets.forEach(function(bullet) {
            bullet.update();
        });

        me.ec.bullets = me.ec.bullets.filter(function(bullet) {
            return bullet.active;
        });

        me.ec.enemies.forEach(function(enemy) {
            enemy.update();
        });

        me.ec.maxLeft = 0;
        me.ec.minLeft = 99999;
        var enemiesNew = me.ec.enemies.filter(function(enemy) {
            if ( me.ec.maxLeft < enemy.x ){
                me.ec.maxLeft = enemy.x
            }
            if ( me.ec.minLeft > enemy.x ){
                me.ec.minLeft = enemy.x
            }
            return enemy.active;
        });

        if ( enemiesNew.length != me.ec.enemies.length){
            enemiesNew.forEach(function(enemy, index) {
                enemy.index = index;
            });
        }

        me.ec.enemies = enemiesNew;

        handleCollisions();

        me.ec.checkUpdateCount();
        /*if(Math.random() < 0.1) {
            enemies.push(Enemy());
        }*/
    }

    function draw() {
        //me.canvas.clearRect(0, 0, me.CANVAS_WIDTH, me.CANVAS_HEIGHT);
        do_render();
        me.player.draw();

        me.player.bullets.forEach(function(bullet) {
            bullet.draw();
        });

        me.ec.bullets.forEach(function(bullet) {
            bullet.draw();
        });

        me.ec.enemies.forEach(function(enemy) {
            enemy.draw();
        });

        me.canvas.fillText(me.player.stats.curSpeed, 100, 100);
        me.canvas.fillText(me.player.x, 100, 200);
    }

    function collides(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    function handleCollisions() {
        me.player.bullets.forEach(function(bullet) {
            me.ec.enemies.forEach(function(enemy) {
                if(collides(bullet, enemy)) {
                    enemy.onHit();
                    bullet.active = false;
                }
            });
        });

        me.ec.bullets.forEach(function(bullet) {
            if(collides(bullet, me.player)) {
                me.player.onHit();
                bullet.active = false;
            }
        });

        me.ec.enemies.forEach(function(enemy) {
            if(collides(enemy, me.player)) {
                enemy.onHit();
                me.player.explode();
            }
        });
    }

    function getCanvas(){
        var canvas = $('#canvas');
        if( !canvas.get(0) ){
            canvas = $("<canvas id='canvas' width='" + me.CANVAS_WIDTH +
                "' height='" + me.CANVAS_HEIGHT + "'></canvas");
            canvas.appendTo('body');
        }

        return canvas.get(0).getContext("2d");;
    }

    function info(){
        //console.log('Enemies', ec.enemies);
        console.log('Player', me.player);
        //console.log('Player Bullets', playerBullets);
        //console.log('max left', me.ec.maxLeft);
    }

    function isLaunched(){
        return !!launched;
    }

    function toggleLaunched(){
        launched = !launched;
    }

    function setControlListeners(){
          window.keydown = {};

        function keyName(event) {
            return jQuery.hotkeys.specialKeys[event.which] ||
                String.fromCharCode(event.which).toLowerCase();
        }

        $(document).bind("keydown", function(event) {
            keydown[keyName(event)] = true;
        });

        $(document).bind("keyup", function(event) {
            keydown[keyName(event)] = false;
        });
        
        $('#pause').on('click', pauseGame);
        $('#restart').on('click', restartGame);
    }
    
    function init(){
        me.inited = true;
        setControlListeners();
    }

    this.gameOver = function(){
        clearInterval(gameInterval);
        toggleLaunched();
        me.canvas.clearRect(0, 0, me.CANVAS_WIDTH, me.CANVAS_HEIGHT);
        me.canvas.fillStyle = '#ff0000';
        me.canvas.font = '90px Tahoma';
        me.canvas.fillText('Game Over', 100,me.CANVAS_HEIGHT / 2);
    }

    this.schedule = function(fn, scope, msec){
        if ( me.abortSchedule )
            return;

        me.abortSchedule = true;

        setTimeout(function(){fn.call(scope || me);}, msec);
    }

    init();



    var g;
    var c;
    var stars1;
    var stars2;
    var stars3;
    var stars4;

    function star() {
        this.x = Math.floor(Math.random()*me.CANVAS_WIDTH);
        this.y = Math.floor(Math.random()*me.CANVAS_HEIGHT);
        this.move = function(speed) {
            this.y = this.y + speed;
            this.x = this.x - ( me.player.getCurrentSpeed() / ( speed ) / 2);
            if (this.y>me.CANVAS_HEIGHT) {
                this.y = 0;
                this.x = Math.floor(Math.random()*me.CANVAS_WIDTH);
            }
        }
        this.draw = function(colour, w, h) {
            me.canvas.fillStyle = colour;
            me.canvas.fillRect(this.x,this.y,w || 1, h || 1);
        }
    }

    function starlayer(count,speed,colour, w, h) {
        this.count = count;
        this.speed = speed;
        this.colour = colour;
        this.stars = new Array(this.count);
        for (i=0; i<this.count; i++) {
            this.stars[i] = new star();
        }
        this.move = function() {
            for (i=0; i<this.count; i++) {
                this.stars[i].move(this.speed);
            }
        }
        this.draw = function() {
            for (i=0; i<this.count; i++) {
                this.stars[i].draw(this.colour, w, h);
            }
        }
    }

    function do_render() {
        // clear canvas
        me.canvas.fillStyle = '#000000';
        me.canvas.fillRect(0,0, me.CANVAS_WIDTH, me.CANVAS_HEIGHT);

        stars1 = stars1 || new starlayer(30,6,"#eee",1, 3);
        stars2 = stars2 || new starlayer(30,4,"#ccc");
        stars3 = stars3 || new starlayer(60,1,"#888");
        stars4 = stars4 || new starlayer(1,1,"#ffea00",4,4 );

        stars1.move();
        stars2.move();
        stars3.move();
        stars4.move();

        stars3.draw();
        stars2.draw();
        stars1.draw();
        stars4.draw();

    }

}