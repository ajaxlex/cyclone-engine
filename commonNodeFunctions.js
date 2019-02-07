// randomly picks a node from a list of nodes
function pickExistingNode( nodes )
{
  var chosen = getRandomInt( nodes.length );
  return nodes[chosen];
}

// randomly picks a node from a filtered list of nodes
function pickExistingNodeFiltered( nodes, filterClause )
{
  var nodesFound = getNodes( nodes, filterClause );
  return pickExistingNode(nodesFound);
}

// favors a target node when detecting nearby nodes
function pickExistingNodeTargeted( nodes, filterClause, target ){
  var thisTarget;
  if ( target.length == null ) {
    thisTarget = [target];
  }
  for ( var t=0; t<thisTarget.length; t++ ){
    for ( var n=0; n<nodes.length; n++ ){
      if ( nodes[n].props.x == thisTarget[t].props.x && nodes[n].props.y == thisTarget[t].props.y ) {
        return nodes[n];
      }
    }
  }

  // otherwise, pick randomly respecting filters
  return pickExistingNodeFiltered( nodes, filterClause );
}

// gets all nodes that satisfy a given filter
function getNodes( nodes, filterClause )
{
  var nodesOut = [];
  if ( nodes == null || nodes.length == 0 ) { return nodesOut; }
  if ( filterClause == null ) { return nodes; }

  var limits = filter.limitsFilterCondition( nodes, filterClause );

  for ( var i=limits.start; i<limits.end; i++ )
  {
    var curr = nodes[i];
    if ( filter.perNodeFilterCondition( curr, filterClause ) ){
      nodesOut.push( curr );
    }
  }

  return nodesOut;
}


function makeNodePath( start, num, avoid, attributes )
{
  var added = calculateNodePath( start, num, avoid, target );
  return applyNodesToGraph( start, added, attributes );
}

function multiPointPath( start, end, avoid, attributes ){
  var tryLimit = 40;
  for ( var t=0; t<tryLimit; t++ ){
    var added = calculateNodePath( start, 30, avoid, end );
    var ti = getIndexWithCoordinates( added, end.props.x, end.props.y )
    if ( ti != -1 ){
      // truncate added
      added = added.slice(0, ti+1);
      console.log("Tries: " + (t+1));
      return applyNodesToGraph(start, added, attributes);
    }
  }
  console.log("Tries: " + (tryLimit));
}

// applies node properties to elements in a path
function applyNodesToGraph( start, added, attributes )
{
  if ( added.length && added.length > 0 ){
    var last = start;
    for ( var i=0; i < added.length; i++ ){
      var next = added[i];
      //next.pathTag = "primary";
      //next.render.color = "#77B";
      //addEdge( last, next, [ EDGE_FWD ] );

      next.pathTag = attributes.pathTag;
      next.render.color = attributes.render.color;
      addEdge( last, next, attributes.edgeList );
      last = next;
    }
  }
  return added;
}

// calculate a path of nodes without modifying the graph
function calculateNodePath( start, num, avoid, target )
{
  var calculated = [];
  var last = start;

  var tempAvoid = copyCoordinateList( avoid );

  for ( var i=0; i < num; i++ ){
    var next = selectAdjacentNodeFromList( last, tempAvoid, target );
    if ( next ){
      calculated.push( next );
      tempAvoid.push({props:{x: next.props.x, y: next.props.y }});
      last = next;
    }
  }
  return calculated;
}

// randomly chooses an adjacent open node
function selectAdjacentNodeFromList( last, avoid, target ){
  var legal = selectNearbyLegalNodes( last, avoid );
  return pickExistingNodeTargeted( legal, null, target );
}

// return all adjacent open and safe nodes by list search
function selectNearbyLegalNodes( last, avoid )
{
  var nearby = [];
  for ( var i=0; i < 4; i++ ){
    var calc = getCalculatedOffsetPosition( last, getOffset( i ) );
    if ( withinDungeonBounds( calc.x, calc.y ) && withinLegalNodes( avoid, calc.x, calc.y ) ) {
      nextNode = dungeonMission.getNodeAt( calc.x, calc.y );
      if ( nextNode != null ) {
        if ( nextNode.pathTag == "none" ) {
          nearby.push( nextNode );
        } else { /* this is an occupied node */ }
      } else { /* no node was found at the given position */ }
    }
  }
  return nearby;
}

// return all adjacent open and safe nodes by grid offset
function selectNearbyLegalFromGrid( last, grid, avoid )
{
  var nearby = [];
  for ( var i=0; i < 4; i++ ){
    var calc = getCalculatedOffsetPosition( last, getOffset( i ) );
    if ( withinDungeonBounds( calc.x, calc.y ) && withinLegalNodes( avoid, calc.x, calc.y ) ) {
      nextNode = grid[calc.x][calc.y];
      if ( nextNode != null ) {
        if ( nextNode.pathTag == "none" ) {
          nearby.push( nextNode );
        } else { /* this is an occupied node */ }
      } else { /* no node was found at the given position */ }
    }
  }
  return nearby;
}



function withinDungeonBounds( x, y ){
  return ( x >= 0 && y >= 0 && x < dungeonMission.dimx && y < dungeonMission.dimy );
}

function withinLegalNodes( avoid, x, y ){
  return ( avoid == null || !listContainsCoordinates( avoid, x, y ) );
}


// create an empty grid of graphContext dimension, optionally populate with preexisting node refs
function createGrid( nodes, graphContext ){
  // nodes = [] will create an empty grid of context dimension
  var grid = [];
  for ( var x=0; x<graphContext.dimx; x++){
    grid[x] = [];
    for ( var y=0; y<graphContext.dimy; y++){
      grid[x][y] = null;
    }
  }
  for ( var i=0; i<nodes.length; i++ ){
    var curr = nodes[i];
    grid[curr.props.x][curr.props.y] = curr;
  }

  return grid;
}
