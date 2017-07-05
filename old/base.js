



      function makePath( first, second ){

        var first_x = Math.floor( first.centerx );
        var first_y = Math.floor( first.centery );

        var second_x = Math.floor( second.centerx );
        var second_y = Math.floor( second.centery );

        var p1;
        var p2;

        // Horizontal
        if ( first.centerx < second.centerx )
        { p1 = first; p2 = second; } else { p2 = first; p1 = second; }
        var hpoints = getLinePoints( p1.centerx, first_y, p2.centerx, first_y );

        // Vertical, at end
        if ( first.centery < second.centery )
        { p1 = first; p2 = second; } else { p2 = first; p1 = second; }
        var vpoints = getLinePoints( second_x, p1.centery, second_x, p2.centery );

        // concatenate
        hpoints.push.apply( hpoints, vpoints );

        makePointsFromLine( hpoints );
      }

      function makePointsFromLine( points ){
        for ( var i=0; i < points.length; i++ ){
            addPoint( points[i].x, points[i].y, CELL_HALL );
        }
      }





      function safeRoutePath(){
        // given 2 rooms
        // create a path which:
        //    does not exit or enter any room at a corner ( inside at least 1 from corner )
        //    does not proceed adjacent to a room

        // start from center of first room.
        // favor exit on longest side


      }

      function cleanAllExits(){
        //reroute any passages that run adjacent to a room
      }


