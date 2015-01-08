var ExpansionList = React.createClass({displayName: 'ExpansionList',
  getInitialState: function() {
    return { expansionsByYear: [] };
  },

  componentWillMount: function() {
    $.getJSON("http://mtgjson.com/json/SetList.json", function(list){
      sets = list.map(function(set){
        var year = new Date(set.releaseDate).getFullYear();
        
      })
    }.bind(this))
  },

  render: function() {
    var expansions = this.state.expansionsByYear.map(function(expansion){

    })
  }
})