function isEqual( objective, value ){
  return ( objective == value );
}

function report( test, label ){
  var state = test ? " passed." : " failed.";
  output( label + " : " + state );
}

function output( string )
{
  var existing = document.getElementById("output").innerHTML;
  document.getElementById("output").innerHTML = existing + "\n<br/>" + string;
}

function outputDivider( label )
{
  var existing = document.getElementById("output").innerHTML;
  var out = "\n<br/>\n<br/>";
  out += "-- " + label + " -----------------------------------------------";
  out += "\n<br/>";

  document.getElementById("output").innerHTML = existing + out;
}

function outputClear()
{
  document.getElementById("output").innerHTML = "";
}
