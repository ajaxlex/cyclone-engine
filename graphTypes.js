var Graph = {
  init: function()
  {
    if (typeof this.nodes == 'undefined'){
      this.nodes = [];
    }
  },

  addNode: function( node ) // returns node
  {
    if ( node == null )
    {
      var n = Object.create( Node );
      this.nodes.push( n );
      return n;
    }
    this.nodes.push( node );
    return node;
  },

  connect: function( node1, node2, edge )
  {
    node1.addEdge( edge );
    node2.addEdge( edge );
    edge.init( node1, node2 );
  }

};

var Node = {
  init: function()
  {
    if (typeof this.edges == 'undefined'){
      this.edges = [];
    }
  },

  addEdge: function( edge ) // returns edge
  {
    // TODO - ensure edge is not already connected

    if ( edge == null )
    {
      var e = Object.create( Edge );
      this.edges.push( e );
      return e;
    }
    this.edges.push( edge );
    return edge;
  }
};

var Edge = {
  init( node1, node2 ) {
    this.n1 = node1;
    this.n2 = node2;
  },

  addNode: function( node ){
    if ( this.n1 == null )
    {
      this.n1 = node;
      return true;
    }
    if ( this.n2 == null )
    {
      this.n2 = node;
      return true;
    }
    return false;
  },

  setNode: function( ord, node ){
    if ( ord == 1 )
    {
      this.n1 = node;
      this.n1.addEdge( this );
    }
    if ( ord == 2 )
    {
      this.n2 = node;
      this.n2.addEdge( this );
    }
  }
};
