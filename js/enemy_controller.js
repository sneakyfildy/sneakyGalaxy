function EnemiesController(config){
    config = config || {};
    var me = this;
    me = apply(me, config);
    var game = me.game;
    this.initCount      = 20;
    this.inRowCount     = 10;

    this.eW             = 32;
    this.eH             = 32;
    this.indOffsetLeft  = 10;

    this.downLen        = 32;

    this.totalEnemies = 50;

    this.currentDirX = 'left';
    this.currentDirY = false;

    this.currentDownLevel = 0;

    this.enemies = this.enemies || [];

    this.bullets = this.bullets || [];

    this.init = function(){
        me.createEnemies();
    }

    this.getDirection = function(){
        return {
            x   : me.currentDirX
            ,y  : me.currentDirY
        }
    }

    this.switchDirectionX = function(){
        me.currentDirX = (me.currentDirX == game.LEFT) ? game.RIGHT : game.LEFT;
        me.toggleDown();
    }
    this.switchDirectionY = function(){
        me.currentDirY = (me.currentDirY == game.UP) ? game.DOWN : game.UP;
    }
    this.abortDirectionY = function(){
        me.currentDirY = false;
    }
    this.toggleDown     = function(){
        me.currentDirY = game.DOWN;
        me.currentDownLevel++;
    }

    this.getEnemyPos = function(){
        var x = 0
            ,y = 10
            ,currentCount = me.enemies.length;

        if ( currentCount < me.inRowCount ){
            x = currentCount * ( me.eW + me.indOffsetLeft ) + me.indOffsetLeft;
        }else{
            var rowCount = Math.floor( currentCount / me.inRowCount );
            var currentRowCount = currentCount - ( rowCount * me.inRowCount );
            y += rowCount * ( me.eH + me.indOffsetLeft);
            x = currentRowCount * ( me.eW + me.indOffsetLeft ) + me.indOffsetLeft;
        }

        return {
            x   : x
            ,y  : y
        }
    }

    this.createEnemies = function(count){
        game.abortSchedule = false;
        count = count || me.initCount || 30;

        for (var i = 0; i < count; i++){
            me.enemies.push( new Enemy(i, {
                game    : me.game
                ,type    : me.getType()
            }) );

            me.totalEnemies++;
        }

        game.stat.stats.waveCount++;
    };

    this.getType    = function(){
        var x = me.totalEnemies;//me.game.stat.getWave() * 20;

        var type;

        /*if (wave < 3){
            type = 1;
        }else if (wave < 10 ){
            type = getRandom(1,2)
        }else{
            type = getRandom(1,3);
        }
        */
       //type = Math.round(Math.abs((x/70)*Math.cos(x/70))) || 1;
        //type = Math.round(Math.abs( (x/80) * Math.cos(x / 8) )) || 1;
        //console.log('enemy type: ' + type);
        type = getRandom(1,5);
        return type;
    }


    this.checkUpdateCount = function(){
        if (!me.enemies || me.enemies.length <= 0){
            me.resetEnemyGroupPos();
            game.schedule(me.createEnemies, me, 2000);
        }
    }

    this.resetEnemyGroupPos = function(){
        me.currentDirX = game.LEFT;
        me.currentDirY = false;
        me.currentDownLevel = 0;
        me.maxLeft = 0;
        me.minLeft = 99999;
    }

    this.restart = function(){
        deleteAllEnemies();
    }

    function deleteAllEnemies(){
        me.enemies.forEach(function(enemy){
            enemy.setInactive();
        });
    }
}