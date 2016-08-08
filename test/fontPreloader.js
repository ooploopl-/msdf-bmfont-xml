const parallel = require('run-parallel');
const loadBmfont = require('load-bmfont');
const noop = () => {};

var loadedResult;
var isFinished = false;

module.exports = function (cb = noop) {
  if (isFinished) {
    process.nextTick(() => {
      cb(null, loadedResult);
    });
    return loadedResult;
  }
  parallel({
    texture: (next) => {
      var texture = new THREE.TextureLoader().load('../output/sheet0.png', () => {
        next(null, texture);
      }, noop, () => {
        next(new Error('Could not load font image'));
      });
    },
    font: (next) => {
      loadBmfont('../output/font.fnt', (err, font) => {
        if (err) return next(err);
        next(null, font);
      });
    }
  }, (err, results) => {
    isFinished = true;
    if (err) return cb(err);
    loadedResult = results;
    cb(null, results);
  });
};
