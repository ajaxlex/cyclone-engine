var globalCtx = new eController();
function RunTests()
{
  //TestSimpleNetwork();
  //TestMoreNetworks();
  //TestBreakNetwork();


  TestComplexNetwork();



}


function TestSimpleNetwork()
{
  ctx = globalCtx;

  var n1 = new eNode( ctx );
  var n2 = new eNode( ctx );

  var c1 = new eConnector( ctx );

  var j1 = new eJack();
  var j2 = new eJack();

  outputClear();

  report( isEqual( ctx.networks.length, 1 ), "Networks Length = 1");
  report( isEqual( ctx.unassignedNetwork.nodes.length, 2 ), "unassigned nodes = 2");
  report( isEqual( ctx.unassignedNetwork.connectors.length, 1 ), "unassigned connectors = 1");


  n1.addJack( j1 );
  n2.addJack( j2 );

  ctx.repair();

  outputDivider( "Post Repair 1" );

  report( isEqual( ctx.networks.length, 3 ), "Independent networks");
  report( isEqual( ctx.unassignedNetwork.nodes.length, 0 ), "Unassigned nodes clear");
  report( isEqual( ctx.unassignedNetwork.connectors.length, 1 ), "Unassigned connectors = 1");


  c1.plugIn( 0, j1 );
  c1.plugIn( 1, j2 );

  outputDivider( "Post Plugin" );

  report( isEqual( ctx.networks.length, 2 ), "Independent networks = 2");
  report( isEqual( ctx.networks[1].nodes.length, 2 ), "Network nodes = 2");
  report( isEqual( ctx.unassignedNetwork.nodes.length, 0 ), "Unassigned nodes clear");
  report( isEqual( ctx.unassignedNetwork.connectors.length, 0 ), "Unassigned connectors clear");

}

function TestMoreNetworks()
{
  ctx = new eController();

  var n1 = new eNode( ctx );
  var n2 = new eNode( ctx );
  var n3 = new eNode( ctx );
  var n4 = new eNode( ctx );


  var c1 = new eConnector( ctx );
  var c2 = new eConnector( ctx );
  var c3 = new eConnector( ctx );


  var j1 = new eJack();
  var j2 = new eJack();
  var j3 = new eJack();
  var j4 = new eJack();
  var j5 = new eJack();
  var j6 = new eJack();


  //outputClear();


  n1.addJack( j1 );

  n2.addJack( j2 );
  n2.addJack( j3 );

  n3.addJack( j4 );
  n3.addJack( j5 );

  n4.addJack( j6 );


  ctx.repair();

  c1.plugIn( 0, j1 );
  c1.plugIn( 1, j2 );

  c2.plugIn( 0, j3 );
  c2.plugIn( 1, j4 );

  c3.plugIn( 0, j5 );
  c3.plugIn( 1, j6 );

  outputDivider( "Post Plugin" );

  report( isEqual( ctx.networks.length, 2 ), "Independent networks 2");
  report( isEqual( ctx.unassignedNetwork.nodes.length, 0 ), "Unassigned nodes clear");
  report( isEqual( ctx.unassignedNetwork.connectors.length, 0 ), "Unassigned connectors clear");

// Add node
//  Add node to network
//    switch node networkref to new networkRef
//    remove node from old network list
//    add node to new network list

}

function TestBreakNetwork()
{

  ctx = new eController();

  var n1 = new eNode( ctx, "n1" );
  var n2 = new eNode( ctx, "n2" );
  var n3 = new eNode( ctx, "n3" );

  var c1 = new eConnector( ctx, "c1" );
  var c2 = new eConnector( ctx, "c2" );

  var j1 = new eJack( "j1" );
  var j2 = new eJack( "j2" );
  var j3 = new eJack( "j3" );
  var j4 = new eJack( "j4" );

  n1.addJack( j1 );

  n2.addJack( j2 );
  n2.addJack( j3 );

  n3.addJack( j4 );

  ctx.repair();

  c1.plugIn( 0, j1 );
  c1.plugIn( 1, j2 );

  c2.plugIn( 0, j3 );
  c2.plugIn( 1, j4 );

  outputDivider( "Break Test" );

  report( isEqual( ctx.networks.length, 2 ), "Independent networks 2");
  report( isEqual( ctx.unassignedNetwork.nodes.length, 0 ), "Unassigned nodes clear");
  report( isEqual( ctx.unassignedNetwork.connectors.length, 0 ), "Unassigned connectors clear");


  c2.unPlug( j4 );

  outputDivider( "Post Break" );

  report( isEqual( ctx.networks.length, 1 ), "Independent networks 1");



  ctx.repair();

  outputDivider( "Post Break" );

  report( isEqual( ctx.networks.length, 3 ), "Independent networks 3");
  report( isEqual( ctx.unassignedNetwork.nodes.length, 0 ), "Unassigned nodes clear");
  report( isEqual( ctx.networks[1].nodes.length, 1 ), "Net 1 two nodes");
  report( isEqual( ctx.networks[2].nodes.length, 2 ), "Net 2 single node");



}


function TestComplexNetwork()
{
  ctx = new eController();

  var n1 = new eNode( ctx, "n1" );
  var n2 = new eNode( ctx, "n2" );
  var n3 = new eNode( ctx, "n3" );


  var c1 = new eConnector( ctx, "c1" );
  var c2 = new eConnector( ctx, "c2" );
  var c3 = new eConnector( ctx, "c3" );

  var j1 = new eJack( "j1" );
  var j2 = new eJack( "j2" );
  var j3 = new eJack( "j3" );
  var j4 = new eJack( "j4" );
  var j5 = new eJack( "j5" );
  var j6 = new eJack( "j6" );


  n1.addJack( j1 );
  n1.addJack( j5 );

  n2.addJack( j2 );
  n2.addJack( j3 );

  n3.addJack( j4 );
  n3.addJack( j6 );

  //ctx.repair();

  c1.plugIn( 0, j1 );
  c1.plugIn( 1, j2 );

  c2.plugIn( 0, j3 );
  c2.plugIn( 1, j4 );

  c3.plugIn( 0, j5 );
  c3.plugIn( 1, j6 );


  ctx.repair();

  report( isEqual( ctx.networks.length, 2 ), "Independent networks 2");

  c2.unPlug( j4 );

  ctx.repair();

  report( isEqual( ctx.networks.length, 2 ), "Independent networks 2");

  c3.unPlug( j5 );

  ctx.repair();

  report( isEqual( ctx.networks.length, 3 ), "Independent networks 3");

}
