var ExpansionList = React.createClass({displayName: 'ExpansionList',
  getInitialState: function() {
    return { expansionsByYear: [] };
  },

  componentWillMount: function() {
    $.getJSON("http://mtgjson.com/json/SetList.json", function(list){

      list.forEach(function(set){
        var year = new Date(set.releaseDate).getFullYear();

        
      })
    }.bind(this))
  },

  render: function() {
    var expansions = this.state.expansionsByYear.map(function(expansion){

    })
  }
})