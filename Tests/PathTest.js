

function initGraph()
{
  addBaseNodes();
  generatePaths();
}


function generatePaths()
{
  //var pnodes = generatePrimaryPath( 11 );

  var rnodes = generateTestLoop();

  var side1 = generateSecondaryPaths( 3, "section=primary,before=5" );

  var side2 = generateSecondaryPaths( 3, "section=primary,after=3" );

  var side3 = generateSecondaryPaths( 3, "section=primary,after=5" );

  var side4 = generateSecondaryPaths( 1, "section=primary" );

  var side5 = generateSecondaryPaths( 1, "section=primary" );

  // TODO - make paths transactional so failed paths can be rolled back
}

function generateTestLoop(){

  var startEnd = pickStartEnd();
  var midLine = getLine( startEnd[0].x, startEnd[0].y, startEnd[1].x, startEnd[1].y );
  makeLoop( startEnd, midLine );

  //var sections = getBothAreas( midline )
}

function getBothAreas( midline ){
  var a = [];
  var b = [];
  for ( var i=0; i<midline.length; i++ ){
    var curr = midline[i];
    for ( var yscan = 0; yscan <= dungeonMission.dimy; yscan++ ){
      if ( yscan <= curr.y ){
        a.push( { x: curr.x, y: yscan } );
      } else {
        b.push( { x: curr.x, y: yscan } );
      }
    }
  }
  return { a:a, b:b };
}

function pickStartEnd(){
  var startEnd = [];
  startEnd[0] = { x:0, y:getRandomInt( dungeonMission.dimy-1 ) };
  startEnd[1] = { x:dungeonMission.dimx-1, y:getRandomInt( dungeonMission.dimy-1 ) };
  return startEnd;
}

function makeLoop( startEnd, midLine ){
  var start = dungeonMission.getNodeAt( startEnd[0].x, startEnd[0].y );
  start.pathTag = "primary";
  start.render.color = "#55C";

  var end = dungeonMission.getNodeAt( startEnd[1].x, startEnd[1].y );
  end.pathTag = "primary";
  end.render.color = "#85C";

  var both = getBothAreas( midLine );

  // perturb path using safe lists to discriminate


  getConstrainedNodePath( start, end, both.a );
  getConstrainedNodePath( end, start, both.b );

}

function getConstrainedNodePath( start, end, include ){
  generateNodePath( start, 12, include );
}

function addBaseNodes(){
  for ( var i=0; i<dungeonMission.dimx; i++ ) {
    for ( var k=0; k<dungeonMission.dimy; k++ ) {
      var n = addRoom( i, k );
      n.pathTag = "none";
    }
  }
}

function generatePrimaryPath( length ){
  var start = chooseBlockOnEdge(dungeonMission.nodes);
  start.pathTag = "primary";
  start.render.color = "#55C";
  var added = generateNodePath( start, length );
  mapFunction( added, function( n ){ n.pathTag = "primary"; } );
  return added;
}

function generateSecondaryPaths( length, filter ){
  var start = pickExistingNodeFiltered( filter, dungeonMission.nodes );
  if ( start != null ){
    var added = generateNodePath( start, length );
    mapFunction( added, function( n, i ) {
      n.pathTag = "secondary";
      n.render.color = "#FB3";
    });
  }
}

function chooseBlockOnEdge( nodes ){
  var chosen = pickExistingNodeFiltered("edge=any", nodes );
  return chosen;
}
