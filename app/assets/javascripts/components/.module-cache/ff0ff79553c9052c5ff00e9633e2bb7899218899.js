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

      this.setState({ expansionsByYear: expansionsByYear })
    }.bind(this))
  },

  render: function() {
    var expansions = this.state.expansionsByYear.map(function(sets){
      return React.createElement(ExpansionYear, React.__spread({key: sets.year},  sets))
    })
    return (
      React.createElement("div", null, 
        expansions
      )
    )
  }
})

var ExpansionYear = React.createClass({displayName: 'ExpansionYear',
  render: function() {
    var year = this.props.year;
    var expansions = this.props.expansions.map(function(set){
      return (
        React.createElement(Expansion, React.__spread({key: set.code},  set))
      )
    })
    return (
      React.createElement("div", {className: "year-set"}, 
        React.createElement("h5", null, year), 
        expansions
      )
    )
  }
})

var Expansion = React.createClass({displayName: 'Expansion',
  render: function() {
    return (
      React.createElement("div", {className: "expansion"}, this.props.name)
    )
  }
})

function renderList() {
  React.render(
    React.createElement(ExpansionList, null),
    document.getElementById("set-list")
  )
}