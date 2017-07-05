
function RunBasicTests() {

  CanMakeBasicRooms( ms );

  CanRotateRooms( ms );

  CanCreateRegion( ms );

  CanAddAntechamber( ms );

  CanSubdivideRoomBasic( ms );

  CanGetContour( ms );

  // can get center line
  CanGetCenterLine( ms );

  CanRemovePoints( ms );

  CanGetEdges( ms );
}

function CanRemovePoints( ms ){
  var start = getRectanglePoints( 0, 0, 5, 8 );
  var hole = getRectanglePoints( 2, 2, 4, 4 );
  var m = new roomNode( ms, start );
  m.setPosition( 10, 80 );
  m.removePoints( hole );
  m.addToMap();
}

function CanGetCenterLine( ms ){
  var start = getRectanglePoints( 0, 0, 5, 8 );
  var m = new roomNode( ms, start );
  m.setPosition( 20, 10 );
  m.addToMap();

  var center = m.getCenterLine( ORIENT_V );
  m.setCellProperty( center, "subregion", 3 );

  var start2 = getRectanglePoints( 0, 0, 8, 5 );
  var n = new roomNode( ms, start2 );
  n.setPosition( 30, 10 );
  n.addToMap();
  var center = n.getCenterLine( ORIENT_H );
  n.setCellProperty( center, "subregion", 3 );
}


function CanMakeBasicRooms( ms ){

  // create a simple rectangular room

  var start = getRectanglePoints( 0, 0, 8, 5 );
  var m = new roomNode( ms, start );
  m.setPosition( 10, 10 );
  m.addToMap();

}

function CanRotateRooms( ms ){

  var start = getRectanglePoints( 0, 0, 5, 2 );
  var m = new roomNode( ms, start );
  var n = new roomNode( ms, start );

  m.setPosition( 10, 20 );
  m.addToMap();

  n.setPosition( 20, 20 );
  n.rotate();
  n.addToMap();
}


function CanSubdivideRoomBasic( ms ){
  var start = getRectanglePoints( 0, 0, 12, 9 );
  var m = new roomNode( ms, start );
  m.setPosition( 10, 40 );
  m.addPoints( start );
  m.subdivide( ORIENT_V, 3 );
  m.addToMap();

  var n = new roomNode( ms, start );
  n.setPosition( 30, 40 );
  n.addPoints( start );
  n.subdivide( ORIENT_H, 3 );
  n.addToMap();

  var o = new roomNode( ms, start );
  o.setPosition( 50, 40 );
  o.addPoints( start );
  o.subdivide( ORIENT_V, 3 );
  o.subdivide( ORIENT_H, 3, 2 );
  o.addToMap();

}

function CanCreateRegion( ms ){

  var start = getRectanglePoints( 0, 0, 5, 4 );
  var m = new roomNode( ms, start );
  m.setPosition( 30, 20 );
  m.setCellProperty( start, "subregion", 1 );
  m.addToMap();

  var next = getRectanglePoints( 2, 2, 5, 4 );
  var n = new roomNode( ms, start );
  n.setPosition( 40, 20 );
  n.setCellProperty( next, "subregion", 2 );
  n.addToMap();

  var next = getRectanglePoints( 2, 2, 5, 4 );
  var n = new roomNode( ms, start );
  n.setPosition( 50, 20 );
  n.setCellProperty( next, "subregion", 2 );
  n.rotate();
  n.addToMap();

  var next = getRectanglePoints( 0, 0, 9, 5 );
  var o = new roomNode( ms, next );
  o.setPosition( 60, 20 );
  o.subdivide( ORIENT_H, 3 );
  o.combineRegions( 3, 4 );
  o.addToMap();
}


function CanAddAntechamber( ms ){
  var start = getRectanglePoints( 0, 0, 5, 4 );
  var m = new roomNode( ms, start );
  m.setPosition( 10, 30 );

  var next = getRectanglePoints( -4, 1, -1, 3 );
  var points = m.getPointsFromIndices(m.addPoints( next ));
  m.setCellProperty( points, "subregion", 1 );
  m.addToMap();
}

function CanGetContour( ms ){

  var start = getRectanglePoints( 0, 0, 5, 4 );
  var m = new roomNode( ms, start );
  m.setPosition( 10, 60 );

  var contour = getContourFromPoints( start );
  //var indexes = m.addPoints( contour );

  var n = new roomNode( ms, start );
  n.setPosition( 20, 60 );

  m.addToMap();
  n.addToMap();

  var snext = getRectanglePoints( 0, 0, 12, 9 );

  var o = new roomNode( ms, snext );
  o.setPosition( 30, 60 );
  o.addPoints( start );
  o.subdivide( ORIENT_V, 3 );
  o.subdivide( ORIENT_H, 3, 2 );
  o.rotate();

  var targetRegion = 3;
  var rp = o.getPointsForRegion( targetRegion );
  var cnext = getContourFromPoints( rp );

  var p = new roomNode( ms, rp );
  p.setPosition( 40, 60 );
  p.addToMap();

  o.addToMap();

  ms.addShape( contour, 10, 60 );
  ms.addShape( cnext, 30, 60 );

}

function CanGetEdges(){
  var start = getRectanglePoints( 0, 0, 8, 5 );
  var m = new roomNode( ms, start );
  m.setPosition( 40, 10 );

  var npoints = m.getSide( DIR_N );
  m.setCellProperty( npoints, "subregion", 3 );

  var spoints = m.getSide( DIR_S );
  m.setCellProperty( spoints, "subregion", 4 );

  var epoints = m.getSide( DIR_E );
  m.setCellProperty( epoints, "subregion", 5 );

  var wpoints = m.getSide( DIR_W );
  m.setCellProperty( wpoints, "subregion", 6 );


  m.addToMap();

}



function getFunnyRoom(){

  var DIR_N = 0;
  var DIR_E = 1;
  var DIR_S = 2;
  var DIR_W = 3;
  var DIR_U = 4;
  var DIR_D = 5;

  var start = getRectanglePoints( 0, 0, 8, 5 );
  var m = new roomNode( start );

  m.subDivide( 2, DIR_N );
  m.addSubArea( DIR_N, 1 );
  m.addSubArea( DIR_E, 2 );
  m.makeExits( 2 );

}
