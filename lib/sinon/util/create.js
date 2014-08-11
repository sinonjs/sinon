function create(proto) {
    var F = function () {};
    F.prototype = proto;
    return new F();
};

module.exports = create;
