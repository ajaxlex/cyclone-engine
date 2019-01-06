function testForFilterCondition(filter, curr, nodes){

  if ( !filter ) { return true; }
  // edge conditions
  var found = findFilterKey( filter, "edge" );
  if ( found ) {
      var match = false;
      if ( found.value == "top" || found.value == "any" ) {
        if ( curr.props.y == 0 ) match = true;
      }
      if ( found.value == "bottom" || found.value == "any" ) {
        if ( curr.props.y == dungeonMission.dimy - 1 ) match =  true;
      }
      if ( found.value == "left" || found.value == "any" ) {
        if ( curr.props.x == 0 ) match = true;
      }
      if ( found.value == "right" || found.value == "any" ) {
        if ( curr.props.x == dungeonMission.dimx - 1 ) match = true;
      }
      if ( !match ) return false;
  }

  // section conditions
  var section = findFilterKey( filter, "section" );
  if ( section ){
    if ( section.value == "any" ) { }
    else if ( section.value == "active" && curr.pathTag != "none" ) { }
    else if ( section.value != curr.pathTag ) { return false; }
  }

  return true;
}


function parseFilterStartEnd( filter, nodes ){
  var searchStart = 0;
  var searchEnd = nodes.length;

  if ( findFilterKey( filter, "before") != null ) {
    searchEnd = findFilterKey( filter, "before").value;
  }
  if ( findFilterKey( filter, "after") != null) {
    searchStart = findFilterKey( filter, "after").value;
  }
  if ( findFilterKey( filter, "start") != null ) {
    searchStart=0; searchEnd=0;
  }
  if ( findFilterKey( filter, "end") != null ) {
    searchStart=nodes.length-1; searchEnd=nodes.length-1;
  }

  if ( searchEnd > nodes.length ) { searchEnd = nodes.length; }
  if ( searchEnd < 0 ) { searchEnd = 0; }
  if ( searchStart > searchEnd ) { searchStart = searchEnd; }

  return { start:searchStart, end:searchEnd };
}


function findFilterKey( filter, key ){
  // split by commas, then by equals
  var pairs = filter.split(",");
  for ( var i=0; i<pairs.length; i++ ){
    var keyval = pairs[i].split("=");
    if ( keyval[0] == key ) {
      return { value: keyval[1] };
    }
  }
}
