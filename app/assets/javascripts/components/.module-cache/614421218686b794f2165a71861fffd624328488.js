var ExpansionList = React.createClass({displayName: 'ExpansionList',
  getInitialState: function() {
    return { expansionsByYear: [], loadedSets: [] };
  },

  handleOnClick: function(code, releaseDate) {
    var year = new Date(releaseDate).getFullYear();
    var expansionsByYear = this.state.expansionsByYear;
    var loadedSets = this.state.loadedSets;

    $.getJSON("http://mtgjson.com/json/" + code + ".json", function(set){
      loadedSets.push(set);
    }.bind(this))
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
    var self = this;
    var expansions = this.state.expansionsByYear.map(function(sets){
      return React.createElement(ExpansionYear, React.__spread({loadCards: self.handleOnClick, key: sets.year},  sets))
    })
    return (
      React.createElement("div", {id: "expansion-list"}, 
        expansions
      )
    )
  }
})

var ExpansionYear = React.createClass({displayName: 'ExpansionYear',
  render: function() {
    var self = this;
    var expansions = this.props.expansions.map(function(set){
      return (
        React.createElement(Expansion, React.__spread({loadCards: self.props.loadCards, key: set.code},  set))
      )
    })
    return (
      React.createElement("div", {className: "year-set"}, 
        React.createElement("h5", null, this.props.year), 
        expansions
      )
    )
  }
})

var Expansion = React.createClass({displayName: 'Expansion',
  what: function(e) {
    console.log(e)
  },

  render: function() {
    return (
      React.createElement("div", {onDrag: this.what, onClick: this.props.loadCards.bind(null, this.props.code, this.props.releaseDate), className: "expansion"}, this.props.name)
    )
  }
})

function renderList() {
  React.render(
    React.createElement(ExpansionList, null),
    document.getElementById("set-list")
  )
}