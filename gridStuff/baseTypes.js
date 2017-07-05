var CELL_ACTIVE = 1000;
var CELL_EMPTY = 0;
var CELL_MARGIN = 1100;


function template( sx, sy )
{
  this.mapArea = { x: sx, y: sy };
  this.layers = [];

  var self = this;

  this.addLayer = function()
  {
    var xdim = self.mapArea.x;
    var ydim = self.mapArea.y;

    self.layers.push( new layer( xdim, ydim, self.layers.length ) );
  }

  this.getLayer = function( index )
  {
    if ( index >= 0 && index < self.layers.length )
    {
      return self.layers[index];
    }
  }

  this.getMap = function()
  {
    return self.getLayer(0);
  }

  this.setPoint = function( x, y, z, c )
  {
    if ( z >=0 && z < self.layers.length )
    {
      self.layers[z].addPoint( x, y, c );
    }
  }

  this.getPoint = function( x, y, z )
  {
    if ( z >=0 && z < self.layers.length )
    {
      return self.layers[z].readPoint( x, y );
    }
  }

  this.addLayer();
}

function layer( sx, sy, ord )
{
  this.mapArea = { x: sx, y: sy };
  this.ordinal = ord;
  this.matrix = create2DArray( this.mapArea.x, this.mapArea.y );
  init2DArray( this.matrix, CELL_EMPTY );

  var self = this;

  this.addActive = function( x, y ){
    self.addPoint( x, y, CELL_ACTIVE );
  }

  this.addBorder = function( x, y ){
    self.addPoint( x, y, CELL_MARGIN );
  }

  this.clearPoint = function( x, y ){
    self.addPoint( x, y, CELL_EMPTY );
  }

  this.addPoint = function( x, y, cell ){
    if ( x>=0 && y>=0 && x<self.mapArea.x && y<self.mapArea.y) {
      self.matrix[x][y] = cell;
    }
  }

  this.readPoint = function( x, y ){
    if ( x>=0 && y>=0 && x<self.mapArea.x && y<self.mapArea.y) {
      return self.matrix[x][y];
    }
    return CELL_EMPTY;
  }

  this.setColor = function( color ){
    self.color = color;
  }
}
