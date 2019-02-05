// these are basic graph types meant to be extended for use

var Graph = {
  init: function()
  {
    if (typeof this.nodes == 'undefined'){
      this.nodes = [];
    }
  },

  addNode: function( node )
  {
    if ( node == null )
    {
      var n = Object.create( Node );
      // this index must always correspond to the node position in the nodes array!
      n.index = this.nodes.length;
      this.nodes.push( n );
      return n;
    }
    node.index = this.nodes.length;
    this.nodes.push( node );
    return node;
  },

  /*
  removeNode: function( node )
  {
    // must make sure to update indices of all nodes after list change
  }
  */

  connect: function( node1, node2, edge )
  {
    node1.addEdge( edge );
    node2.addEdge( edge );
    edge.init( node1, node2 );
  },

  copy: function()
  {
    var graphCopy = Object.create(Graph);

    // gather edges into temp structure
    for ( var n=0; n<this.nodes.length; n++ ){

    }

    // copy nodes
    for ( var n=0; n<this.nodes.length; n++ ){
      var newNode = this.nodes[n].copy();
      graphCopy.addNode( newNode );
    }

    for ( var n=0; n<this.nodes.length; n++ ){
      
    }

    for ( var e=0; e<this.edges.length; e++ ){
      var curr = this.edges[e];
      var newEdge = Object.create(Edge);
      graphCopy.connect( graphCopy.nodes[curr.n1.index], graphCopy.nodes[curr.n2.index], newEdge );
    }

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
