



function pickExistingNodeWeighted( nodes, filterClause, target )
{
  // calc manhattan dist to target for all nodes
  // assign a random weight

  var nodesFound = getNodes( nodes, filterClause );
  var count = nodesFound;
  var distances = [];
  var total = 0;
  for ( var d=0; d<count; d++){
    distances[d] = manhattanDistance( nodesFound[d], target );
    total += distances[d];
  }

  // now, give a _little_ extra weight to nodes that are closer to the target
  // this weight could be increased if there have been more nodes already searched to give 'urgency'


}












function findLegalPaths( p1, p2, dungeonGraph, avoid ){
  var tempGrid = createGrid( dungeonGraph.nodes, dungeonGraph );
  navigateFromNode( p1, p2, [], tempGrid, avoid );
}


function navigateFromNode( node, target, path, grid, avoid ){
  path.push(node);
  if ( found_target(node, target) ){
    // add path to list
    console.log( "found path: " + path.length );
    return;
  }
  var possible = possible_moves(node, path, grid, avoid);
  for ( var i=0; i<possible.length; i++ ){
    navigateFromNode( possible[i], target, path, grid, avoid );
  }
}

function found_target( node, target ){
  return ( node.props.x == target.props.x && node.props.y == target.props.y );
}

function possible_moves( node, path, grid, avoid ){
  // check grid for blocked preexisting nodes
  //var legal = selectNearbyLegalNodes( node, avoid );
  var legal = selectNearbyLegalFromGrid( node, grid, avoid );
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
