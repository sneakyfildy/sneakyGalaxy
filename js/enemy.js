function Enemy(index, config) {
    config = config || {};
    
    var me = this;
    me = apply(me, config);

    var game = me.game;
    var ec = game.ec;
    var canvas = game.canvas;
    this.index = index;
    this.active = true;
    this.age = Math.floor(Math.random() * 128);

    this.types = {
        'lev1'  : {
            colors : ["#555", '#aaa', '#ccc']
            ,lives  : 1
            ,score  : 10
            ,exp    : 1
        }
        ,'lev2'  : {
            colors  : ["#87a841", '#b0db53', '#cbff6b']
            ,lives  : 3
            ,score  : 20
            ,exp    : 5
        }
        ,'lev3'  : {
            colors : ["#910000", '#cb0000', '#ff0000']
            ,lives  : 6
            ,score  : 100
            ,exp    : 10
        }
        ,'lev4'  : {
            colors : ["#00ccff"]
            ,lives  : 6
            ,score  : 100
            ,exp    : 10
        }
        ,'lev5'  : {
            colors : ["#ffff00"]
            ,lives  : 6
            ,score  : 100
            ,exp    : 10
        }
    }

    this.ct = this.types['lev' + this.type];
    this.score = 50;
    
    var eCoords = ec.getEnemyPos();
    this.x = eCoords.x; //CANVAS_WIDTH / 4 + Math.random() * CANVAS_WIDTH / 2;
    this.y = eCoords.y;
    this.xVelocity = 1;
    this.yVelocity = 3;

    this.width = ec.eW;
    this.height = ec.eH;

    this.noGraphic = true;
    
    this.inBounds = function() {
        return me.x >= 0 && me.x <= me.game.CANVAS_WIDTH &&
        me.y >= 0 && me.y <= me.game.CANVAS_HEIGHT - ec.eH;
    };

    this.sprite = Sprite("enemy");

    this.draw = !this.noGraphic ?
        function() {
            me.sprite.draw(canvas, this.x, this.y);
        }   :
        function() {
            canvas.font = "20px Tahoma";
            canvas.fillStyle = me.ct.defColor || me.ct.colors[ me.ct.colors.length - 1 ];
            canvas.fillRect(me.x, me.y, me.width, me.height);
            canvas.fillStyle = '#000';
            me.ct.lives > 0 && canvas.fillText(me.ct.lives, me.x + 5, me.y + me.height - 10);
        };

    this.update = function() {

        if ( ( ec.maxLeft > me.game.CANVAS_WIDTH - me.game.ENEMY_GROUP_OFFSET_X - ec.eW ) && ec.getDirection().x !== me.game.RIGHT ){
            ec.switchDirectionX();
        }
        if ( ( ec.minLeft < me.game.ENEMY_GROUP_OFFSET_X ) && ec.getDirection().x !== me.game.LEFT ){
            ec.switchDirectionX();
        }

        if ( !(ec.getDirection().y == me.game.DOWN)){
            if ( ec.getDirection().x == me.game.LEFT ){
                me.x += me.xVelocity;
            }else{
                me.x -= me.xVelocity;
            }
        }

        if ( ec.getDirection().y == me.game.DOWN ){
            me.totalDown = me.totalDown || 0;
            me.y += me.yVelocity;
            me.totalDown += me.yVelocity;

            if ( me.totalDown > ec.currentDownLevel * ec.downLen && ( me.index == ec.enemies.length - 1 ) ){
                ec.abortDirectionY();
            }
        }
        
        me.age++;
        if ( getRandom(1, 1000) > 990 ){
           //me.shoot();
        }
        
        me.active = me.active && me.inBounds();
    };

    this.shoot = function() {
        //Sound.play("shoot");

        var bulletPosition = me.shootpoint();

        ec.bullets.push(new Bullet({
            speed   : -2,
            x       : bulletPosition.x,
            y       : bulletPosition.y,
            pspeed  : me.xVelocity,
            game    : me.game
        }));
    };

    this.onHit      = function(){
        game.stat.addHit();
        --this.ct.lives;

        if ( me.ct.lives <= 0 ){
            me.explode();
            return;
        }

        me.ct.defColor = me.ct.colors[ me.ct.lives < me.ct.colors.length ? me.ct.lives : me.ct.colors.length - 1 ];

    }
    
    this.explode = function() {
        //Sound.play("explosion");
        me.active && game.player.addExp(me.ct.exp);
        me.active && game.stat.addScore(me.ct.score);
        me.active = false;
    // Extra Credit: Add an explosion graphic
    };

    this.setInactive = function(){
        me.active = false;
    }

    this.midpoint = function() {
        return {
            x: me.x + me.width / 2,
            y: me.y - me.height / 2
        };
    }
    this.shootpoint = function() {
        return {
            x: me.x + me.width / 2,
            y: me.y + me.height
        };
    }
}