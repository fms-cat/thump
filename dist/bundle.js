(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Yutaka/Dropbox/pro/JavaScript/thump/src/script/eightbit.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ditherPattern = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

var dither = function dither(v, m, x, y) {
  var p = ditherPattern[x % 4 + y % 4 * 4] / 16.0;
  return ~~(v * m + p);
};

exports.default = function (data) {
  var ret = new Uint8Array(65536);
  for (var i = 0; i < 65536; i++) {
    var x = i % 256;
    var y = ~~(i / 256);

    ret[i] = data[i * 4 + 3] < 127 ? 0 : 16 + dither(data[i * 4 + 0] / 255.0, 5, x, y) * 1 + dither(data[i * 4 + 1] / 255.0, 5, x, y) * 6 + dither(data[i * 4 + 2] / 255.0, 5, x, y) * 36;
  }
  return ret;
};

},{}],"/Users/Yutaka/Dropbox/pro/JavaScript/thump/src/script/main.js":[function(require,module,exports){
"use strict";

var _thump = require("./thump");

var _thump2 = _interopRequireDefault(_thump);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var thump = new _thump2.default(document.getElementById("canvas"));

textareaCode.value = "pi $x, si 0 // $x = 0\npi $y, si 0 // $y = 0\npi $0, si 0 // $0 = 0\npi $1, si 1 // $1 = 1\n\n@loop\npi $c, si 0, rnd $c // $c = random()\nx $x, y $y, zi 4, s $c // set $c to ($x, $y, 4 (=red buffer))\n\npi $x, add $1 // $x += 1\npi $x, seq $0, j @loop // if x != 0 then jump to @loop\n\npi $_, si 10, w $_ // wait for 10ms\n\npi $y, add $1 // $y += 1\nj @loop // jump to @loop\n";

thump.run(textareaCode.value);

// ------

thump.setLogFunc(function (num) {
  if (15 === divConsole.childElementCount) {
    divConsole.removeChild(divConsole.firstChild);
  }

  var d = document.createElement("div");
  d.classList.add("divLog");
  d.innerText = num;
  divConsole.appendChild(d);
});

// ------

var escListener = function escListener(event) {
  if (event.which === 27) {
    thump.stop();
  }
};
window.addEventListener("keydown", escListener);

// ------

buttonRun.addEventListener("click", function () {
  while (0 !== divConsole.childElementCount) {
    divConsole.removeChild(divConsole.firstChild);
  }

  thump.run(textareaCode.value);
  thump.init();
  thump.saveFrameMax = 0;
});

buttonRedice.addEventListener("click", function () {
  while (0 !== divConsole.childElementCount) {
    divConsole.removeChild(divConsole.firstChild);
  }

  thump.redice();
  thump.init();
  thump.saveFrameMax = 0;
});

buttonSave.addEventListener("click", function () {
  while (0 !== divConsole.childElementCount) {
    divConsole.removeChild(divConsole.firstChild);
  }

  thump.init();
  thump.saveFrameMax = 300;
});

},{"./thump":"/Users/Yutaka/Dropbox/pro/JavaScript/thump/src/script/thump.js"}],"/Users/Yutaka/Dropbox/pro/JavaScript/thump/src/script/palette256.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = [0x000000, 0x800000, 0x008000, 0x808000, 0x000080, 0x800080, 0x008080, 0xc0c0c0, 0x808080, 0xff0000, 0x00ff00, 0xffff00, 0x0000ff, 0xff00ff, 0x00ffff, 0xffffff, 0x000000, 0x00005f, 0x000087, 0x0000af, 0x0000d7, 0x0000ff, 0x005f00, 0x005f5f, 0x005f87, 0x005faf, 0x005fd7, 0x005fff, 0x008700, 0x00875f, 0x008787, 0x0087af, 0x0087d7, 0x0087ff, 0x00af00, 0x00af5f, 0x00af87, 0x00afaf, 0x00afd7, 0x00afff, 0x00d700, 0x00d75f, 0x00d787, 0x00d7af, 0x00d7d7, 0x00d7ff, 0x00ff00, 0x00ff5f, 0x00ff87, 0x00ffaf, 0x00ffd7, 0x00ffff, 0x5f0000, 0x5f005f, 0x5f0087, 0x5f00af, 0x5f00d7, 0x5f00ff, 0x5f5f00, 0x5f5f5f, 0x5f5f87, 0x5f5faf, 0x5f5fd7, 0x5f5fff, 0x5f8700, 0x5f875f, 0x5f8787, 0x5f87af, 0x5f87d7, 0x5f87ff, 0x5faf00, 0x5faf5f, 0x5faf87, 0x5fafaf, 0x5fafd7, 0x5fafff, 0x5fd700, 0x5fd75f, 0x5fd787, 0x5fd7af, 0x5fd7d7, 0x5fd7ff, 0x5fff00, 0x5fff5f, 0x5fff87, 0x5fffaf, 0x5fffd7, 0x5fffff, 0x870000, 0x87005f, 0x870087, 0x8700af, 0x8700d7, 0x8700ff, 0x875f00, 0x875f5f, 0x875f87, 0x875faf, 0x875fd7, 0x875fff, 0x878700, 0x87875f, 0x878787, 0x8787af, 0x8787d7, 0x8787ff, 0x87af00, 0x87af5f, 0x87af87, 0x87afaf, 0x87afd7, 0x87afff, 0x87d700, 0x87d75f, 0x87d787, 0x87d7af, 0x87d7d7, 0x87d7ff, 0x87ff00, 0x87ff5f, 0x87ff87, 0x87ffaf, 0x87ffd7, 0x87ffff, 0xaf0000, 0xaf005f, 0xaf0087, 0xaf00af, 0xaf00d7, 0xaf00ff, 0xaf5f00, 0xaf5f5f, 0xaf5f87, 0xaf5faf, 0xaf5fd7, 0xaf5fff, 0xaf8700, 0xaf875f, 0xaf8787, 0xaf87af, 0xaf87d7, 0xaf87ff, 0xafaf00, 0xafaf5f, 0xafaf87, 0xafafaf, 0xafafd7, 0xafafff, 0xafd700, 0xafd75f, 0xafd787, 0xafd7af, 0xafd7d7, 0xafd7ff, 0xafff00, 0xafff5f, 0xafff87, 0xafffaf, 0xafffd7, 0xafffff, 0xd70000, 0xd7005f, 0xd70087, 0xd700af, 0xd700d7, 0xd700ff, 0xd75f00, 0xd75f5f, 0xd75f87, 0xd75faf, 0xd75fd7, 0xd75fff, 0xd78700, 0xd7875f, 0xd78787, 0xd787af, 0xd787d7, 0xd787ff, 0xd7af00, 0xd7af5f, 0xd7af87, 0xd7afaf, 0xd7afd7, 0xd7afff, 0xd7d700, 0xd7d75f, 0xd7d787, 0xd7d7af, 0xd7d7d7, 0xd7d7ff, 0xd7ff00, 0xd7ff5f, 0xd7ff87, 0xd7ffaf, 0xd7ffd7, 0xd7ffff, 0xff0000, 0xff005f, 0xff0087, 0xff00af, 0xff00d7, 0xff00ff, 0xff5f00, 0xff5f5f, 0xff5f87, 0xff5faf, 0xff5fd7, 0xff5fff, 0xff8700, 0xff875f, 0xff8787, 0xff87af, 0xff87d7, 0xff87ff, 0xffaf00, 0xffaf5f, 0xffaf87, 0xffafaf, 0xffafd7, 0xffafff, 0xffd700, 0xffd75f, 0xffd787, 0xffd7af, 0xffd7d7, 0xffd7ff, 0xffff00, 0xffff5f, 0xffff87, 0xffffaf, 0xffffd7, 0xffffff, 0x080808, 0x121212, 0x1c1c1c, 0x262626, 0x303030, 0x3a3a3a, 0x444444, 0x4e4e4e, 0x585858, 0x626262, 0x6c6c6c, 0x767676, 0x808080, 0x8a8a8a, 0x949494, 0x9e9e9e, 0xa8a8a8, 0xb2b2b2, 0xbcbcbc, 0xc6c6c6, 0xd0d0d0, 0xdadada, 0xe4e4e4, 0xeeeeee];

},{}],"/Users/Yutaka/Dropbox/pro/JavaScript/thump/src/script/thump-defs.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (Thump, thump) {
  thump.def("v", function (param) {
    // void
    thump.set16b(Thump.P_CNT, 65536 - 2);
    return 1;
  });

  thump.def("w", function (param) {
    // wait a while
    return thump.get(param);
  });

  thump.def("pi", function (param) {
    // set pointer immediately
    thump.set(Thump.P_X, param);
    thump.set(Thump.P_Y, 0);
    thump.set(Thump.P_Z, 0);
  });

  thump.def("p", function (param) {
    // set pointer
    thump.set(Thump.P_X, thump.get(param));
    thump.set(Thump.P_Y, 0);
    thump.set(Thump.P_Z, 0);
  });

  thump.def("x", function (param) {
    // set x
    thump.set(Thump.P_X, thump.get(param));
  });

  thump.def("xi", function (param) {
    // set x immediately
    thump.set(Thump.P_X, param);
  });

  thump.def("y", function (param) {
    // set y
    thump.set(Thump.P_Y, thump.get(param));
  });

  thump.def("yi", function (param) {
    // set y immediately
    thump.set(Thump.P_Y, param);
  });

  thump.def("z", function (param) {
    // set z
    thump.set(Thump.P_Z, thump.get(param));
  });

  thump.def("zi", function (param) {
    // set z immediately
    thump.set(Thump.P_Z, param);
  });

  thump.def("l", function (param) {
    // console log pointer
    thump.log(thump.get(param));
  });

  thump.def("lc", function (param) {
    // console log pointer (char)
    thump.log(String.fromCharCode(thump.get(param)));
  });

  thump.def("li", function (param) {
    // console log immediately
    console.log(param);
  });

  thump.def("lp", function () {
    // console log pointer
    console.log(thump.get(thump.pointer()));
  });

  thump.def("g", function (param) {
    // get
    thump.set(param, thump.get(thump.pointer()));
  });

  thump.def("s", function (param) {
    // set
    thump.set(thump.pointer(), thump.get(param));
  });

  thump.def("si", function (param) {
    // set immediately
    thump.set(thump.pointer(), param);
  });

  thump.def("sf", function (param) {
    // fill pointer value to length value
    var v = thump.get(thump.pointer());
    var l = thump.get(param) || 256;
    for (var i = 0; i < l; i++) {
      thump.set(thump.pointer() + i, v);
    }
  });

  thump.def("cp", function (param) {
    // copy buffer
    var dz = thump.get(Thump.P_Z) * 65536;
    var sz = thump.get(param) * 65536;
    for (var i = 0; i < 65536; i++) {
      thump.buf[dz + i] = thump.buf[sz + i];
    }
  });

  thump.def("cp8", function (param) {
    // copy buffer with 8bit palette
    var sz = thump.get(param) * 65536;
    for (var z = 0; z < 3; z++) {
      var dz = (thump.get(Thump.P_Z) + z) * 65536;
      for (var i = 0; i < 65536; i++) {
        var v = thump.buf[sz + i];
        if (v !== 0) {
          thump.buf[dz + i] = thump.buf[Thump.P_PLT + v + z * 256];
        }
      }
    }
  });

  thump.def("cpa", function (param) {
    // copy buffer rgba
    var az = (thump.get(param) + 3) * 65536;
    for (var z = 0; z < 3; z++) {
      var dz = (thump.get(Thump.P_Z) + z) * 65536;
      var sz = (thump.get(param) + z) * 65536;
      for (var i = 0; i < 65536; i++) {
        var a = thump.buf[az + i] / 255.0;
        thump.buf[dz + i] = (1.0 - a) * thump.buf[dz + i] + a * thump.buf[sz + i];
      }
    }
  });

  thump.def("sp", function (param) {
    // sprite
    var sp = thump.get(param);
    sp = sp % 16 * 16 + ~~(sp / 16) * 4096;
    var pos = thump.get16b(Thump.P_X);

    var sz = thump.get(Thump.P_SPR) * 65536;
    var dz = thump.get(Thump.P_Z) * 65536;
    for (var y = 0; y < 16; y++) {
      for (var x = 0; x < 16; x++) {
        var p = x + y * 256;
        var s = p + sp + sz;
        var d = p + pos + dz;
        thump.buf[d] = thump.buf[s];
      }
    }
  });

  thump.def("sp8", function (param) {
    // sprite
    var sp = thump.get(param);
    sp = sp % 16 * 16 + ~~(sp / 16) * 4096;
    var pos = thump.get16b(Thump.P_X);

    var sz = thump.get(Thump.P_SPR) * 65536;
    for (var z = 0; z < 3; z++) {
      var dz = (thump.get(Thump.P_Z) + z) * 65536;
      for (var y = 0; y < 16; y++) {
        for (var x = 0; x < 16; x++) {
          var p = x + y * 256;
          var s = p + sp + sz;
          var d = p + pos + dz;
          var v = thump.buf[s];
          if (v !== 0) {
            thump.buf[d] = thump.buf[Thump.P_PLT + v + z * 256];
          }
        }
      }
    }
  });

  thump.def("spa", function (param) {
    // sprite rgba
    var sp = thump.get(param);
    sp = sp % 16 * 16 + ~~(sp / 16) * 4096;
    var pos = thump.get16b(Thump.P_X);

    var az = (thump.get(Thump.P_SPR) + 3) * 65536;
    for (var z = 0; z < 3; z++) {
      var sz = (thump.get(Thump.P_SPR) + z) * 65536;
      var dz = (thump.get(Thump.P_Z) + z) * 65536;
      for (var y = 0; y < 16; y++) {
        for (var x = 0; x < 16; x++) {
          var p = x + y * 256;
          var s = p + sp + sz;
          var d = p + pos + dz;
          var a = thump.buf[p + sp + az] / 255.0;
          thump.buf[d] = (1.0 - a) * thump.buf[d] + a * thump.buf[s];
        }
      }
    }
  });

  thump.def("add", function (param) {
    // add value
    thump.set(thump.pointer(), thump.get(thump.pointer()) + thump.get(param));
  });

  thump.def("sub", function (param) {
    // sub value
    thump.set(thump.pointer(), thump.get(thump.pointer()) - thump.get(param));
  });

  thump.def("mul", function (param) {
    // mul value
    thump.set(thump.pointer(), thump.get(thump.pointer()) * thump.get(param));
  });

  thump.def("div", function (param) {
    // div value
    thump.set(thump.pointer(), thump.get(thump.pointer()) / thump.get(param));
  });

  thump.def("mod", function (param) {
    // mod value
    thump.set(thump.pointer(), thump.get(thump.pointer()) % thump.get(param));
  });

  thump.def("sin", function (param) {
    // sin value
    thump.set(thump.pointer(), thump.get(thump.get(param) + Thump.P_SIN));
  });

  thump.def("rnd", function (param) {
    // set value random
    var v = thump.get(param);
    thump.set(thump.pointer(), thump.xorshift.gen() * (v ? v : 256));
  });

  thump.def("rns", function (param) {
    // set random seed
    thump.xorshift.gen(thump.get(param));
  });

  thump.def("j", function (param) {
    // jump to pointer
    thump.set16b(Thump.P_CNT, thump.get16b(Thump.P_JMP + param * 2) + 65536 - 2);
  });

  thump.def("seq", function (param) {
    // skip if pointer equals param
    if (thump.get(thump.pointer()) === thump.get(param)) {
      thump.set16b(Thump.P_CNT, thump.get16b(Thump.P_CNT) + 2);
    }
  });

  thump.def("sne", function (param) {
    // skip if pointer not equals param
    if (thump.get(thump.pointer()) !== thump.get(param)) {
      thump.set16b(Thump.P_CNT, thump.get16b(Thump.P_CNT) + 2);
    }
  });

  thump.def("srt", function (param) {
    // sort
    var index = ~~(thump.pointer() / 256) * 256;
    for (var ii = 0; ii < thump.get(param); ii++) {
      for (var i = 0; i < 255; i++) {
        var a = thump.buf[index + i];
        var b = thump.buf[index + i + 1];
        if (b < a) {
          thump.buf[index + i + 1] = a;
          thump.buf[index + i] = b;
        }
      }
    }
  });

  thump.def("gzr", function (param) {
    // set gzr
    thump.set(Thump.P_GZR, thump.get(param));
  });

  thump.def("gzg", function (param) {
    // set gzg
    thump.set(Thump.P_GZG, thump.get(param));
  });

  thump.def("gzb", function (param) {
    // set gzb
    thump.set(Thump.P_GZB, thump.get(param));
  });

  thump.def("spt", function (param) {
    // set sprite table
    thump.set(Thump.P_SPR, thump.get(param));
  });

  thump.def("jpg", function (param) {
    // jpegize!!
    thump.stopped = true;
    var z = thump.get(Thump.P_Z);
    var d = thump.bgContext.getImageData(0, 0, 256, 256);
    for (var _i = 0; _i < 65536; _i++) {
      d.data[_i * 4 + 0] = thump.get(z * 65536 + _i);
      d.data[_i * 4 + 1] = thump.get((z + 1) * 65536 + _i);
      d.data[_i * 4 + 2] = thump.get((z + 2) * 65536 + _i);
      d.data[_i * 4 + 3] = 255;
    }
    thump.bgContext.putImageData(d, 0, 0);
    var url = thump.bgCanvas.toDataURL("image/jpeg", thump.get(param) / 256.0);
    var i = new Image();
    i.onload = function () {
      thump.bgContext.fillRect(0, 0, 256, 256);
      thump.bgContext.drawImage(i, 0, 0);
      var d = thump.bgContext.getImageData(0, 0, 256, 256);
      for (var _i2 = 0; _i2 < 65536; _i2++) {
        thump.set(z * 65536 + _i2, d.data[_i2 * 4 + 0]);
        thump.set((z + 1) * 65536 + _i2, d.data[_i2 * 4 + 1]);
        thump.set((z + 2) * 65536 + _i2, d.data[_i2 * 4 + 2]);
      }
      thump.stopped = false;
    };
    i.src = url;
  });
};

},{}],"/Users/Yutaka/Dropbox/pro/JavaScript/thump/src/script/thump.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _palette = require("./palette256");

