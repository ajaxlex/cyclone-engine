// These functions extend the base graph types to satisfy the grid-based dungeon

function addRoom( i, k )
{
  var n = dungeonMission.addRoom( i, k, null );
  addNodeRenderProperties( n );
  n.render.color = "#666";
  return n;
}

function addEdge( n1, n2, options )
{
  var e = Connection( n1, n2, options );
  addEdgeRenderProperties( e );
  return e;
}


//
// Dungeon Factories
//

function Dungeon()
{
  var g = Object.create(Graph);
  g.init();
  g.setDimension = function( dimx, dimy )
  {
      g.dimx = dimx;
      g.dimy = dimy;
  };

  g.addRoom = function( x, y, title )
  {
      var r = RoomNode( x, y, title );
      this.addNode( r );
      return r;
  };

  g.getNodeAt = function( x, y )
  {
      for ( var i=0; i < this.nodes.length; i++ ) {
        if ( this.nodes[i].props.x == x && this.nodes[i].props.y == y )
        {
          // there should not be more than one
          return this.nodes[i];
        }
      }
  };

  g.copy = function()
  {
    // create base object.  Copy dimensions.
    // for each node,
    //  create a node copy and add to base copy
    //  for each connection in node
    //    determine opposite node ( if any )
    //    check to see wether connection is already added
    //      if not, create a connection and associate to each of the indicated nodes
  }


  return g;
}


function RoomNode( x, y, title )
{
  var r = Object.create(Node);
  r.init();

  r.props = { x: x, y: y };
  r.title = title;
  r.features = [];

  r.addFeature = function( text, featureType )
  {
    this.features.push( { t: text, f: featureType  } );
  };

  return r;
};



function Connection( n1, n2, options )
{
  var e = Object.create(Edge);
  e.init( n1, n2 );
  if ( !options ) { options = []; }
  e.options = options;
  dungeonMission.connect( n1, n2, e );

  return e;
}



////////////
// Display Stuff
////////////

function clearEdgeFlags( g )
{
  for ( var i=0; i<g.nodes.length; i++ )
  {
    var edges = g.nodes[i].edges;
    for ( var k=0; k<edges.length; k++ )
    {
      edges[k].drawn = false;
    }
  }
}

function addNodeRenderProperties( n )
{
  dimensions = getDimensionsForGrid( n.props.x, n.props.y, 1, 1, 20, 120 );

  n.render = {
    x: dimensions.x,
    y: dimensions.y,
    width: dimensions.w,
    length: dimensions.l,
    color:"#66F",
    offset: dimensions.o,
    scale: dimensions.s
  };
};

function addEdgeRenderProperties( e, options )
{
  if ( e.n1 != null && e.n2 != null ) {
    var n1center = getCenter( e.n1 );
    var n2center = getCenter( e.n2 );

    var points = getClosestEdge( n1center, n2center, e.n1.render.width );

    e.render = {
      p1: points.e1,
      p2: points.e2,
      width: 3,
      color: "#CC6"
    }
  }
};
