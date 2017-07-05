function roomNode( mapService, startPoints ){

  // points are typically 2d coords
  // cells are fully descriptive contents at a given 2d coord
  // indexes are lookups to the cell list



  this.initalize = function(){
    // must generate unique room id to populate matrix
    this.id = 1;
    this.cells = [];
    this.extents = new extentsType();
    this.tlcorner = { x:0, y: 0 };

    if (startPoints != null) this.addPoints(startPoints);
  }

  this.setPosition = function( x, y ) {
    this.tlcorner.x = x;
    this.tlcorner.y = y;
  }

  this.addToMap = function() {
    mapService.addShape( this.cells, this.tlcorner.x, this.tlcorner.y );
  }

  this.addPoints = function( added, overwrite ){
    var addedExtents = new extentsType();
    var addedIndices = [];

    // overwrite set true will replace existing cell elements
    if ( overwrite == null ) { overwrite = false; }
    var DO_NOT_ADD = -1;

    for ( var i=0; i<added.length; i++ ){
      var adding = added[i];
      var target = DO_NOT_ADD;

      if ( this.localLookup == null || adding.x < this.extents.tlx || adding.x > this.extents.brx
      || adding.y < this.extents.tly || adding.y > this.extents.bry ){
          target = this.cells.length;
      } else {
        var index = this.localLookup[adding.x][adding.y];
        if ( index == CELL_EMPTY ) {
          target = this.cells.length;
        } else if ( overwrite ){
          target = index;
        }
      }

      if ( target != DO_NOT_ADD ) {
        if ( adding.id == null ){
          this.cells[target] = mapService.getCell( this.id, adding.x, adding.y, 0, 0, 0 );
        } else if ( adding.id != this.id ) {
          this.cells[target] = mapService.getCell( this.id, adding.x, adding.y, adding.region, adding.subregion, adding.contents );
        } else {
          this.cells[target] = adding;
        }
        addedIndices[addedIndices.length] = target;

        // Recalculate extents
        updateExtents( addedExtents, { x:adding.x, y:adding.y } );
      }
    }

    this.updateLocalMatrix( addedExtents );
    return addedIndices;
  }

  this.rotate = function( angle ){
    // for now, just handling 90 degree rotations
    newmatrix = create2DArray( this.extents.bry+1, this.extents.brx+1 );

    for (var x=0; x<=this.extents.brx; x++)
    {
       for (var y=0; y<=this.extents.bry; y++)
       {
         var index = this.localLookup[x][y];
         newmatrix[y][this.extents.brx-x] = index;
         this.cells[index].x = y;
         this.cells[index].y = this.extents.brx-x;
       }
    }

    var newx = this.extents.bry;
    var newy = this.extents.brx;
    this.extents.brx = newx;
    this.extents.bry = newy;

    this.localLookup = newmatrix;
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

    for ( var i=0; i < this.cells.length; i++ ){
      cell = this.cells[i];
      cell.x += xoff;
      cell.y += yoff;
      newmatrix[cell.x][cell.y] = i;
    }

    this.localLookup = newmatrix;
  }


  this.setCellProperty = function( points, property, value ){
    var ptype = mapService.cellPropertyIndex( property );

    for ( var i=0; i<points.length; i++ ){
      point = points[i];
      index = this.localLookup[point.x][point.y];
      if ( index != CELL_EMPTY ){
        if ( ptype == 1 ) { this.cells[index].region = value; }
        else if ( ptype == 2 ) { this.cells[index].subregion = value; }
        else if ( ptype == 3 ) { this.cells[index].contents = value; }
      }
    }
  }


  this.subdivide = function( orientation, divisions, region ){
    // TODO limit divisions for sanity
    if ( region == null ) { region = 0; }

    var rextents = this.getRegionExtents( region );
    var split;

    if ( orientation == ORIENT_V ){
      split = Math.ceil((rextents.bry+1) / divisions);
    } else if ( orientation == ORIENT_H ){
      split = Math.ceil((rextents.brx+1) / divisions);
    }

    for ( var i=0; i<divisions; i++ ){
      var ostart = i*split;
      var oend = (i+1)*split;

      var nextRegion = 2+i;

      if ( orientation == ORIENT_V ) {
        for ( var y=rextents.tly + ostart; y<rextents.tly + oend; y++ ) {
          for( var x=rextents.tlx; x<=rextents.brx; x++ ) {
            var index = this.localLookup[x][y];
            this.cells[index].subregion = nextRegion;
          }
        }
      } else if ( orientation == ORIENT_H ) {
        for ( var y=rextents.tly; y<=rextents.bry; y++ ) {
          for( var x=rextents.tlx + ostart; x<rextents.tlx + oend; x++ ) {
            var index = this.localLookup[x][y];
            this.cells[index].subregion = nextRegion;
          }
        }
      }

    }
    // add new region ids to big list?
    // return list of new region ids?
  }

  this.getRegionExtents = function( region ){
    var regionExtents = new extentsType();
    for ( var i=0; i< this.cells.length; i++ ){
      var cell = this.cells[i];
      if ( cell.subregion == region ){
        updateExtents( regionExtents, { x: cell.x, y: cell.y });
      }
    }
    return regionExtents;
  }

  this.combineRegions = function( r1, r2 ){
    for ( var i=0; i< this.cells.length; i++ ){
      var cell = this.cells[i];
      if ( cell.subregion == r2 ){
        cell.subregion = r1;
      }
    }
    return r1;
  }

  this.removePoints = function( points ){
    var newCells = [];
    var remove = [];

    for ( var i=0; i<points.length; i++ ){
      var point = points[i];
      index = this.localLookup[point.x][point.y];
      remove[remove.length] = index;
      this.localLookup[point.x][point.y] = CELL_EMPTY;
    }

    // remove points must be ordered from high to low
    remove.sort(function( a, b ) { return b-a; });
    for ( var i=0; i<remove.length; i++ ){
      index = remove[i];
      this.cells.splice( index, 1 );
    }
    //TODO ok, now may be time to recalculate bounds and update positions
  }

  this.safeRead = function( x, y ){
    if ( x >= 0 && y >= 0 && x <= this.extents.brx && y <= this.extents.bry ){
      var index = this.localLookup[x][y];
      return this.cells[index];
    }
    return CELL_EMPTY;
  }

  this.getPointsFromIndices = function( indices ){
    var points = [];
    for ( var i=0; i<indices.length; i++ ){
      var index = indices[i];
      points[points.length] = { x: this.cells[index].x, y: this.cells[index].y };
    }
    return points;
  }

  this.getIndicesForRegion = function( subregion ){
    var indices = [];
    for ( var i=0; i<this.cells.length; i++ ){
      if ( this.cells[i].subregion == subregion ){
        indices.push( i );
      }
    }
    return indices;
  }

  this.getPointsForRegion = function( subregion ){
    var points = [];
    var indices = this.getIndicesForRegion( subregion );
    for ( var i=0; i<indices.length; i++ ){
      var index = indices[i];
      points[points.length] = { x:this.cells[index].x, y:this.cells[index].y }
    }
    return points;
  }

  this.getCenterLine = function( orientation, subregion ) {
    if ( subregion == null ){ subregion = 0; }

    var points = [];

    var rextents = this.getRegionExtents( subregion );
    var mid = { x: Math.floor(rextents.brx / 2), y: Math.floor(rextents.bry / 2) }
    // TODO - could return two lines in the case where the mid is not a whole number

    if ( orientation == ORIENT_H ){
      // scan from this.extents.tlx, mid.y to this.extents.brx, mid.y
      for ( var i=this.extents.tlx; i<=this.extents.brx; i++){
          points[points.length] = { x:i, y:mid.y };
      }
    } else if ( orientation == ORIENT_V ){
      // scan from mid.x, this.extents.tly, to mid.x, this.extents.bry
      for ( var i=this.extents.tly; i<=this.extents.bry; i++){
          points[points.length] = { x:mid.x, y:i };
      }
    }
    return points;
  }

  this.getSide = function( side ){
    var points = [];
    if ( side == DIR_N ){
      for ( var x=0; x<=this.extents.brx; x++ ){
        for ( var y=-1; y<=this.extents.bry; y++ ){
          if ( this.safeRead( x, y ) == CELL_EMPTY && this.safeRead( x, y+1 ) != CELL_EMPTY ){
            points[points.length] = { x: x, y: y+1 };
          }
        }
      }
    } else if ( side == DIR_S ){
      for ( var x=0; x<=this.extents.brx; x++ ){
        for ( var y=this.extents.bry + 1; y>=0; y-- ){
          if ( this.safeRead( x, y ) == CELL_EMPTY && this.safeRead( x, y-1 ) != CELL_EMPTY ){
            points[points.length] = { x: x, y: y-1 };
          }
        }
      }
    } else if ( side == DIR_E ){
      for ( var y=0; y<=this.extents.bry; y++ ){
        for ( var x=this.extents.brx+1; x>=0; x-- ){
          if ( this.safeRead( x, y ) == CELL_EMPTY && this.safeRead( x-1, y ) != CELL_EMPTY ){
            points[points.length] = { x: x-1, y: y };
          }
        }
      }
    } else if ( side == DIR_W ){
      for ( var y=0; y<=this.extents.bry; y++ ){
        for ( var x=-1; x<=this.extents.brx; x++ ){
          if ( this.safeRead( x, y ) == CELL_EMPTY && this.safeRead( x+1, y ) != CELL_EMPTY ){
            points[points.length] = { x: x+1, y: y };
          }
        }
      }
    }

    return points;
  }

  this.initalize();
}
