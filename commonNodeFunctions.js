function pickExistingNodeFiltered( filter, nodes )
{
  var nodesFound = getNodes( filter, nodes );
  var chosen = getRandomInt( nodesFound.length );
  return nodesFound[chosen];
}

function pickExistingNode( nodes )
{
  var chosen = getRandomInt( nodes.length );
  return nodes[chosen];
}


function getNodes( filter, nodes )
{
  if ( nodes.length == 0 ) { return []; }

  var startEnd = parseFilterStartEnd( filter, nodes );
  var searchStart = startEnd.start;
  var searchEnd = startEnd.end;

  var nodesOut = [];

  for ( var i=searchStart; i<searchEnd; i++ )
  {
    var curr = nodes[i];

    if ( testForFilterCondition(filter, curr, nodes) ){
      nodesOut.push( curr );
    }
  }

  return nodesOut;
}

// generates a list of nodes
function generateNodePath( start, num, safe )
{
  var added = [];
  var last = start;

  for ( var i=0; i < num; i++ ){
    var next = selectAdjacentNodeFromList( last, safe );
    if ( next ){
      next.pathTag = "primary";
      next.render.color = "#77B";
      addEdge( last, next, [ EDGE_FWD ] );
      added.push( next );
      last = next;
    }
  }
  return added;
}

function selectAdjacentNodeFromList( last, safe ){
  var legal = selectNearbyLegalNodes( last, safe );
  return pickExistingNode( legal );
}

function selectNearbyLegalNodes( last, safe )
{
  var nearby = [];
  for ( var i=0; i < 4; i++ ){
    var offset = getOffset( i );

    var calcx = last.props.x + offset.xoff;
    var calcy = last.props.y + offset.yoff;

    if ( withinDungeonBounds( calcx, calcy ) && withinLegalNodes( safe, calcx, calcy ) ) {
      nextNode = dungeonMission.getNodeAt( calcx, calcy );
      if ( nextNode.pathTag == "none" ) {
        //nearby.push( { x:calcx, y:calcy } );
        nearby.push( nextNode );
      } else {
        //
      }
    }
  }
  return nearby;
}

function getOffset( direction ){
  var offset = { xoff:0, yoff:0 };

  if ( direction == DIR_N ) { offset.yoff = -1; }
  if ( direction == DIR_E ) { offset.xoff = 1; }
  if ( direction == DIR_S ) { offset.yoff = 1; }
  if ( direction == DIR_W ) { offset.xoff = -1; }

  return offset;
}

function withinDungeonBounds( x, y ){
  return ( x >= 0 && y >= 0 && x < dungeonMission.dimx && y < dungeonMission.dimy );
}

function withinLegalNodes( safe, x, y ){
  return ( safe == null || listContainsCoordinates( safe, x, y ) );
}
