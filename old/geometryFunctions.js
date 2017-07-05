function getLinePoints( x0, y0, x1, y1 ){
  var points = [];

  x0 = Math.floor(x0);
  y0 = Math.floor(y0);
  x1 = Math.floor(x1);
  y1 = Math.floor(y1);

  // vals must be integers
  var dx = Math.abs(x1-x0);
  var dy = Math.abs(y1-y0);
  var sx = (x0 < x1) ? 1 : -1;
  var sy = (y0 < y1) ? 1 : -1;
  var err = dx-dy;

  while(true){

    points.push( { x: x0, y: y0 } );

    if ((x0==x1) && (y0==y1)) break;
    var e2 = 2*err;
    if (e2 >-dy){ err -= dy; x0  += sx; }
    if (e2 < dx){ err += dx; y0  += sy; }
  }

  return points;
}


function getRectanglePoints( x1, y1, x2, y2 ){
  var points = [];

  for ( var k = y1; k < y2; k++ ){
    for ( var j = x1; j < x2; j++ ){
      points.push( { x: j, y: k } );
    }
  }

  return points;
}





/*

Rooms will be represented as bitmaps with alphas for empty space

Rooms will have a main area, plus extensions

?? The room will include a center point for its main area which may be different from its actual center

Rooms will have exits

Rooms will have regions?

*/