var _palette2 = _interopRequireDefault(_palette);

var _eightbit = require("./eightbit");

var _eightbit2 = _interopRequireDefault(_eightbit);

var _xorshift = require("./xorshift");

var _xorshift2 = _interopRequireDefault(_xorshift);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Thump = function () {
  function Thump(_canvas) {
    _classCallCheck(this, Thump);

    var thump = this;

    // ------

    thump.seed = +new Date();
    thump.xorshift = new _xorshift2.default();

    // ------

    thump.bufLen = 256 * 256 * 256;
    thump.buf = new Uint8Array(thump.bufLen);

    // ------

    thump.canvas = _canvas;
    thump.canvas.width = 256;
    thump.canvas.height = 256;

    thump.context = thump.canvas.getContext("2d");
    thump.context.fillStyle = "#000";
    thump.context.fillRect(0, 0, 256, 256);
    thump.imageData = thump.context.getImageData(0, 0, 256, 256);

    // ------

    thump.bgCanvas = document.createElement("canvas");
    thump.bgCanvas.width = 256;
    thump.bgCanvas.height = 256;

    thump.bgContext = thump.bgCanvas.getContext("2d");

    // ------

    thump.saveFrameMax = 0;
    thump.saveFrameCount = 0;
    thump.saveAnchor = document.createElement("a");

    // ------

    thump.funcs = [];
    thump.funcMap = {};
    require("./thump-defs").default(Thump, thump);

    // ------

    thump.code = "v";
    thump.stopped = true;

    // ------

    thump.update();

    window.addEventListener("unload", function () {
      delete thump.buf;
      thump = null;
    });
  }

  _createClass(Thump, [{
    key: "get",
    value: function get(pointer) {
      var thump = this;
      return thump.buf[pointer % thump.bufLen];
    }
  }, {
    key: "get16b",
    value: function get16b(pointer) {
      var thump = this;
      return thump.get(pointer) + thump.get(pointer + 1) * 256;
    }
  }, {
    key: "set",
    value: function set(pointer, value) {
      var thump = this;
      thump.buf[pointer % thump.bufLen] = value;
    }
  }, {
    key: "set16b",
    value: function set16b(pointer, value) {
      var thump = this;
      thump.set(pointer, value);
      thump.set(pointer + 1, value / 256);
    }
  }, {
    key: "getCnt",
    value: function getCnt() {
      var thump = this;
      return thump.get16b(Thump.P_CNT);
    }
  }, {
    key: "setCnt",
    value: function setCnt(cnt) {
      var thump = this;
      thump.set16b(Thump.P_CNT, cnt);
    }
  }, {
    key: "pointer",
    value: function pointer() {
      var thump = this;
      return thump.get16b(Thump.P_X) + thump.get(Thump.P_Z) * 65536;
    }
  }, {
    key: "save",
    value: function save() {
      var thump = this;
      thump.saveFrameCount++;
      if (thump.saveFrameMax < thump.saveFrameCount) {
        return;
      }
      thump.saveAnchor.href = thump.canvas.toDataURL();
      thump.saveAnchor.download = ("0000" + thump.saveFrameCount).slice(-5) + ".png";
      thump.saveAnchor.click();
    }
  }, {
    key: "draw",
    value: function draw() {
      var thump = this;
      for (var i = 0; i < 65536; i++) {
        thump.imageData.data[i * 4 + 0] = thump.get(thump.get(Thump.P_GZR) * 65536 + i);
        thump.imageData.data[i * 4 + 1] = thump.get(thump.get(Thump.P_GZG) * 65536 + i);
        thump.imageData.data[i * 4 + 2] = thump.get(thump.get(Thump.P_GZB) * 65536 + i);
      }
      thump.context.putImageData(thump.imageData, 0, 0);
      thump.save();
    }
  }, {
    key: "def",
    value: function def(name, func) {
      var thump = this;
      thump.funcMap[name] = thump.funcs.length;
      thump.funcs.push(function (param) {
        // console.log( name, param );
        return func(param);
      });
    }
  }, {
    key: "log",
    value: function log(num) {
      console.log(num);
    }
  }, {
    key: "setLogFunc",
    value: function setLogFunc(func) {
      var thump = this;
      thump.log = func;
    }
  }, {
    key: "loadBuffer",
    value: function loadBuffer(url, loc, mode, callback) {
      var thump = this;
      var image = new Image();
      image.onload = function () {
        thump.bgContext.clearRect(0, 0, 256, 256);
        thump.bgContext.drawImage(image, 0, 0, 256, 256);
        var data = thump.bgContext.getImageData(0, 0, 256, 256);

        if (mode === 0) {
          for (var i = 0; i < 65536; i++) {
            thump.buf[loc * 65536 + i] = data.data[i * 4];
          }
        } else if (mode === 1) {
          var eightData = (0, _eightbit2.default)(data.data);
          for (var _i = 0; _i < 65536; _i++) {
            thump.buf[loc * 65536 + _i] = eightData[_i];
          }
        } else if (mode === 2) {
          for (var _i2 = 0; _i2 < 65536; _i2++) {
            thump.buf[(loc + 0) * 65536 + _i2] = data.data[_i2 * 4 + 0];
            thump.buf[(loc + 1) * 65536 + _i2] = data.data[_i2 * 4 + 1];
            thump.buf[(loc + 2) * 65536 + _i2] = data.data[_i2 * 4 + 2];
            thump.buf[(loc + 3) * 65536 + _i2] = data.data[_i2 * 4 + 3];
          }
        }

        if (typeof callback === "function") {
          callback();
        }
      };
      image.src = url;
    }
  }, {
    key: "interpret",
    value: function interpret(str, callback) {
      var thump = this;
      var prgEnd = 0;
      var addPrg = function addPrg(name, param) {
        thump.set(Thump.Z_PRG * 65536 + prgEnd, thump.funcMap[name]);
        thump.set(Thump.Z_PRG * 65536 + prgEnd + 1, param);
        prgEnd += 2;
      };

      var rows = str.split(/\n/);
      rows = rows.map(function (row) {
        return row.replace(/\/\/.*/, "");
      });
      var words = rows.reduce(function (prev, cur) {
        return prev.concat(cur.split(/,/));
      }, []);
      words = words.map(function (row) {
        return row.replace(/^\s+/, "");
      });
      words = words.map(function (row) {
        return row.replace(/\s+$/, "");
      });

      var labelCount = 0;
      var labels = {};

      var varCount = 0;
      var vars = {};

      var prgs = [];

      var loads = [];

      words.map(function (word, line) {
        word.replace(/^([a-zA-Z0-9]+)\s+\$((\$)?[a-zA-Z0-9-_]+)/, function () {
          // set instructions with variable
          var name = arguments.length <= 2 ? undefined : arguments[2];
          if (typeof vars[name] !== "number") {
            vars[name] = varCount;
            varCount += (arguments.length <= 3 ? undefined : arguments[3]) ? 2 : 1;
          }
          prgs.push([arguments.length <= 1 ? undefined : arguments[1], vars[name]]);
          word = "";
        });

        word.replace(/^([a-zA-Z0-9]+)\s+@([a-zA-Z0-9-_]+)$/, function () {
          // jump macro
          var name = arguments.length <= 2 ? undefined : arguments[2];
          if (!labels[name]) {
            labels[name] = { i: labelCount };
            labelCount++;
          }
          prgs.push([arguments.length <= 1 ? undefined : arguments[1], labels[name].i]);
          word = "";
        });

        word.replace(/^([a-zA-Z0-9]+)(\s+([0-9]+))?/, function () {
          // set instructions
          prgs.push([arguments.length <= 1 ? undefined : arguments[1], parseInt(arguments.length <= 3 ? undefined : arguments[3]) || 0]);
          word = "";
        });

        word.replace(/^#l\s+(\d+)\s+(\d+)\s+(.+)$/, function () {
          // buffer loader
          var flag = parseInt(arguments.length <= 1 ? undefined : arguments[1]);
          var loc = parseInt(arguments.length <= 2 ? undefined : arguments[2]);
          var url = arguments.length <= 3 ? undefined : arguments[3];
          loads.push([flag, loc, url]);
          word = "";
        });

        word.replace(/^@([a-zA-Z0-9-_]+)$/, function () {
          // inspect label position
          var name = arguments.length <= 1 ? undefined : arguments[1];
          if (!labels[name]) {
            labels[name] = { i: labelCount };
            labelCount++;
          }
          labels[name].p = prgs.length * 2;
          thump.set16b(Thump.P_JMP + labels[name].i * 2, labels[name].p);
          word = "";
        });
      });

      prgs.map(function (prg) {
        addPrg(prg[0], prg[1]);
      });

      if (loads.length === 0) {
        if (typeof callback === "function") {
          callback();
        }
      } else {
        var loadRemain = loads.length;
        var loadDone = function loadDone() {
          loadRemain--;
          if (loadRemain === 0) {
            if (typeof callback === "function") {
              callback();
            }
          }
        };
        loads.map(function (load) {
          thump.loadBuffer(load[2], load[1], load[0], loadDone);
        });
      }
    }
  }, {
    key: "redice",
    value: function redice(seed) {
      var thump = this;
      thump.seed = seed || +new Date();
      thump.xorshift.gen(thump.seed);
    }
  }, {
    key: "init",
    value: function init() {
      var thump = this;

      thump.stopped = true;
      thump.saveFrameCount = 0;

      thump.buf.fill(0);

      thump.set(Thump.P_PRG, Thump.Z_PRG);
      thump.set(Thump.P_GZR, Thump.Z_GZR);
      thump.set(Thump.P_GZG, Thump.Z_GZG);
      thump.set(Thump.P_GZB, Thump.Z_GZB);
      thump.set16b(Thump.P_CNT, 65536 - 2);

      for (var i = 0; i < 256; i++) {
        thump.set(Thump.P_SIN + i, ~~(127.5 + 127.5 * Math.sin(i / 128.0 * Math.PI) + 0.5));
      }

      for (var _i3 = 0; _i3 < 768; _i3++) {
        thump.set(Thump.P_PLT + _i3, _palette2.default[_i3 % 256] >> ~~(_i3 / 256) * 8 & 255);
      }

      thump.xorshift.gen(thump.seed);

      thump.interpret(thump.code, function () {
        thump.stopped = false;
      });

      thump.context.fillStyle = "#000";
      thump.context.fillRect(0, 0, 256, 256);
    }
  }, {
    key: "update",
    value: function update() {
      var thump = this;
      var waited = false;

      if (!thump.stopped) {
        for (var i = 0; i < 1E4; i++) {
          var funchead = thump.get(Thump.P_PRG) * 65536 + thump.get16b(Thump.P_CNT);
          var funcp = thump.get(funchead);
          var param = thump.get(funchead + 1);
          var w = thump.funcs[funcp % thump.funcs.length](param);
          thump.set16b(Thump.P_CNT, thump.get16b(Thump.P_CNT) + 2);
          if (w) {
            thump.draw();
            setTimeout(function () {
              thump.update();
            }, w);
            waited = true;
            break;
          }
        }
      }

      if (!waited) {
        setTimeout(function () {
          thump.update();
        }, 1);
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      var thump = this;
      thump.stopped = true;
    }
  }, {
    key: "run",
    value: function run(code) {
      var thump = this;
      thump.code = code;
      thump.init();
    }
  }]);

  return Thump;
}();

