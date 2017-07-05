
///////////////
// utilities
///////////////

function create2DArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = create2DArray.apply(this, args);
    }
    return arr;
}

function init2DArray( array, value ){
  for ( outer = 0; outer < array.length; outer++ ){
    for ( inner = 0; inner < array[outer].length; inner++ ){
      array[outer][inner] = value;
    }
  }
}





////////
//
// Helpers for procgen


getContourFromPoints = function( points, dist ){
  if ( dist === null ) { dist = 0; }
  var edgepoints = [];
  var detector = [];
  var pshape = new shapeType( points );

  // for now, a simple version with one distance - in
  var kernel = [];
  kernel[0] = [{x:-1,y:-1}, {x:0,y:-1}];
  kernel[1] = [{x:-1,y:0}, {x:0,y:0}];

  function readDetector( kernel, x, y, edgepoints ){
    tl = { x:kernel[0][0].x + x, y:kernel[0][0].y + y };
    tr = { x:kernel[0][1].x + x, y:kernel[0][1].y + y };
    bl = { x:kernel[1][0].x + x, y:kernel[1][0].y + y };
    br = { x:kernel[1][1].x + x, y:kernel[1][1].y + y };

    if ( pshape.safeRead( br.x, br.y ) != CELL_EMPTY ) {
        if ( pshape.safeRead( tr.x, tr.y ) == CELL_EMPTY ){
          edgepoints = addUniquePoint( x, y-dist, edgepoints );
        }
        if ( pshape.safeRead( bl.x, bl.y ) == CELL_EMPTY ){
          edgepoints = addUniquePoint( x-dist, y, edgepoints );
        }
        if ( pshape.safeRead( tl.x, tl.y ) == CELL_EMPTY ){
          edgepoints = addUniquePoint( x-dist, y-dist, edgepoints );
        }
    }

    if ( pshape.safeRead( tl.x, tl.y ) != CELL_EMPTY ) {
        if ( pshape.safeRead( tr.x, tr.y ) == CELL_EMPTY ){
          edgepoints = addUniquePoint( x+dist-1, y-1, edgepoints );
        }
        if ( pshape.safeRead( bl.x, bl.y ) == CELL_EMPTY ){
          edgepoints = addUniquePoint( x-1, y+dist-1, edgepoints );
        }
        if ( pshape.safeRead( br.x, br.y ) == CELL_EMPTY ){
          edgepoints = addUniquePoint( x+dist-1, y+dist-1, edgepoints );
        }
    }
  }

  // horizontal scan
  for ( var k=0; k<pshape.extents.bry+2; k++ ){
    for ( var i=0; i<pshape.extents.brx+2; i++ ){
      readDetector( kernel, i, k, edgepoints );
    }
  }

  return edgepoints;
};

function getRandomPoints( points, number, mindistance ){
  var override = 0;
  var indexes = [];
  var pout = [];

  if ( number === null || number < 0 || ( number > points.length && mindistance > 0 ) ) { number = 1; }
  if ( mindistance === null || mindistance < 0 ) { mindistance = 1; }

  if ( points.length > 0 ){
    for ( var i=0; i<number; i++ ){
      var next = Math.floor(Math.random() * points.length);
      if ( mindistance == 1 ) {
        if ( indexes.includes( next ) && override < 20 ) {
          i--;
          override++;
        } else {
          indexes.push( next );
          override = 0;
        }
      } else {
        var tooClose = false;
        for ( var k=0; k<indexes.length; k++ ){
          var target = points[indexes[k]];
          if ( manhattanDistance( points[next], target ) < mindistance ){
            tooClose = true;
          }
        }
        if ( tooClose ){
          i--;
          override++;
        } else {
          indexes.push( next );
          override = 0;
        }
      }
    }

    for ( var j=0; j<indexes.length; j++ ){
      pout.push( points[indexes[j]] );
    }

    return pout;
  }
  return [];
}

function manhattanDistance( p1, p2 ){
  var xd = Math.abs( p2.x - p1.x );
  var yd = Math.abs( p2.y - p1.y );
  return xd + yd;
}

function getSorted( points, orientation ){
  if ( orientation == ORIENT_H ){
    return points.sort(function( a, b ) { return a.x-b.x; });
  } else if ( orientation == ORIENT_V ){
    return points.sort(function( a, b ) { return a.y-b.y; });
  }
  return points;
}

function getEveryN( points, frequency ){
  var pout = [];
  for ( var i=0; i<points.length; i=i+frequency ){
    pout[pout.length] = { x: points[i].x, y: points[i].y };
  }
  return pout;
}

function addUniquePoint( x, y, array ){
  for ( var i=0; i<array.length; i++ ){
    if ( array[i].x == x && array[i].y == y ){
      return array;
    }
  }
  array[array.length] = { x: x, y: y };
  return array;
}

function getNewIndex( arrayIn, picked ){
  var pick = -1;
  if ( arrayIn.length > picked.length ) {
    do {
      pick = getRange( 0, arrayIn.length );
    } while( picked.contains( pick ) === false && safe < arrayIn.length * 4 );
    if ( pick != -1 ) {
      picked.push( pick );
    }
  }
  return pick;
}

function bundleAndRound( x, y ){
  return { x: Math.floor(x), y: Math.floor(y) };
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function toRadians (angle) {
  return angle * (Math.PI / 180);
}

function getRange( r ){
  return Math.floor( myrng() * r );
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
