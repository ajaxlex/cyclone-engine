function generateTestLine( x0, y0, x1, y1 ){
  var ln = getLine( x0, y0, x1, y1 );
  for ( var i=0; i<ln.length; i++){
    var curr = ln[i];
    var n = addRoom( curr.x, curr.y );
    n.pathTag = "primary";
    n.render.color = "#55C";
  }
}

function generateTestEdge(){
    var chosen = getNodes( dungeonMission.nodes, "section=any,edge=any", dungeonMission );

    mapFunction( chosen, function( n, i ) {
      n.pathTag = "secondary";
      n.render.color = "#FB3";
    });
}
