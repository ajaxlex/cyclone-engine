function drawBase( tpl )
{
  drawMatrix( tpl.getMap().matrix, tpl.mapArea.x, tpl.mapArea.y );
}

function drawLayer( tpl, idx )
{
  drawMatrix( tpl.getMap().matrix, tpl.mapArea.x, tpl.mapArea.y );
}

function drawMatrix( matrix, xa, ya )
{
  var mapEl = document.getElementById('map');

  for ( var k = 0; k < xa; k++ ){
    for ( var j = 0; j < ya; j++ ){
      var c = "#333";
      var cell = matrix[j][k];

      if ( cell == CELL_ACTIVE ){
        c = "#66F";
        makeSquareOnGrid( j, k, 1, 1, c, 1, baseScale, mapEl );
      } else if ( cell == CELL_MARGIN ){
        c = "#339";
        makeSquareOnGrid( j, k, 1, 1, c, 1, baseScale, mapEl );
      }


    }
  }
}



function drawMap( ms, disp ){

  clearMap();

  var mapEl = document.getElementById('map');
  // draw
  for ( var k = 0; k < ms.mapArea.x; k++ ){
    for ( var j = 0; j < ms.mapArea.y; j++ ){
      var c = "#000";

      var cell = ms.matrix[j][k];

      if ( disp === 0 ){
        // area display
        if ( cell != CELL_EMPTY ){
          c = getColor( cell );
          makeSquareOnGrid( j, k, 1, 1, c, 1, baseScale, mapEl );
        }

        // floor display
      } else if ( disp == 1 ) {
        if ( cell != CELL_EMPTY ){
          c = "#888";
          makeSquareOnGrid( j, k, 1, 1, c, 1, baseScale, mapEl );
        }

        // subregion display
      } else if ( disp == 2 ){
        if ( cell != CELL_EMPTY ){
          c = getSubRegionColor( cell );
          makeSquareOnGrid( j, k, 1, 1, c, 1, baseScale, mapEl );
        }
      }
    }
  }

}


function clearMap(){
  var svg = document.getElementById('map');
  clearSvg( svg );
}

function makeGrid(){
  makeSquareOnGrid( 0, 0, displayArea.x, displayArea.y, "#333", 0, baseScale, document.getElementById('background'));
  var scaleWithOutline = ( baseScale );
  var fontSize = 12;

  for( var i = 0; i < ( displayArea.x / baseScale ); i = i + 10 ){
    makeSquareOnGrid( i * scaleWithOutline, 12, 1, displayArea.y + 200, "#444", 0, 1, document.getElementById('background') );
    makeLabel( i * scaleWithOutline, 10, "#999", fontSize, i, document.getElementById('background') );
  }

  for( var k = 0; k < ( displayArea.y / baseScale ); k = k + 10 ){
    makeSquareOnGrid( 12, (k * scaleWithOutline), displayArea.x + 200, 1, "#444", 0, 1, document.getElementById('background') );
    makeLabel( 0, (k * scaleWithOutline) + fontSize - 2, "#999", fontSize, k, document.getElementById('background') );
  }
}





/*

var lkpMatrix = create2DArray( 3, 3 );

function makeLookup(){
  var xoff = 110;
  var yoff = 10;
  var xinc = 4;

  var c = "#666";

  var code = makeLabel( 110 * baseScale, ( ( yoff + 4 ) * baseScale ) + 18, "#999", 18, 0, document.getElementById('lookup') );

  for ( var k = 0; k < 3; k++ ){
    for ( var j = 0; j < 3; j++ ){
      var ox = xoff + j;
      var oy = yoff + k;
      var r = makeSquareOnGrid( ox, oy, 1, 1, c, 1, baseScale, document.getElementById('lookup') );
      r.parent = this;
      r.j = j;
      r.k = k;
      r.code = code;
      r.onclick = function(){
        var curr = this.parent.lkpMatrix[this.j][this.k];
        if ( curr == CELL_EMPTY ) {
          this.style.fill = "#6F6";
          this.parent.lkpMatrix[this.j][this.k] = 999;
        } else {
          this.style.fill = "#666";
          this.parent.lkpMatrix[this.j][this.k] = CELL_EMPTY;
        }
        this.code.childNodes[0].nodeValue = this.parent.calcOrientationLKP( 111, 11 );
      }
    }
  }
}


function calcOrientationLKP( x, y ){

  var accumulator = 1;
  var val = 0;

  for ( var k = 0; k < 3; k++ ){
    for ( var j = 0; j < 3; j++ ){
      if ( lkpMatrix[j][k] != CELL_EMPTY ){
        val += accumulator;
      }
      accumulator = 2 * accumulator;
    }
  }
  return val;
}


*/
