(function () {
  var isOwnProperty = (function () {
    var hasOwn = Object.prototype.hasOwnProperty;

    if (typeof hasOwn == "function" && Function.prototype.call) {
      return function (object, property) {
        return hasOwn.call(object, property);
      };
    } else {
      return function (object, property) {
        var value = object[property];

        if (typeof value == "undefined") {
          return false;
        }

        return Object.prototype[property] !== value;
      };
    }
  }());

  if (!Object.each) {
    Object.each = (function () {
      // Troublesome object properties
      var oDontEnums = ["toString", "toLocaleString", "valueOf",
                        "hasOwnProperty", "isPrototypeOf",
                        "constructor", "propertyIsEnumerable"];

      // Troublesome function properties
      var fDontEnums = ["call", "apply", "prototype"];
      fDontEnums = oDontEnums.concat(fDontEnums);

      var needsFix = true;
      var object = { toString: 1 };

      // If we can loop this property, we don't need the fix
      // This test is only performed once - when the function is
      // defined
      for (var prop in object) {
        if (isOwnProperty(object, prop)) {
          needsFix = false;
        }
      }

      // The each function
      return function (object, callback) {
        if (typeof callback != "function") {
          throw new TypeError("Please provide a callback");
        }

        if (!object) {
          return;
        }

        // Normal loop, should expose all enumerable properties
        // in conforming browsers
        for (var prop in object) {
          if (isOwnProperty(object, prop)) {
            callback(prop, object[prop]);
          }
        }

        // Internet Explorer
        if (needsFix) {
          var properties = typeof object == "function" ?
            fDontEnums : oDontEnums;
          var property;

          for (var i = 0, l = properties.length; i < l; i++) {
            property = properties[i];

            if (isOwnProperty(object, property)) {
              callback(property, object[property]);
            }
          }
        }
      }
    }());
  }

  if (!Object.extend) {
    Object.extend = (function () {
      function extend (target, source) {
        target = target || {};

        if (!source) {
          return target;
        }

        Object.each(source, function (prop, val) {
          target[prop] = val;
        });

        return target;
      }

      return extend;
    }());
  }

  if (!Object.create) {
    Object.create = function (object) {
      function F () {};
      F.prototype = object;

      return new F;
    };
  }
}());
