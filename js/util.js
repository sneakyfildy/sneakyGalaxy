/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * <pre>
 * (x * 255).clamp(0, 255)
 * </pre>
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

var global = this,
objectPrototype = Object.prototype,
toString = objectPrototype.toString,
enumerables = true,
enumerablesTest = {
    toString: 1
},
emptyFn = function () {},
i;

for (i in enumerablesTest) {
    enumerables = null;
}

if (enumerables)
    enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
        'toLocaleString', 'toString', 'constructor'];

Object.prototype.objToArr = function(obj){
    var arr = [];
    for (var key in obj){
        arr.push(obj[key]);
    }

    return arr;
}

function applyIf(object, config) {
    var property;

    if (object) {
        for (property in config) {
            if (object[property] === undefined) {
                object[property] = config[property];
            }
        }
    }

    return object;
}

function apply(object, config, defaults) {
    if (defaults) {
        Ext.apply(object, defaults);
    }

    if (object && config && typeof config === 'object') {
        var i, j, k;

        for (i in config) {
            object[i] = config[i];
        }

        if (enumerables) {
            for (j = enumerables.length; j--;) {
                k = enumerables[j];
                if (config.hasOwnProperty(k)) {
                    object[k] = config[k];
                }
            }
        }
    }

    return object;
}
String.prototype.format = function() {
    var s = String(this),
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

function getRandom(min, max){
    var rand = min + Math.random() * (max + 1 - min);
    return rand^0;
}

