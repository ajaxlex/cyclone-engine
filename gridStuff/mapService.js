function mapService(){

  this.mapArea = { x: 100, y: 100 };
  this.matrix = create2DArray( this.mapArea.x, this.mapArea.y );
  init2DArray( this.matrix, CELL_EMPTY );
  this.rooms = [];


  this.addShape = function( points, tlx, tly ){

    // TODO - this will handle addition of all shape elements to the map,
    // including room id, region id, subdivision, and content indicators

    for ( var i=0; i<points.length; i++ ){
      this.addPoint( points[i].x + tlx, points[i].y + tly, points[i] );
    }
  }

  this.addPoint = function( x, y, cell ){
    this.matrix[x][y] = cell;
  }

  this.readPoint = function( x, y ){
    if ( x < 0 || y < 0 || x >= this.mapArea.x || y >= this.mapArea.y ){
      return CELL_BORDER;
    }
    return this.matrix[x][y];
  }

  this.getCell = function( id, x, y, region, subregion, contents ){
    return { id: id, x: x, y: y, region: region, subregion: subregion, contents: contents };
  }

  this.cellPropertyIndex = function( name ){
    if ( name == "region" ) { return 1; }
    if ( name == "subregion" ) { return 2; }
    if ( name == "contents" ) { return 3; }
  }















  function positionOffset( room, cx, cy )
  {
    // pick a room
    // choose a direction offset ( favor center )
    // pick an offset amount

    var i = getRange( rooms.length );

    if ( rooms.length > 1 ){
      var safety = 0;
      do {
        i = getRange( rooms.length );
        safety++;
      } while ( rooms[i].group != room.group && safety < rooms.length * 5 );
    }
    var chosen = rooms[i];

    var d = getRange( 4 );

    var x = cx;
    var y = cy;

    if ( rooms.length > 0 ) {
      room.parent = i;
      // offset from main axis
      var primaryOffset = getRange( 2 ) + 1;

      // low weight drift on secondary axis
      var secondaryOffset = 0;
      var weight = 2; // 0 - 10 - higher is more likely
      var drift = 16; // drift range
      if ( getRange( 10 ) < weight ){
        secondaryOffset = getRange( drift ) - Math.floor(drift / 2);
      }

      switch( d ){
        case 0:
            x = chosen.x + secondaryOffset; y = chosen.y - room.l - primaryOffset;
            break;
        case 1:
            x = chosen.x + chosen.w + primaryOffset; y = chosen.y + secondaryOffset;
            break;
        case 2:
            x = chosen.x + secondaryOffset; y = chosen.y + chosen.l + primaryOffset;
            break;
        case 3:
            x = chosen.x - room.w - primaryOffset; y = chosen.y + secondaryOffset;
            break;
      }
    }

    return bundleAndRound( x, y );
  }







///////////////
// overlap
///////////////

  this.noCollision = function( room ){

    for ( var i=0; i<room.cells.length; i++ ){
      var cell = room.cells[i];
      if ( readPoint( cell.x, cell.y ) != CELL_EMPTY ) {
        return false;
      }
    }

    return true;
  }


}
