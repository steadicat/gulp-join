var path = require('path');
var through = require('through2');

module.exports = function() {
  var files = {};
  return through.obj(function(file, enc, cb) {
    var p = path.relative(file.base, file.path);
    files[p] || (files[p] = []);
    files[p].push(file);
    cb();
  }, function(cb) {
    var out = this;
    Object.keys(files).forEach(function(path) {
      if (files[path].length > 1) {
        var contents = files[path].map(function(f) {
          return f.contents;
        });
        files[path][0].contents = Buffer.concat(contents);
      }
      out.push(files[path][0]);
    });
    cb();
  });
}
