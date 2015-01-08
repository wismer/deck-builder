var ExpansionList = React.createClass({displayName: 'ExpansionList',
  getInitialState: function() {
    return { expansionsByYear: [] };
  },

  componentWillMount: function() {
    $.getJSON("http://mtgjson.com/json/SetList.json", function(list){
      var sets = {};
      list.forEach(function(set){
        var year = new Date(set.releaseDate).getFullYear();
        if (sets[year]) {
          sets[year].push(set);
        } else {
          sets[year] = [set];
        }
      })

      var expansionsByYear = Object.keys(sets).map(function(year){
        return { year: year, expansions: sets[year] };
      });

      
    }.bind(this))
  },

  render: function() {
    var expansions = this.state.expansionsByYear.map(function(expansion){

    })
  }
})