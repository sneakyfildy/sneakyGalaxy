function Player(config){
    var me = this;
    me = apply(me, config);

    var game = me.game;
    var canvas = game.canvas;

    this.color = "#00A";
    this.width = 30;
    this.height = 30;
    this.x = this.game.CANVAS_WIDTH / 2 - this.width / 2;
    this.y = this.game.CANVAS_HEIGHT - this.height - 5;
    this.sprite = Sprite("player");
    //this.sprite = new AniSprite('images/sprites.png', [0, 78], [80, 39],
    //                           6, [0, 1, 2, 3, 2, 1]);
    this.bullets = this.bullets || [];

    this.stats = {
        lvl                 : 1
        ,exp                : 0
        ,nextLvl            : 20
        ,bspeed             : 10//3
        ,speed              : 400//40
        ,rtime              : 0.2//1.6
        ,lvlCap             : 60
        ,acc                : 0.05//0.05
        ,curSpeed           : 0
        ,lives              : 200
        ,maxBulletOffset    : 1.5
    }

    this.movement = {
        lastDir : 0
    };
    /*this.draw =  function() {
                canvas.fillStyle = me.color;
                canvas.fillRect(me.x, me.y, me.width, me.height);
            };*/
    this.draw = function() {
        me.sprite.draw(canvas, this.x, this.y);
    };

    this.shoot = function() {
        //Sound.play("shoot");
        var currentTime = new Date().getTime() / 1000;
        var delta = ( currentTime - ( me.fired || 0 ) ).toFixed(3);

        if ( delta < me.stats.rtime )
            return;

        me.fired = new Date().getTime() / 1000;

        var bulletPosition = me.midpoint();

        me.bullets.push(new Bullet({
            speed   : me.stats.bspeed || 3,
            x       : bulletPosition.x,
            y       : bulletPosition.y,
            pspeed  : me.getBulletPSpeed(),
            game    : me.game
        }));

        game.stat.addBullet();
    };

    this.move       = function(key){
        var dir = ( key.left ) ? -1 : (key.right) ? 1 : 0;


        var add
            ,acc = me.stats.acc;

        if ( dir !== 0 ){
            if ( dir > 0 && me.getCurrentSpeed() < 0 || dir < 0 && me.getCurrentSpeed() > 0 ){
                acc = acc * 5;
            }
            if ( ( Math.abs( me.getCurrentSpeed() ) <= Math.abs( me.getSpeed() ) ) ){
                add =   dir * acc + me.getCurrentSpeed();
                me.stats.curSpeed +=  dir * acc;
            }else{
                add = ( dir * me.getSpeed() );
                me.stats.curSpeed = add;
            }
            me.movement.lastDir = dir;
        }else{
            add = ( Math.abs( me.getCurrentSpeed() ) > 0 ) ? ( me.movement.lastDir * acc * 2  + me.getCurrentSpeed() ) : 0;
            if ( me.movement.lastDir > 0 && me.getCurrentSpeed() <= 0){
                me.stats.curSpeed = 0;
            }else if(me.movement.lastDir < 0 && me.getCurrentSpeed() >= 0){
                me.stats.curSpeed = 0;
            }else{
                me.stats.curSpeed -= me.movement.lastDir * acc * 2;
            }
        }

        if ( dir === 0 && ( me.x === 0 || ( me.x === me.game.CANVAS_WIDTH - me.width ) ) ){
            add = 0;
            me.stats.curSpeed = 0;
        }

        me.x += add;
    }

    this.midpoint = function() {
        return {
            x: me.x + me.width / 2,
            y: me.y - me.height / 2 + 10
        };
    }

    this.onHit = function() {
        --me.stats.lives;
        me.updateStat();

        if ( me.stats.lives <= 0 ){
            me.explode();
            return;
        }

        console.log('player hit');
    };

    this.explode = function() {
        me.active = false;
        me.game.gameOver();
        console.log('player explode');
    // Extra Credit: Add an explosion graphic and then end the game
    };

    this.getSpeed = function(){
        me.speedMod = me.speedMod || 1;
        me.stats.speed = ( $.isNumeric(me.stats.speed) ) ? me.stats.speed : 5;
        return me.stats.speed * me.speedMod  * game.gt.dt;
    }

    this.getCurrentSpeed = function(){
        return (me.stats.curSpeed) || 0;
    }


    this.addExp = function(exp){
        this.stats.exp += parseInt(exp);
        if ( this.stats.exp >= this.stats.nextLvl && this.stats.lvl < this.stats.lvlCap ){
            levelUp();
        }
    }

    function levelUp(){
        me.stats.lvl++;
        me.incStats();
        me.stats.nextLvl = me.stats.nextLvl || 0;
        me.stats.nextLvl = me.stats.nextLvl = Math.floor( ( me.stats.nextLvl + ( me.stats.nextLvl / ( me.stats.lvl * 0.5 ) ) + me.stats.lvl * 2 ) ); //Math.floor( ( me.stats.lvl + me.stats.nextLvl ) * ( me.stats.lvl * 0.5 ) );

    }

    this.incStats = function(){
        this.stats.speed += 0.92;   //60
        this.stats.rtime -= 0.024;  //60
        this.stats.bspeed += 0.05;  //60
    }

    this.initStat = function(){
        var $childs = $(game.stat.statEl).find('.playerStat');
        me.statPanels = [];

        $childs.each(function(){
            var $child = $(this);
            me.statPanels.push({
                $el  : $child.find('.value')
                ,id : $child.get(0).id
            });
        });

        me.updateStat();
    }

    this.updateStat = function(){
        me.statPanels && me.statPanels.forEach(function(panel){
            panel.$el[0].textContent = me.stats[panel.id];
        });
    }

    this.getBulletPSpeed = function(){
        var cs = me.getCurrentSpeed();

        return Math.abs(cs) < Math.abs(me.stats.maxBulletOffset) ? cs : me.stats.maxBulletOffset;
    };

    this.restart = function(){
        this.color = "#00A";
        this.width = 30;
        this.height = 30;
        this.x = this.game.CANVAS_WIDTH / 2 - this.width / 2;
        this.y = this.game.CANVAS_HEIGHT - this.height - 5;
        this.sprite = Sprite("player");
        this.bullets = [];
        this.reloadTime = 0.1;

        me.active = true;
    }

}