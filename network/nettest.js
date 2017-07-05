function eController()
{
  var nid = 0;
  var self = this;
  this.networks = [];

  this.addNetwork = function( network )
  {
    if ( typeof network == 'undefined' || network === null )
    {
        network = new eNetwork( this );
        network.nid = nid;
        nid = nid + 1;
    }
    this.networks.push( network );

    return network;
  };

  this.removeNetwork = function( network )
  {
    var index = this.networks.indexOf( network );
    if ( index != -1 )
    {
      this.networks.splice( index, 1 );
    }
  };


  this.combineNetworks = function( n1, n2 )
  {
    // each element in network2 will assume the id of network1
    // then remove the previous network from list
    n2.nodes.forEach( function( node, index ) {
      //n1.addNode( node );
      node.networkRef = n1;
      n1.nodes.push( node );
    });
    n2.connectors.forEach( function ( connector, index ) {
      //n1.addConnector( connector );
      connector.networkRef = n1;
      n1.connectors.push( connector );
    });
    if ( n2 != this.unassignedNetwork ) {
      this.removeNetwork( n2 );
    }
  };


  this.breakNetwork = function( network )
  {
    network.nodes.forEach( function( node, index ) {
      //n1.addNode( node );
      node.networkRef = self.unassignedNetwork;
      self.unassignedNetwork.nodes.push( node );
    });
    network.connectors.forEach( function ( connector, index ) {
      //n1.addConnector( connector );
      connector.networkRef = self.unassignedNetwork;
      self.unassignedNetwork.connectors.push( connector );
    });
    if ( network != this.unassignedNetwork ) {
      this.removeNetwork( network );
    }


  };

  this.addNode = function( node, network )
  {
    var oldNetwork = node.networkRef;

    if ( typeof network == 'undefined' || network === null ){
      this.unassignedNetwork.addNode( node );
    }
    else
    {
      network.addNode( node );
    }

    if ( typeof oldNetwork != 'undefined' && oldNetwork !== null ) {
      oldNetwork.removeNode( node );
    }
  };



  this.addConnector = function( connector, network )
  {
    var oldNetwork = connector.networkRef;

    if ( typeof network == 'undefined' || network === null ){
      this.unassignedNetwork.addConnector( connector );
    }
    else
    {
      network.addConnector( connector );
    }
    if ( typeof oldNetwork != 'undefined' && oldNetwork !== null ) {
      oldNetwork.removeConnector( connector );
    }
  };



  this.repair = function()
  {
    // since repair is complete, no need to randomize
    // pick first node in unassignedNetwork
    // assign to a new network
    // search connected nodes, assigning to new network
    // if you reach an existing network ( somehow? ) remember it and convert all to it at the end
    //

    while ( this.unassignedNetwork.nodes.length > 0 ) {
      var first = this.unassignedNetwork.nodes[0];
      var newNetwork = this.addNetwork();
      self.shortcircuit = 0;
      this.traverseNetwork( first, newNetwork );
    }
  };

  this.traverseNetwork = function( node, newNetwork )
  {
    self.shortcircuit++;
    if ( self.shortcircuit > 1000 ) {
      console.log('shortcircuit traversal ');
      return;
    }
    // reset shortcircuit before next traversal
    newNetwork.addNode( node );
    node.jacks.forEach( function( jack, index ){
      var connector = jack.connector;
      if ( connector !== null ){
        newNetwork.addConnector( connector );
        var alternate = connector.getAlternate( node );
        if ( alternate !== null && alternate.networkRef != newNetwork ){
          self.traverseNetwork( alternate, newNetwork );
        }
        else { /* shouldn't need to go here. */ }
      }
    });
  };

  this.unassignedNetwork = this.addNetwork();
}

