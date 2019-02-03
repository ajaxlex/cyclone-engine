var Filter = {
  initContext: function( context ){
    // this should contain enough map and other context info
    // for the filter to understand the world
    this.context = context;
  },

  edgeFilter: function( params, curr ){
    if ( params.value == "top" || params.value == "any" ) {
      if ( curr.props.y == 0 ) return true;
    }
    if ( params.value == "bottom" || params.value == "any" ) {
      if ( curr.props.y == this.context.dimy - 1 ) return true;
    }
    if ( params.value == "left" || params.value == "any" ) {
      if ( curr.props.x == 0 ) return true;
    }
    if ( params.value == "right" || params.value == "any" ) {
      if ( curr.props.x == this.context.dimx - 1 ) return true;
    }
    return false;
  },

  sectionFilter: function( params, curr ){
    if ( params.value == "any" ) {}
    else if ( params.value == "active" && curr.pathTag != "none" ) {}
    else if ( params.value != curr.pathTag ) { return false; }
    return true;
  },

  perNodeFilterCondition: function ( filterClause, curr ){
    if ( !filterClause ) { return true; }

    // edge conditions
    var found = this.findFilterKey( filterClause, "edge" );
    if ( found && !this.edgeFilter( found, curr )) { return false; }

    // section conditions
    var section = this.findFilterKey( filterClause, "section" );
    if ( section && !this.sectionFilter( section, curr )) { return false; }

    return true;
  },

  limitsFilterCondition: function( filterClause, nodes ){
    var searchStart = 0;
    var searchEnd = nodes.length;

    if ( this.findFilterKey( filterClause, "before") != null ) {
      searchEnd = this.findFilterKey( filterClause, "before").value;
    }
    if ( this.findFilterKey( filterClause, "after") != null) {
      searchStart = this.findFilterKey( filterClause, "after").value;
    }
    if ( this.findFilterKey( filterClause, "start") != null ) {
      searchStart=0; searchEnd=0;
    }
    if ( this.findFilterKey( filterClause, "end") != null ) {
      searchStart=nodes.length-1; searchEnd=nodes.length-1;
    }

    if ( searchEnd > nodes.length ) { searchEnd = nodes.length; }
    if ( searchEnd < 0 ) { searchEnd = 0; }
    if ( searchStart > searchEnd ) { searchStart = searchEnd; }

    return { start:searchStart, end:searchEnd };
  },

  findFilterKey: function( filterClause, key ){
    // split by commas, then by equals
    var pairs = filterClause.split(",");
    for ( var i=0; i<pairs.length; i++ ){
      var keyval = pairs[i].split("=");
      if ( keyval[0] == key ) {
        return { value: keyval[1] };
      }
    }
  }

}
