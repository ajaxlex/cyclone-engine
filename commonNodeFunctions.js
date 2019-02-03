


// randomly picks a node from a list of nodes
function pickExistingNode( nodes )
{
  var chosen = getRandomInt( nodes.length );
  return nodes[chosen];
}

// randomly picks a node from a filtered list of nodes
function pickExistingNodeFiltered( filterClause, nodes )
{
  var nodesFound = getNodes( filterClause, nodes );
  return pickExistingNode(nodesFound);
}

// gets all nodes that satisfy a given filter
function getNodes( filterClause, nodes )
{
  var nodesOut = [];
  if ( nodes.length == 0 ) { return nodesOut; }
  var limits = filter.limitsFilterCondition( filterClause, nodes );

  for ( var i=limits.start; i<limits.end; i++ )
  {
    var curr = nodes[i];
    if ( filter.perNodeFilterCondition(filterClause, curr) ){
      nodesOut.push( curr );
    }
  }

  return nodesOut;
}


// generates a list of nodes in a random walk with no cycles
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

// randomly chooses an adjacent open node
function selectAdjacentNodeFromList( last, safe ){
  var legal = selectNearbyLegalNodes( last, safe );
  return pickExistingNode( legal );
}



// return all adjacent open and safe nodes by list search
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
        nearby.push( nextNode );
      } else {
        //
      }
    }
  }
  return nearby;
}

// return all adjacent open and safe nodes by grid offset
function selectNearbyLegalFromGrid( last, grid, safe )
{
  var nearby = [];
  for ( var i=0; i < 4; i++ ){
    var offset = getOffset( i );

    var calcx = last.props.x + offset.xoff;
    var calcy = last.props.y + offset.yoff;

    if ( withinDungeonBounds( calcx, calcy ) && withinLegalNodes( safe, calcx, calcy ) ) {
      nextNode = grid[calcx][calcy];
      if ( nextNode.pathTag == "none" ) {
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







function bruteLegalPath( start, end, safe ){

  var tryLimit = 100;

  // copy existing graph and nodes

  for ( var t=0; t<tryLimit; t++ ){
    var added = [];
    var last = start;

    var bailout = 300;

    for ( var i=0; i < bailout; i++ ){
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

}





function findLegalPaths( p1, p2, dungeonGraph, safe ){
  var tempGrid = createGrid( dungeonGraph.nodes, dungeonGraph );
  navigateFromNode( p1, p2, [], tempGrid, safe );
}


function navigateFromNode( node, target, path, grid, safe ){
  path.push(node);
  if ( found_target(node, target) ){
    // add path to list
    console.log( "found path: " + path.length );
    return;
  }
  var possible = possible_moves(node, path, grid, safe);
  for ( var i=0; i<possible.length; i++ ){
    navigateFromNode( possible[i], target, path, grid, safe );
  }
}

function found_target( node, target ){
  return ( node.props.x == target.props.x && node.props.y == target.props.y );
}

function possible_moves( node, path, grid, safe ){
  // check grid for blocked preexisting nodes
  //var legal = selectNearbyLegalNodes( node, safe );
  var legal = selectNearbyLegalFromGrid( node, grid, safe );
  // check path for blocked taken nodes
  var toRemove = [];
  for ( var i=0; i<legal.length; i++ ){
    var curr = legal[i];
    var foundInPath = path.findIndex( function( e ){
      return (e.props.x == curr.props.x && e.props.y == curr.props.y);
    }) != -1;
    if ( foundInPath ){
      toRemove.push(i);
    }
  }
  for ( var r=0; r<toRemove.length; r++ ){
    legal.splice(r, 1);
  }
  return legal;
}