function eNetwork( ctx )
{
  this.nid = null;
  this.connectors = [];
  this.nodes = [];

  this.combineNetworks = function( newNetwork )
  {
      nodes.forEach( function( n, index ) { n.network = newNetwork; });
      connectors.forEach( function( c, index ) { c.network = newNetwork; });
  };

  this.addConnector = function( connector )
  {
    if ( typeof connector.networkRef != 'undefined' && connector.networkRef !== null ) {
      connector.networkRef.removeConnector( connector );
    }
    connector.networkRef = this;
    if ( this.connectors.indexOf( connector ) == -1 ) {
      this.connectors.push( connector );
    }
  };

  this.addNode = function( node )
  {
    if ( typeof node.networkRef != 'undefined' && node.networkRef !== null ) {
      node.networkRef.removeNode( node );
    }
    node.networkRef = this;
    if ( this.nodes.indexOf( node ) == -1 ) {
      this.nodes.push( node );
    }
  };

  this.removeConnector = function( connector )
  {
    var index = this.connectors.indexOf( connector );
    if ( index != -1 )
    {
      this.connectors.splice( index, 1 );
    }
  };

  this.removeNode = function( node )
  {
    var index = this.nodes.indexOf( node );
    if ( index != -1 )
    {
      this.nodes.splice( index, 1 );
    }
  };
}





function eNode( ctx, name )
{
  if ( typeof name == 'undefined' || name === null )
  {
    this.name = "";
  } else {
    this.name = name;
  }

  ctx.addNode( this );

  this.jacks = [];
  this.networkRef = ctx.unassignedNetwork;

  this.addJack = function( jack )
  {
    jack.node = this;
    this.jacks.push( jack );
  };

  this.removeJack = function( jack )
  {
    jack.node = null;
    var index = this.jacks.indexOf( jack );
    if ( index != -1 )
    {
      jacks.splice( index, 1 );
    }
  };
}


function eJack( name )
{
  this.connector = null;
  this.node = null;
  if ( typeof name == 'undefined' || name === null )
  {
    this.name = "";
  } else {
    this.name = name;
  }
  //this.networkRef = ctx.unassignedNetwork;

  this.pluggedIn = function( connector )
  {
    this.connector = connector;
    this.node.networkRef.addConnector( connector );
  };

  this.unPlugged = function( connector )
  {
    this.connector = null;
    // ??  break network ??
  };
}


function eConnector( ctx, name )
{
  if ( typeof name == 'undefined' || name === null )
  {
    this.name = "";
  } else {
    this.name = name;
  }

  ctx.addConnector( this );

  this.p0 = null;
  this.p1 = null;

  this.networkRef = ctx.unassignedNetwork;

  this.plugIn = function( end, jack )
  {
    var alternate = null;

    if ( end === 0 && this.p0 === null )
    {
      this.p0 = jack;
      alternate = this.p1;
    }
    else if ( end === 1 && this.p1 === null )
    {
      this.p1 = jack;
      alternate = this.p0;
    }
    else
    {
        // can not comply,
        return;
    }

    if ( alternate !== null ) {
      if ( alternate.node.networkRef !== ctx.unassignedNetwork ) {
        ctx.combineNetworks( jack.node.networkRef, alternate.node.networkRef );
      }
      else {
        jack.node.networkRef.addNode( alternate.node );
        jack.node.networkRef.addConnector( this );
      }
    }

    jack.pluggedIn( this );
  };

  this.unPlug = function( jack )
  {
    if ( this.p0 == jack ){
      this.p0 = null;
    }
    if ( this.p1 == jack ){
      this.p1 = null;
    }
    jack.unPlugged( this );
    ctx.breakNetwork( jack.node.networkRef );
  };

  this.getAlternate = function( node )
  {
    if ( this.p1 !== null && this.p0 !== null && this.p1.node === node )
    {
      return this.p0.node;
    }
    else if ( this.p0 !== null && this.p1 !== null && this.p0.node == node )
    {
      return this.p1.node;
    }
    else
    {
      return null;
    }
  };

}
