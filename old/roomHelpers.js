
function MakeWallDetour( m, side, depth ){

  var orient = ORIENT_H;
  var xoff = 0;
  var yoff = 0;
  var points = [];

  switch( side ){
    case DIR_N: orient = ORIENT_H; xoff = 0; yoff = -1; break;
    case DIR_S: orient = ORIENT_H; xoff = 0; yoff = 1; break;
    case DIR_E: orient = ORIENT_V; xoff = 1; yoff = 0; break;
    case DIR_W: orient = ORIENT_V; xoff = -1; yoff = 0; break;
  }

  var spoints = m.getSide( side );
  var ssorted = getSorted( spoints, orient );

  // do not take from corners
  ssorted.splice( ssorted.length - 2, 2 );
  ssorted.splice( 0, 2 );

  var nrandos = getRandomPoints( ssorted, 2, 2 );
  nrandos = getSorted( nrandos, orient );

  for ( var i=1; i<depth; i++ ){
    points[points.length] = { x: nrandos[0].x + ( i * xoff ), y: nrandos[0].y + ( i * yoff ) };
    points[points.length] = { x: nrandos[1].x + ( i * xoff ), y: nrandos[1].y + ( i * yoff ) };
  }

  if ( orient == ORIENT_H ){
    for ( var i=nrandos[0].x; i<=nrandos[1].x; i++ ){
      points[points.length] = { x: i, y: nrandos[1].y + ( depth * yoff ) };
    }
  } else {
    for ( var i=nrandos[0].y; i<=nrandos[1].y; i++ ){
      points[points.length] = { x: nrandos[1].x + ( depth * xoff ), y: i };
    }
  }

  return points;

}

function makeAntechambers( m, side, frequency, depth ){

  var orient = ORIENT_H;
  var xoff = 0;
  var yoff = 0;
  var points = [];

  switch( side ){
    case DIR_N: orient = ORIENT_H; xoff = 0; yoff = -1; break;
    case DIR_S: orient = ORIENT_H; xoff = 0; yoff = 1; break;
    case DIR_E: orient = ORIENT_V; xoff = 1; yoff = 0; break;
    case DIR_W: orient = ORIENT_V; xoff = -1; yoff = 0; break;
  }

  var spoints = m.getSide( side );
  var ssorted = getSorted( spoints, orient );

//  var frequency = 3;
  var targets = getEveryN( ssorted, frequency );

  if ( orient == ORIENT_H ){
    for ( var i=0; i<targets.length; i++ ){
      points[points.length] = { x: targets[i].x, y: targets[i].y + ( depth * yoff ) };
    }
  } else {
    for ( var i=0; i<targets.length; i++ ){
      points[points.length] = { x: targets[i].x + ( depth * xoff ), y: targets[i].y };
    }
  }

  return points;
}
