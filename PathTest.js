

function initGraph()
{

  addBaseNodes();

  generatePaths();

}


function generatePaths()
{
  var pnodes = generatePrimaryPath( 11 );

  var side1 = generateSidePaths( 3 );

  var side2 = generateSidePaths( 3 );
}


function addBaseNodes()
{
  for ( var i=0; i<dungeonMission.dimx; i++ )
  {
    for ( var k=0; k<dungeonMission.dimy; k++ )
    {
      addRoom( i, k );
    }
  }
}

function generatePrimaryPath( length )
{
  var start = pickStartNode();
  start.render.color = "#55C";

  var added = getNodePath( start, length );

  mapFunction( added, function( n ){ n.primary = true; } );

  return added;
}





function generateSidePaths( length )
{
  var start = pickExistingNode( "" );

  var added = getNodePath( start, length );

  mapFunction( added, function( n, i ) {
    n.secondary = true;
    n.render.color = "#FB3";
  } );
}


function pickExistingNode( filter )
{
  var nodes = getNodes( filter );

  var chosen = getRandomInt( nodes.length );

  return nodes[chosen];
}


function getNodes( filter )
{
  // filters might include -> on edge, primary path,

  var nodes = [];

  for ( var i=0; i<dungeonMission.nodes.length; i++ )
  {
    var curr = dungeonMission.nodes[i];

    // EXISTING
    if ( curr.primary == true ) {
      nodes.push( curr );
    }
  }

  return nodes;
}

// reutrns a list of nodes
function getNodePath( start, num )
{
  var added = [];
  var last = start;

  for ( var i=0; i < num; i++ ){
    var next = selectAdjacentNode( last );
    if ( next ){
      next.render.color = "#77B";
      addEdge( last, next, [ EDGE_FWD ] );
      added.push( next );
      last = next;
    }
  }
  return added;
}



// selects adjacent node on a rectangular grid
function selectAdjacentNode( last )
{
  var nextNode = null;
  var abort = 0;

  // fairly inefficient.  A search that eliminates each remaining path would be better

  while ( abort < ESCAPE ) {
    abort++;

    var xoff = 0;
    var yoff = 0;

    var ra = getRandomInt( 4 );

    if ( ra == DIR_N ) { yoff = -1; }
    if ( ra == DIR_E ) { xoff = 1; }
    if ( ra == DIR_S ) { yoff = 1; }
    if ( ra == DIR_W ) { xoff = -1; }

    calcx = last.props.x + xoff;
    calcy = last.props.y + yoff;

    if ( calcx >= 0 && calcy >= 0 && calcx < dungeonMission.dimx && calcy < dungeonMission.dimy ) {
      nextNode = dungeonMission.getNodeAt( calcx, calcy );
      if ( !nextNode.chosen ) {
        nextNode.chosen = true;
        return nextNode;
      } else {
        nextNode = null;
      }
    }
  }
}


function pickStartNode()
{
  var ra = getRandomInt( 4 );
  var x = 0;
  var y = 0;

  if ( ra == 0 ) {
    x = 0;
    y = getRandomInt( dungeonMission.dimy - 1 ) + 1;
  } else if ( ra == 1 ) {
    x = getRandomInt( dungeonMission.dimx - 1 );
    y = 0;
  } else if ( ra == 2 ) {
    x = dungeonMission.dimx - 1;
    y = getRandomInt( dungeonMission.dimy - 1 );
  } else if ( ra == 3 ) {
    x = getRandomInt( dungeonMission.dimx - 1 ) + 1;
    y = dungeonMission.dimy - 1;
  }

  var start = dungeonMission.getNodeAt( x, y );
  start.chosen = true;
  return start;
}


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
