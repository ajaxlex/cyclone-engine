

function initGraph()
{
  addBaseNodes();
  //generatePaths();
  //generateTestPath();

  generateTestLoop();
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

function generateTestPath()
{
  //var pnodes = generatePrimaryPath( 11 );
  var startEnd = pickStartEnd();

  var start = dungeonMission.getNodeAt( startEnd[0].x, startEnd[0].y );
  start.pathTag = "primary";
  start.render.color = "#55C";

  //var end = dungeonMission.getNodeAt( startEnd[1].x, startEnd[1].y );
  var end = dungeonMission.getNodeAt( 5, 2 );

  var pnodes = multiPointPath( start, end, [], { pathTag: "primary", render: { color: "#77B" }, edgeList: [ EDGE_FWD ] } );

  end.pathTag = "none";
  end.render.color = "#85C";

}

function generateTestLoop(){

  var startEnd = pickStartEnd();
  var midLine = getLine( startEnd[0].x, startEnd[0].y, startEnd[1].x, startEnd[1].y );
  makeLoop( startEnd, midLine );
}

function getBothAreas( midline ){
  var a = [];
  var b = [];
  for ( var i=0; i<midline.length; i++ ){
    var curr = midline[i];
    for ( var yscan = 0; yscan <= dungeonMission.dimy; yscan++ ){
      if ( yscan < curr.props.y ){
        a.push( { props:{ x: curr.props.x, y: yscan } } );
      } else if ( yscan > curr.props.y ) {
        b.push( { props:{ x: curr.props.x, y: yscan } });
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


  var end = dungeonMission.getNodeAt( startEnd[1].x, startEnd[1].y );

  var both = getBothAreas( midLine );

  multiPointPath( start, end, both.a, { pathTag: "primary", render: { color: "#77B" }, edgeList: [ EDGE_FWD ] } );
  multiPointPath( end, start, both.b, { pathTag: "return", render: { color: "#FB3" }, edgeList: [ EDGE_FWD ] } );

  start.pathTag = "primary";
  start.render.color = "#55C";

  end.pathTag = "primary";
  end.render.color = "#85C";

}

function getConstrainedNodePath( start, end, avoid ){
  makeNodePath( start, 12, avoid, { pathTag: "primary", render: { color: "#77B" }, edgeList: [ EDGE_FWD ] } );
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
  var added = makeNodePath( start, length, null, { pathTag: "primary", render: { color: "#77B" }, edgeList: [ EDGE_FWD ] } );
  mapFunction( added, function( n ){ n.pathTag = "primary"; } );
  return added;
}

function generateSecondaryPaths( length, filter ){
  var start = pickExistingNodeFiltered( dungeonMission.nodes, filter, dungeonMission );
  if ( start != null ){
    var added = makeNodePath( start, length, null, { pathTag: "primary", render: { color: "#77B" }, edgeList: [ EDGE_FWD ] } );
    mapFunction( added, function( n, i ) {
      n.pathTag = "secondary";
      n.render.color = "#FB3";
    });
  }
}

function chooseBlockOnEdge( nodes ){
  var chosen = pickExistingNodeFiltered( nodes, "edge=any", dungeonMission );
  return chosen;
}
