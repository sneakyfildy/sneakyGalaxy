function Bullet(config) {
    config = config || {};
    var me = this;
    me = apply(me, config);
    
    var game = me.game;
    var canvas = game.canvas;

    this.active = true;

    this.xVelocity = this.pspeed / 2 || 0;
    this.yVelocity = -this.speed;
    this.width = 3;
    this.height = 7;
    this.color = "#fff";

    this.inBounds = function() {
        return me.x >= 0 && me.x <= game.CANVAS_WIDTH &&
        me.y >= 0 && me.y <= game.CANVAS_HEIGHT;
    };

    this.draw = function() {
        canvas.fillStyle = this.color;
        canvas.fillRect(me.x, me.y, me.width, me.height);
    };

    this.update = function() {
        me.x += me.xVelocity;
        me.y += me.yVelocity;

        me.active = me.active && me.inBounds();
    };

    this.explode = function() {
        me.active = false;
    // Extra Credit: Add an explosion graphic
    };
}