// ROOM FUNCTIONS

      function newRoom( x, y, w, l, c, id, parent, group, data ){

        var id_n = id ? id : -1;
        var parent_n = parent ? parent : -1;
        var group_n = group ? group : -1;
        var data_n = data ? data : -1;

        // must calculate later
        //var cx = x + ( w / 2 );
        //var cy = y + ( l / 2 );

        var room = {
          x: x,
          y: y,
          w: w,
          l: l,
          c: c,
          id: id_n,
          parent: parent_n,
          group: group_n,
          centerx: 0,
          centery: 0,
          x2: x+w,
          y2: y+l,
          data: data_n
        }

        return room;
      }

      function generateRelations()
      {
        var relations = [];
        for ( var i=0; i < rooms.length; i++){
          // compile parent child list
          if ( rooms[i].parent != -1 ){
            relations.push( { parent: rooms[i].parent, child: i } );
          }
        }
        return relations;
      }


      function closestRoomToPosition( x1, y1 ){

        var closest = -1;
        var closestDistance = -1;

        for ( var i=0; i < rooms.length; i++){
          var x2 = rooms[i].x;
          var y2 = rooms[i].y;

          var d = Math.sqrt( (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2) );

          if ( d < closestDistance || closestDistance == -1 ) {
            closestDistance = d;
            closest = i;
          }

          if ( rooms[i].parent != -1 ){
            relations.push( { parent: rooms[i].parent, child: i } );
          }
        }
      }

      function closestEdge( first, second ){

        var dx = Math.abs(second.centerx-first.centerx);
        var dy = Math.abs(second.centery-first.centery);

        if ( dx >= dy ){
          if ( first.centery <= second.centery )
          { return 0; } else { return 2; }
        } else {
          if ( first.centerx <= second.centerx )
          { return 3; } else { return 1; }
        }
        return 0;
      }

      function connected( room ){
        var connected = [];
        for ( var i=0; i< rooms.length; i++ ){
          if ( room.i != i ){
            if ( adjacent( room, rooms[i] ) ){
              connected.push( i );
            }
          }
        }
        return connected;
      }

      function adjacent( first, second ){

        if ( first.x == second.x + second.w || first.x + first.w == second.x ){
          return (!( first.y > second.y + second.l || first.y + first.l < second.y ));
        }
        if ( first.y == second.y + second.l || first.y + first.l == second.y ){
          return (!( first.x > second.x + second.w || first.x + first.w < second.x ));
        }
        return false;
      }


      function getExits( room ){
        // traverse room edge
        // remember every cell with CELL_HALL id
        var exits = [];
        for ( x = room.x; x < room.x2; x++ ){
          if ( matrix[x][room.y] == CELL_HALL ){ exits.push({ x: x, y: room.y }); }
          if ( matrix[x][room.y2] == CELL_HALL ){ exits.push({ x: x, y: room.y2 }); }
        }
        for ( y = room.y; y < room.y2; y++ ){
          if ( matrix[room.x][y] == CELL_HALL ){ exits.push({ x: room.x, y: y }); }
          if ( matrix[room.x2][y] == CELL_HALL ){ exits.push({ x: room.x2, y: y }); }
        }
        return exits;
      }


      function generateRoom( cx, cy, lin, hin, data, group ){
        var room = getRandomRoom({ l: lin, h: hin });
        room.group = group;

        var loc = getRandomLocation( room, cx, cy );

        room.x = loc.x;
        room.y = loc.y;
        room.centerx = room.x + ( room.w / 2);
        room.centery = room.y + ( room.l / 2);

        if ( noTest || noCollision( room ) ) {
          addRoom( room );
          return room;
        }
        return false;
      }






      function generateRoomCluster( count, cx, cy, lin, hin, group ){
        var safety = 0;

        for ( var i = 0; i < count; i++ ){
          data = {};

          if ( generateRoom( cx, cy, lin, hin, data, group ) == false ) { i--; }

          safety++;
          if ( safety > count * 20 ) { return; }
        }
      }














      function addRoom( room ){
        room.id = rooms.length;

        makeRoomRectangle( room );
        //outlineRoom( room, 1, "#FF00FF" );
        rooms.push( room );
      }


      function getRandomRoom( vals ){
        var c = "#FF0000";

        var w = getRange(vals.h) + vals.l;
        var l = getRange(vals.l) + vals.l;


        // bigroom protocol
        if ( rooms.length == 0 ) {
          c = "#FF00FF";
          w = getRange(vals.l) + (vals.h) + vals.l;
          l = getRange(vals.l) + (vals.h) + vals.l;
        }

        return newRoom( 0, 0, w, l, c );
      }














  ///////////////
  // locations
  ///////////////


      function getRandomLocation( room, cx, cy ){

        //var pair = positionSimple();
        var pair = positionOffset( room, cx, cy );

        //console.log( "x: " + pair.x + " y: " + pair.y + " RV: " + rval );
        return pair;
      }

      function positionSimple(){
        var x = getRange(mapArea.x);
        var y = getRange(mapArea.y);
        return bundleAndRound( x, y );
      }

      function positionRadial(){
        var mapcenterx = mapArea.x / 2;
        var mapcentery = mapArea.y / 2;

        var twoPI = 2 * Math.PI;

        var r = getRange( (mapcenterx - 0 ) + 25 );
        var a = getRange( twoPI );

        var x = mapcenterx + r * Math.cos(toDegrees(a));
        var y = mapcentery + r * Math.sin(toDegrees(a));

        return bundleAndRound( x, y );
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

            function noCollision( room ){
              if ( room.x < 0 || room.y < 0 || room.x + room.w > mapArea.x || room.y + room.l > mapArea.y ){
                return false;
              }


              for ( var i=0; i < rooms.length; i++ ){
                if ( overlap( room, rooms[i], 0 ) ) { return false; }
              }

              for ( var k = 0; k < room.l; k++ ){
                for ( var j = 0; j < room.w; j++ ){
                  if ( matrix[j][k] != CELL_EMPTY ) { return false; }
                }
              }


              return true;
            }

            function overlap( rm1, rm2, buffer ){
              var l1 = { x: rm1.x - buffer, y: rm1.y - buffer };
              var r1 = { x: rm1.x+rm1.w-1+buffer, y: rm1.y+rm1.l-1+buffer };

              var l2 = { x: rm2.x, y: rm2.y };
              var r2 = { x: rm2.x+rm2.w-1, y: rm2.y+rm2.l-1 };

              if (l1.x > r2.x || r1.x < l2.x)
                  return false;

              if (l1.y > r2.y || r1.y < l2.y)
                  return false;

              return true;
            }



///////////////
// creation
///////////////


      function makeRoomRectangle( room ){
        for ( var k = 0; k < room.l; k++ ){
          for ( var j = 0; j < room.w; j++ ){
            addPoint( j + room.x, k + room.y, room.id );
          }
        }
      }

      function outlineRoom( room, width ){
        for ( var r = 1; r <= width; r++ ){
          for ( var j = 0-r; j < room.w + r; j++ ){
            addPoint( j + room.x, room.y - r, CELL_BORDER );
            addPoint( j + room.x, room.y + room.l - 1 + r, CELL_BORDER  );
          }
          for ( var j = 1-r; j < room.l + r - 1; j++ ){
            addPoint( room.x - r, j + room.y, CELL_BORDER  );
            addPoint( room.x + room.w - 1 + r, j + room.y, CELL_BORDER  );
          }
        }
      }


      function calcAllOrientation(){
        for ( var k = 0; k < mapArea.x; k++ ){
          for ( var j = 0; j < mapArea.y; j++ ){
            if ( matrix[j][k] != CELL_EMPTY ){
              orientation[j][k] = calcOrientation( j, k );
            }
          }
        }
      }

      function calcOrientation( x, y ){

        var accumulator = 1;
        var val = 0;

        for ( var i=0; i<9; i++ ){
          var tx = x + (i % 3) - 1;
          var ty = y + Math.floor(i / 3) - 1;

          var found = 0;
          if (!( tx < 0 || ty < 0 || tx >= mapArea.x || ty >= mapArea.y )){
            if ( matrix[tx][ty] != CELL_EMPTY ){
              found = 1 * accumulator;
            }
          }
          val += found;
          accumulator = 2 * accumulator;
        }
        return val;
      }

      function addPoint( x, y, val ){
        matrix[x][y] = val;
      }
