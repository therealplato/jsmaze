//////////////////////////////////////////////////////////////////////
//
// jsmaze.js
// Copyright (c) 2012 Bill St. Clair
// Some rights reserved.
// Distributed under the Apache License, Version 2.0
// http://www.apache.org/licenses/LICENSE-2.0.html
//
//////////////////////////////////////////////////////////////////////

//
// This file will work in the browser or in node.js.
// In the browser, just put a path to it in a <script> tag:
//     <script src='server/shared/jsmaze.js'></script>
// In node.js:
//    var jsmaze = require('./server/shared/jsmaze.js');
// In browser, sets the jsmaze global variable
//   (and the exports global variable).
//
// Global properties/functions:
//
// jsmaze.Maze(map)
//   Instantiate with "new jsmaze.Maze(map)"
//   The map arg is optional, but if you omit it, you'll have to populate
//   the vert, horiz, width, and height properties yourself.
//   A Maze <map> is an array of strings.
//   The even strings describe the horizontal walls.
//   The odd strings describe the vertical walls.
//   Anything other than a space represents a wall.
//   The odd (vertical) strings are one character longer than the even strings.
//   The array is of an odd length, putting horizontal walls
//   first and last.
// jsmaze.makeMaze(width, height, val)
//   Make a new jsmaze.Maze instance with the given width and height,
//   empty if val is false, or filled if val is true.
//
// jsmaze.Maze properties/methods:
//
// width
// height
//   the width and height of the maze. Positive integers.
// horiz
// vert
//   Two-dimensional arrays for the horizontal and vertical walls.
//   horiz[j][i] true means that the horizontal wall at location [i,j]
//   is there. Note that the vertical dimension comes first.
// clone()
//   Return a copy of this jsmaze.Maze instance
// canMoveForward(pos, dir)
// canMoveBackward(pos, dir)
//   True if an "eye" at location pos pointing in direction dir
//   can move forward/backward without running into a wall.
//   pos = {i:<i>,j:<j>}
//   dir = {i:<diri>,j:<dirj>}
//     One of <diri> & <dirj> is 0. The other is 1 or -1.
//

if (typeof exports === 'undefined') {
  var jsmaze = {};
} else {
  var jsmaze = exports;
}

(function() {
  jsmaze.Maze = Maze;
  function Maze(map) {
    var self = this;
    if (map) init(map);

    function init (map) {
      if (map.length % 2 != 1) {
        throw('map must be an odd-length array of strings');
      }
      var horiz = new Array();
      var vert = new Array();
      var w = map[0].length;
      var h = (map.length-1)/2;
      var idx = 0;
      for (var j=0; j<map.length; j+=2) {
        var hs = map[j];
        var vs = map[j+1]
        var dov = ((j+1) != map.length);
        if (typeof(hs)!='string' || (dov && typeof(vs)!='string')) {
          throw 'map must be an array of strings';
        }
        if (hs.length!=w || (dov && vs.length!=(w+1))) {
          throw 'map has inconsistent element length';
        }
        var ha = new Array();
        var va = new Array();
        for (var i=0; i<w; i++) {
          ha[i] = (hs[i]==' ') ? 0 : 1;
          if (dov) va[i] = (vs[i]==' ') ? 0 : 1;
        }
        if (dov) {
          va[w] = (vs[w]==' ') ? 0 : 1;
          vert[idx] = va;
        }
        horiz[idx] = ha;
        idx++;
      }
      self.width = w;
      self.height = h;
      self.horiz = horiz;
      self.vert = vert;
    }

    function copy2d(arr) {
      var res = new Array();
      for (var i=0; i<arr.length; i++) {
        row = arr[i];
        var resrow = new Array();
        for (var j=0; j<row.length; j++) {
          resrow[j] = row[j];
        }
        res[i] = resrow;
      }
      return res;
    }

    self.clone = clone;
    function clone() {
      var maze = new Maze();
      maze.width = self.width;
      maze.height = self.height;
      maze.horiz = copy2d(self.horiz);
      maze.vert = copy2d(self.vert);
      return maze;
    }

    self.canMoveForward = canMoveForward;
    function canMoveForward(pos, dir) {
      var i = pos.i;
      var j = pos.j
      return dir.i ? !self.vert[j][(dir.i>0) ? i+1 : i] :
      !self.horiz[(dir.j>0) ? j+1 : j][i];
    }

    self.canMoveBackward = canMoveBackward;
    function canMoveBackward(pos, dir) {
      return canMoveForward(pos, {i:-dir.i, j:-dir.j});
    }
  }

  jsmaze.makeMaze = makeMaze;
  function makeMaze(width, height, val) {
    val = val ? 1 : 0;
    if (!height) height = width;
    var maze = new Maze();
    maze.width = width;
    maze.height = height;
    var horiz = new Array();
    var vert = new Array();
    var idx = 0;
    for (var j=0; j<=height; j++) {
      var dov = (j < height);
      var ha = new Array();
      var va = dov ? new Array() : null;
      for (var i=0; i<width; i++) {
        ha[i] = val;
        if (dov) va[i] = val;
      }
      if (dov) va[width] = val;
      horiz[idx] = ha;
      if (dov) vert[idx] = va;
      idx++;
    }
    maze.horiz = horiz;
    maze.vert = vert;
    return maze;
  }

  var DEFAULT_MAP = ["----------",
                     "||      | |",
                     "  ------- ",
                     "| |    | ||",
                     "   -----  ",
                     "|| |  | |||",
                     "    ---   ",
                     "||| |  ||||",
                     "     -    ",
                     "||||  | |||",
                     "    --    ",
                     "||||   | ||",
                     "   ----   ",
                     "||| |   | |",
                     "  ------  ",
                     "|| |     ||",
                     " -------- ",
                     "| |       |",
                     "----------"];

  jsmaze.getDefaultMap = getDefaultMap;
  function getDefaultMap() {
    return DEFAULT_MAP;
  }

  jsmaze.makeDefaultMaze = makeDefaultMaze;
  function makeDefaultMaze() {
    return makeMaze(DEFAULT_MAP);
  }

})();                 // execute the function() at the top of the file
