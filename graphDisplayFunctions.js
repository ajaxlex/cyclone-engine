
function drawNode( node )
{
    var mapEl = document.getElementById('map');

    var group = makeGroup( node.render.x, node.render.y, mapEl );

    var baseRect = makeRect(
      0,
      0,
      node.render.width,
      node.render.length,
      node.render.color,
      group );

    if ( node.title != null )
    {
      var lcolor = "#77B";
      var margin = 15;

      makeLabel( 0, node.render.length + margin, lcolor, 13, node.title, group );
    }

    drawFeatures( node, group );
}

function drawFeatures( node, group )
{
  if ( node.features.length > 0 ){
    var fcolor = "#77B";
    for ( var i=0; i < node.features.length; i++ ){
      if ( node.features[i].f == FEAT_MONSTER ){
        fcolor = "#F33";
      };

      // how to calculate feature position?
      if ( i == 0 ){
          makeRect( 5, 5, 10, 10, fcolor, group);
      }
    }
  }
}



function drawEdges( node )
{
  for ( var i=0; i < node.edges.length; i++ )
  {
    drawEdge( node.edges[i] );
  }
}

function drawEdge( edge )
{
  var mapEl = document.getElementById('map');

  if ( edge.n1 != null && edge.n2 != null && edge.drawn == false ) {

    edge.drawn = true;

    line = makePathMid( edge.render.p1, edge.render.p2, edge.render.width, edge.render.color, mapEl );

    if ( edge.options.indexOf( EDGE_VIEW ) != -1 ){
      line.setAttribute( 'stroke-dasharray', '5,5');
      line.setAttribute( 'stroke', '#77B');
    }

    if ( edge.options.indexOf( EDGE_FWD ) != -1 ){
      line.setAttribute( 'marker-end', 'url(#arrow)');
    }

    if ( edge.options.indexOf( EDGE_LOCK ) != -1 ){
      line.setAttribute( 'marker-mid', 'url(#lock)');
    }
  }

}

function getCenter( node )
{
  // probably will need to pass in some context info
  var x = node.render.x + ( node.render.width / 2 );
  var y = node.render.y + ( node.render.length / 2 );

  return { x: x, y: y };
}

function getClosestEdge( p1, p2, width )
{
    var half = width / 2;
    var dh = ( p1.x < p2.x ) ? p2.x - p1.x : p1.x - p2.x;
    var dv = ( p1.y < p2.y ) ? p2.y - p1.y : p1.y - p2.y;

    var e1 = p1;
    var e2 = p2;

    if ( dv < dh ) {
      if ( p1.x < p2.x ) {
        // rt edge of p1 to lt edge of p2
        e1.x += half;
        e2.x -= half;
        return { e1: e1, e2: e2 };
      } else {
        // lt edge of p1 to rt edge of p2
        e2.x += half;
        e1.x -= half;
        return { e1: e1, e2: e2 };
      }
    } else {
      if ( p1.y < p2.y ) {
        // bt edge of p1 to tp edge of p2
        e1.y += half;
        e2.y -= half;
        return { e1: e1, e2: e2 };
      } else {
        // tp edge of p1 to bt edge of p2
        e2.y += half;
        e1.y -= half;
        return { e1: e1, e2: e2 };
      }
    }
}
