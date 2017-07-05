function initGraph()
{
  for ( var i=0; i<5; i++ )
  {
    for ( var k=0; k<5; k++ )
    {
      addRoom( i, k );
    }
  }


  var test = dungeonMission.getNodeAt( 0, 0 );
  var test2 = dungeonMission.getNodeAt( 1, 0 );

  test2.title ='hellow';

  test2.addFeature( 'M', FEAT_MONSTER );

  addEdge( test, test2, [ EDGE_LOCK, EDGE_FWD ] );

  var test3 = dungeonMission.getNodeAt( 1, 1 );
  addEdge( test2, test3 );

  var test4 = dungeonMission.getNodeAt( 2, 2 );
  addEdge( test2, test4, [ EDGE_VIEW ] );

};
