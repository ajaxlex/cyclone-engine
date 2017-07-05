
function clearSvg( svg )
{
  svg.parentNode.replaceChild( svg.cloneNode(false), svg );
}

function getDimensionsForGrid( x, y, w, l, o, scale ) {

  var xs = ( x * scale ) + o;
  var ys = ( y * scale ) + o;
  var ws = ( w * scale ) - (o*2);
  var ls = ( l * scale ) - (o*2);

  var dimensions = { x: xs, y: ys, w: ws, l: ls };

  return dimensions;
}

function makeSquareOnGrid( x, y, w, l, c, o, scale, target ) {
  var xs = ( x * scale ) + o;
  var ys = ( y * scale ) + o;
  var ws = ( w * scale ) - (o*2);
  var ls = ( l * scale ) - (o*2);

  makeRect( xs, ys, ws, ls, c, target );
}


function makeGroup( x, y, target ) {
  var g = document.createElementNS(svgns, 'svg');
  g.setAttributeNS(null, 'x', x );
  g.setAttributeNS(null, 'y', y );

  target.appendChild(g);
  return g;
}

function makeRect( x, y, w, l, c, target ) {
  nval++;

  var rect = document.createElementNS(svgns, 'rect');

  rect.setAttributeNS(null, 'id', nval );
  rect.setAttributeNS(null, 'x', x );
  rect.setAttributeNS(null, 'y', y );
  rect.setAttributeNS(null, 'width', w );
  rect.setAttributeNS(null, 'height', l );
  rect.setAttributeNS(null, 'fill', c );

  //rect.setAttributeNS(null, 'fill-opacity', 0.5 );

  target.appendChild(rect);
  return rect;
}

function makeLabel( x, y, c, size, value, target ){

  var label = document.createElementNS(svgns,"text");

  label.setAttributeNS(null, 'x', x );
  label.setAttributeNS(null, 'y', y );
  label.setAttributeNS(null, 'fill', c);
  label.setAttributeNS(null, 'style', 'font-family: impact, georgia; font-size:' + size + 'px');

  var textNode = document.createTextNode(value);
  label.appendChild(textNode);

  target.appendChild(label);
  return label;
}

function makeLine( p1, p2, width, c, target ){
  nval++;

  var line = document.createElementNS(svgns, "line");

  line.setAttribute('x1', p1.x);
  line.setAttribute('y1', p1.y);
  line.setAttribute('x2', p2.x);
  line.setAttribute('y2', p2.y);
  line.setAttribute('stroke', c);
  line.setAttribute('stroke-width', width);

  target.appendChild(line);

  return line;
}

function makePathMid( p1, p2, width, c, target ){
  // a path with two segments, and point at midpoint

  var path = document.createElementNS(svgns, "path");

  var midx = ( p1.x + p2.x ) / 2;
  var midy = ( p1.y + p2.y ) / 2;

  var composed = "M" + p1.x + "," + p1.y + " L" + midx + "," + midy + " L" + p2.x + "," + p2.y;

  path.setAttribute('d', composed);
  path.setAttribute('stroke', c);
  path.setAttribute('stroke-width', width);

  target.appendChild(path);

  return path;  
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
