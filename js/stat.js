function Stat(config){
    config = config || {};
    var me = this;
    me = apply(me, config);

    this.stats = {
        score       : 0
        ,bullet     : 0
        ,hit        : 0
        ,accuracy   : '0%'
        ,waveCount  : 0
    };

    this.statEl = config.el;

    var game = me.game;

    this.addScore = function(score){
        if ( $.isNumeric(score) ){
            me.stats.score += score;
            me.updateStat();
        }
    }

    this.addBullet = function(){
        ++me.stats.bullet;
        me.stats.accuracy = ( ( me.stats.hit / me.stats.bullet ) * 100).toFixed(2) + '%';
        me.updateStat();
    }

    this.addHit = function(){
        ++me.stats.hit;
        me.stats.accuracy = ( ( me.stats.hit / me.stats.bullet ) * 100).toFixed(2) + '%';
        me.updateStat();
    }

    this.updateStat = function(){
        me.statPanels.forEach(function(panel){
            panel.$el[0].textContent = me.stats[panel.id];
        });

        game.player.updateStat();
    }

    this.initStat = function(){
        var $childs = $(me.statEl).find('.gameStat');
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

    this.restart = function(){
        this.stats = {
            score   : 0
        };
    }

    this.getWave = function(){
        return this.stats.waveCount;
    }
    
}