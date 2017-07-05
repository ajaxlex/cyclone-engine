
      function mousemove( evt )
      {
        /*
        var t = coordsFromMouse( evt );

        if ( cursor === null )
        {
          c = "#AA8";
          var mapEl = document.getElementById('map');
          cursor = makeSquareOnGrid( t.x, t.y, 1, 1, c, 1, baseScale, mapEl );
        }

        var o = 1;
        var scale = baseScale;

        cursor.setAttributeNS(null, 'x', (t.x * scale) + o );
        cursor.setAttributeNS(null, 'y', (t.y * scale) + o );

        evt.preventDefault();
        */
      }

      function mousedown( evt )
      {
        /*
        var t = coordsFromMouse( evt );
        currPoint = t;
        evt.preventDefault();
        */
      }

      function mouseup( evt )
      {
        /*
        var t = coordsFromMouse( evt );

        var c = CELL_ACTIVE;

        if ( evt.shiftKey ){
          c = CELL_EMPTY;
        }

        if ( t.x == currPoint.x && t.y == currPoint.y ){
          setPoint( t.x, t.y, c );
        } else {
          fillRect( currPoint, t, c );
        }
        cursor = null;
        //drawMap( ms, 1 );
        drawLayer( tpl, currentLayer );
        evt.preventDefault();
        */
      }

      function fillRect( p1, p2, c )
      {
        if ( p1.x < p2.x ) {
          sx = p1.x; ex = p2.x;
        } else {
          sx = p2.x; ex = p1.x;
        }

        if ( p1.y < p2.y ) {
          sy = p1.y; ey = p2.y;
        } else {
          sy = p2.y; ey = p1.y;
        }

        if ( ex > getMapArea().x )
        {
          ex = getMapArea().x;
        }
        if ( ey > getMapArea().y )
        {
          ey = getMapArea().y;
        }

        for ( var x = sx; x <= ex; x++ ){
          for ( var y = sy; y <= ey; y++ ){
            setPoint( x, y, c );
          }
        }
      }

      function coordsFromMouse( evt )
      {
        pt.x = evt.clientX;
        pt.y = evt.clientY;

        var t = screenToGrid( pt.x, pt.y );

        return t;
      }

      function screenToGrid( sx, sy )
      {
        var xoff = 10;
        var yoff = 10;
        var cellx = 8;
        var celly = 8;

        // The cursor point, translated into svg coordinates
        //var cursorpt =  pt.matrixTransform(svg.getScreenCTM().inverse());

        var tx = Math.floor(( sx - xoff ) / cellx);
        var ty = Math.floor(( sy - yoff ) / celly);

        return { x: tx, y: ty }
      }


      document.onkeypress = function(evt) {
          evt = evt || window.event;
          var charCode = evt.keyCode || evt.which;
          var charStr = String.fromCharCode(charCode);
          //alert(charStr);

          if ( charStr == 'n' ){
            drawMap(ms, 0);
          }
      };
