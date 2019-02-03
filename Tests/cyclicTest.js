function initGraph()
{
  addBaseNodes();
  generatePaths();
}


function generatePaths()
{
  var start = dungeonMission.getNodeAt(0, 2);
  var end = dungeonMission.getNodeAt(5, 4);

  findLegalPaths( start, end, dungeonMission, null );
}


function addBaseNodes(){
  for ( var i=0; i<dungeonMission.dimx; i++ ) {
    for ( var k=0; k<dungeonMission.dimy; k++ ) {
      var n = addRoom( i, k );
      n.pathTag = "none";
    }
  }
}