// ------

Thump.P_CNT = 256; // 16bit
Thump.P_PRG = 258;
Thump.P_X = 259;
Thump.P_Y = 260;
Thump.P_Z = 261;
Thump.P_GZR = 262;
Thump.P_GZG = 263;
Thump.P_GZB = 264;
Thump.P_SPR = 265;
Thump.P_SIN = 512;
Thump.P_PLT = 768;

Thump.P_JMP = 32768;

// ------

Thump.Z_PRG = 1;
Thump.Z_GZR = 4;
Thump.Z_GZG = 5;
Thump.Z_GZB = 6;

// ------

exports.default = Thump;

},{"./eightbit":"/Users/Yutaka/Dropbox/pro/JavaScript/thump/src/script/eightbit.js","./palette256":"/Users/Yutaka/Dropbox/pro/JavaScript/thump/src/script/palette256.js","./thump-defs":"/Users/Yutaka/Dropbox/pro/JavaScript/thump/src/script/thump-defs.js","./xorshift":"/Users/Yutaka/Dropbox/pro/JavaScript/thump/src/script/xorshift.js"}],"/Users/Yutaka/Dropbox/pro/JavaScript/thump/src/script/xorshift.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Xorshift = function () {
  function Xorshift(seed) {
    _classCallCheck(this, Xorshift);

    this.seed = seed || +new Date();
  }

  _createClass(Xorshift, [{
    key: "gen",
    value: function gen(_seed) {
      var seed = _seed || this.seed || 1;
      seed = seed ^ seed << 13;
      seed = seed ^ seed >>> 17;
      seed = seed ^ seed << 5;
      this.seed = seed;
      return seed / Math.pow(2, 32) + 0.5;
    }
  }]);

  return Xorshift;
}();

exports.default = Xorshift;

},{}]},{},["/Users/Yutaka/Dropbox/pro/JavaScript/thump/src/script/main.js"]);
