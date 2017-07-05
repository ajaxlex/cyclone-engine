
var extentsType = function( tlxin, tlyin, brxin, bryin ){
  this.tlx = tlxin != null ? tlxin : 0;
  this.tly = tlyin != null ? tlyin : 0;
  this.brx = brxin != null ? brxin : 0;
  this.bry = bryin != null ? bryin : 0;
}

updateExtents = function( extentsObject, comparison ){
  // compare a point
  if ( comparison.x != null ) {
    if ( extentsObject.tlx > comparison.x ) { extentsObject.tlx = comparison.x; }
    if ( extentsObject.tly > comparison.y ) { extentsObject.tly = comparison.y; }
    if ( extentsObject.brx < comparison.x ) { extentsObject.brx = comparison.x; }
    if ( extentsObject.bry < comparison.y ) { extentsObject.bry = comparison.y; }
  // compare an extent
  } else if ( comparison.tlx != null ) {
    if ( extentsObject.tlx > comparison.tlx ) { extentsObject.tlx = comparison.tlx; }
    if ( extentsObject.tly > comparison.tly ) { extentsObject.tly = comparison.tly; }
    if ( extentsObject.brx < comparison.brx ) { extentsObject.brx = comparison.brx; }
    if ( extentsObject.bry < comparison.bry ) { extentsObject.bry = comparison.bry; }
  }
}


function shapeType(  startPoints ){

  this.initialize = function(){
    this.extents = new extentsType();
    this.localLookup = [];
    this.points = [];
    if (startPoints != null) this.addPoints(startPoints);
  }

  this.addPoints = function( added, overwrite ){
    var addedExtents = new extentsType();

    for ( var i=0; i<added.length; i++ ){
      var adding = added[i];
      addUniquePoint( adding.x, adding.y, this.points );
      updateExtents( addedExtents, adding );
    }

    this.updateLocalMatrix( addedExtents );
  }

  this.updateLocalMatrix = function( newExtents ){
    // if the added extents are greater in any dimension than the existing extents,
    // then extend the localMatrix to accomadate
    updateExtents( this.extents, newExtents );

    // adjust extents to zero them - all coordinates will have to be adjusted too
    var xoff = 0;
    var yoff = 0;

    if ( this.extents.tlx < 0 ) {
      xoff = 0-this.extents.tlx;
      this.extents.tlx += xoff;
      this.extents.brx += xoff;
    }

    if ( this.extents.tly < 0 ) {
      yoff = 0-this.extents.tly;
      this.extents.tly += yoff;
      this.extents.bry += yoff;
    }

    newmatrix = create2DArray( this.extents.brx+1, this.extents.bry+1 );
    init2DArray( newmatrix, CELL_EMPTY );

    for ( var i=0; i < this.points.length; i++ ){
      point = this.points[i];
      point.x += xoff;
      point.y += yoff;
      newmatrix[point.x][point.y] = i;
    }

    this.localLookup = newmatrix;
  }

  this.safeRead = function( x, y ){
    if ( x >= 0 && y >= 0 && x <= this.extents.brx && y <= this.extents.bry ){
      var index = this.localLookup[x][y];
      if ( index == -1 ) { return CELL_EMPTY; }
      return this.points[index];
    }
    return CELL_EMPTY;
  }

  this.initialize();
}
