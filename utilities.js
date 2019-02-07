function getRandom( range )
{
  if ( !range ) { range = 1; }
  return Math.random() * range;
}


function getRandomInt( range )
{
  return Math.floor( getRandom( range ) );
}


function mapFunction( target, method )
{
  if ( method ){
    if ( Array.isArray(target) ){
      for ( var i=0; i<target.length; i++ ){
        method( target[i], i );
      }
    } else {
      method( target );
    }
  }
}

function getLine(x0, y0, x1, y1){
  var outVals = [];

   var dx = Math.abs(x1-x0);
   var dy = Math.abs(y1-y0);
   var sx = (x0 < x1) ? 1 : -1;
   var sy = (y0 < y1) ? 1 : -1;
   var err = dx-dy;

   while(true){
     outVals.push( { props: { x: x0, y: y0 } } );

     if ((x0==x1) && (y0==y1)) break;
     var e2 = 2*err;
     if (e2 >-dy){ err -= dy; x0  += sx; }
     if (e2 < dx){ err += dx; y0  += sy; }
   }

   return outVals;
}

function listContainsCoordinates( list, cx, cy ){
  for ( var i=0; i<list.length; i++ ){
    if ( list[i].x == cx && list[i].y == cy ) { return true; }
    if ( list[i].props != null && list[i].props.x == cx && list[i].props.y == cy ) { return true; }
  }
  return false;
}

function getIndexWithCoordinates( list, cx, cy ){
  for ( var i=0; i<list.length; i++ ){
    if ( list[i].x == cx && list[i].y == cy ) { return i; }
    if ( list[i].props != null && list[i].props.x == cx && list[i].props.y == cy ) { return i; }
  }
  return -1;
}

function copyCoordinateList( list ){
  var newList = [];
  if ( list != null ){
    for ( var i=0; i<list.length; i++ ){
      var curr = list[i];
      newList.push({ props: { x: curr.props.x, y: curr.props.y }});
    }
  }
  return newList;
}

function getOffset( direction ){
  var offset = { xoff:0, yoff:0 };

  if ( direction == DIR_N ) { offset.yoff = -1; }
  if ( direction == DIR_E ) { offset.xoff = 1; }
  if ( direction == DIR_S ) { offset.yoff = 1; }
  if ( direction == DIR_W ) { offset.xoff = -1; }

  return offset;
}

function getCalculatedOffsetPosition( node, offset ){
  return { x: node.props.x + offset.xoff, y: node.props.y + offset.yoff }
}

function manhattanDistance( p1, p2 ){
  var xd;
  var yd;
  if ( p1.props != null ) {
    xd = Math.abs( p2.props.x - p1.props.x );
    yd = Math.abs( p2.props.y - p1.props.y );
  } else {
    xd = Math.abs( p2.x - p1.x );
    yd = Math.abs( p2.y - p1.y );
  }
  return xd + yd;
}
