function RunCompositionTests(){

  CompositionRoomOne();

  CompositionRoomTwo();

  CompositionRoomThree();

  CompositionRoomFour();

  //CompositionRoomFive();

  CompositionMapOne();

}


function makeBasic( x, y, w, h ) {
  var s = getRectanglePoints( 0, 0, w, h );
  var r = new roomNode( ms, s );
  r.setPosition( x, y );
  r.addPoints( s );

  return { r: r, start: s };
}


function CompositionRoomOne(){

  var basic = makeBasic( 10, 10, 12, 9 );
  var r = basic.r;

  var edge = getContourFromPoints( basic.start );
  var center = r.getCenterLine( ORIENT_H );

  edge = edge.concat( center );

  r.setCellProperty( edge, "subregion", 1 );
  r.addToMap();
}

function CompositionRoomTwo(){

  var basic = makeBasic( 30, 10, 12, 9 );
  var r = basic.r;

  var npoints = r.getSide( DIR_N );
  var nrandos = getRandomPoints( npoints, 4 );
  r.setCellProperty( nrandos, "subregion", 3 );

  var spoints = r.getSide( DIR_S );
  var srandos = getRandomPoints( spoints, 3, 0 );
  r.setCellProperty( srandos, "subregion", 4 );

  r.addToMap();
}

function CompositionRoomThree(){
  var basic = makeBasic( 50, 10, 12, 9 );
  var r = basic.r;

  var npoints = r.getSide( DIR_N );
  //var nrandos = getRandomPoints( npoints, 6 );
  var nsorted = getSorted( npoints, ORIENT_H );
  nsorted.splice( nsorted.length - 2, 2 )
  nsorted.splice( 0, 2 );

  r.setCellProperty( nsorted, "subregion", 4 );

  var spoints = r.getSide( DIR_S );
  //var nrandos = getRandomPoints( npoints, 6 );
  var ssorted = getSorted( spoints, ORIENT_H );
  ssorted.splice( ssorted.length - 2, 2 )
  ssorted.splice( 0, 2 );
  var nrandos = getRandomPoints( ssorted, 2, 2 );

  r.setCellProperty( nrandos, "subregion", 4 );

  r.addToMap();
}


function CompositionRoomFour(){

  var basic = makeBasic( 70, 10, 12, 9 );
  var r = basic.r;

  var side = Math.floor( Math.random() * 4 );
  var depth = Math.floor( Math.random() * 2 ) + 2;

  var first = MakeWallDetour( r, side, depth );

  side += 1; if ( side > 3 ) { side = 0; }
  depth = Math.floor( Math.random() * 2 ) + 2;

  var second = MakeWallDetour( r, side, depth );
  // hm - this is tricky order of operations stuff for the tranform
  first = first.concat(second);
  r.addPoints( first );
  r.addToMap();
}

function CompositionRoomFive(){

  var basic = makeBasic( 90, 10, 12, 9 );
  var r = basic.r;

  var side = Math.floor( Math.random() * 4 );
  var depth = Math.floor( Math.random() * 2 ) + 2;

  //var first = makeAntechambers( r, side, 3, depth );
  //r.addPoints( first );

  r.addToMap();

}

function CompositionMapOne(){

  // add n rooms
  var roomCount = 10;
  var last = null;

  for ( var i=0; i<roomCount; i++ ){
    if ( last == null ){

    } else {

    }
  }

}
