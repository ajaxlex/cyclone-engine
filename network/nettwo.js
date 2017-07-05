function eController()
{
  var netId = 0;
  this.networks = [];

  this.newNetwork = function()
  {
    network = new eNetwork( this );
    this.networks.push( network );
    network.netId = netId;
    netId = netId + 1;

    return network;
  };

  this.removeNetwork = function( network )
  {
    if ( typeof network != 'undefined' && network !== null ) {
      var index = this.networks.indexOf( network );
      if ( index != -1 )
      {
        this.networks.splice( index, 1 );
      }
    }
  };

  this.combineNetworks = function( n1, n2 )
  {
    if ( n1.nodes.length >= n2.nodes.length )
    {
      n1.joinNetworks( n2 );
      return n1;
    }

    n2.joinNetworks( n1 );
    return n2;
  };

  this.newNode = function()
  {
    var node = new eNode();
    this.unassignedNetwork.addNode( node );
    return node;
  };

  this.cleanUnassigned = function()
  {
    while ( this.unassignedNetwork.nodes.length > 0 ) {
      var first = this.unassignedNetwork.nodes[0];
      var newNetwork = this.addNetwork();
      newNetwork.addNode( first );
      this.repairNetwork( first, newNetwork );
    }
  };

  this.repairNetwork = function( node, newNetwork )
  {
    node.connections.forEach( function( connection, index ){
      if ( connection !== null ) {
        this.repairNetwork( connection, newNetwork );
      }
    });
    newNetwork.addNode( node );
  };

  this.unassignedNetwork = this.newNetwork();
}


function eNetwork( ctx )
{
  this.netId = null;
  this.nodes = [];

  this.addNode = function( node )
  {
    if ( typeof node != 'undefined' && node !== null ) {
      if (this.nodes.indexOf( node ) == -1) {

        if ( typeof node.networkRef != 'undefined' && node.networkRef !== null )
        {
          node.networkRef.removeNode( node );
        }
        this.nodes.push( node );
        node.networkRef = this;
      }
    }
  };

  this.removeNode = function( node )
  {
    if ( typeof node != 'undefined' && node !== null ) {
      var index = this.nodes.indexOf( node );
      if ( index != -1 )
      {
        this.nodes.splice( index, 1 );
      }
    }
  };

  this.joinNetworks = function( network )
  {
    if ( typeof network != 'undefined' && network !== null ) {
      network.nodes.forEach( function( node, index ) {
        node.networkRef = this;
        this.nodes.push( node );
      });

      network.nodes = [];

      if ( network != ctx.unassignedNetwork ) {
        ctx.removeNetwork( network );
      }
    }
  };
}


function eNode()
{
  this.networkRef = ctx.unassignedNetwork;
  this.connectors = [];
}

function eConnector()
{
  ctx.addConnector( this );

  this.n0 = null;
  this.n1 = null;

  this.networkRef = ctx.unassignedNetwork;

  this.connect = function ( end, node )
  {
    var alternate = null;

    if ( end === 0 && this.n0 === null )
    {
      this.n0 = node;
      alternate = this.n1;
    }
    else if ( end === 1 && this.n1 === null )
    {
      this.n1 = node;
      alternate = this.n0;
    }
    else
    {
        // can not comply,
        return;
    }

    if ( alternate !== null ) {
      if ( alternate.networkRef !== ctx.unassignedNetwork ) {
        ctx.combineNetworks( node.networkRef, alternate.networkRef );
      }
      else {
        node.networkRef.addNode( alternate.node );
        node.networkRef.addConnector( this );
      }
    }

    node.pluggedIn( this );

  };

  this.unPlug = function( jack )
  {
    breakNetwork( jack );

    this.jack.unPlugged( this );
  };

  this.getAlternate = function( node )
  {
    if ( this.p1 !== null && this.p1.node === node )
    {
      return this.p0.node;
    }
    else if ( this.p0 !== null && this.p0.node == node )
    {
      return this.p1.node;
    }
    else
    {
      return null;
    }
  };



}
