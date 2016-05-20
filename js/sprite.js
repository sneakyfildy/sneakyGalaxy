(function() {
  function LoaderProxy() {
    return {
      draw: $.noop,
      fill: $.noop,
      frame: $.noop,
      update: $.noop,
      width: null,
      height: null
    };
  }
  
  function Sprite(image, sourceX, sourceY, width, height) {
    sourceX = sourceX || 0;
    sourceY = sourceY || 0;
    width = width || image.width;
    height = height || image.height;
    
    return {
      draw: function(canvas, x, y) {
        canvas.drawImage(
          image,
          sourceX,
          sourceY,
          width,
          height,
          x,
          y,
          width,
          height
        );
      },
      
      fill: function(canvas, x, y, width, height, repeat) {
        repeat = repeat || "repeat";
        var pattern = canvas.createPattern(image, repeat);
        canvas.fillColor(pattern);
        canvas.fillRect(x, y, width, height);
      },
      
      width: width,
      height: height
    };
  };
  
  Sprite.load = function(url, loadedCallback) {
    var img = new Image();
    var proxy = LoaderProxy();
    
    img.onload = function() {
      var tile = Sprite(this);
      
      $.extend(proxy, tile);
      
      if(loadedCallback) {
        loadedCallback(proxy);
      }
    };
    
    img.src = url;
    
    return proxy;
  };
 
  var spriteImagePath = "images/";

  window.Sprite = function(name, callback) {
    return Sprite.load(spriteImagePath + name + ".png", callback);
  };
  window.Sprite.EMPTY = LoaderProxy();
  window.Sprite.load = Sprite.load;

    function AniSprite(url, pos, size, speed, frames, dir, once) {
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.once = once;
    };

    AniSprite.prototype.update = function(dt) {
        this._index += this.speed*dt;
    }

    AniSprite.prototype.render = function(ctx) {
        var frame;

        if(this.speed > 0) {
            var max = this.frames.length;
            var idx = Math.floor(this._index);
            frame = this.frames[idx % max];

            if(this.once && idx >= max) {
                this.done = true;
                return;
            }
        }
        else {
            frame = 0;
        }


        var x = this.pos[0];
        var y = this.pos[1];

        if(this.dir == 'vertical') {
            y += frame * this.size[1];
        }
        else {
            x += frame * this.size[0];
        }

        ctx.drawImage(resources.get(this.url),
                      x, y,
                      this.size[0], this.size[1],
                      0, 0,
                      this.size[0], this.size[1]);
    }

    window.AniSprite = AniSprite;
}());
