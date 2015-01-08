var ExpansionList = React.createClass({displayName: 'ExpansionList',
  getInitialState: function() {
    return { expansions: {}, setsToLoad: [], activeSets: [] };
  },

  handleOnClick: function(code, releaseDate) {
    var expansions = this.state.expansions;
    var expansion = expansions[code];
    var activeSets = this.state.activeSets;

    delete expansions[code];

    $.getJSON("http://mtgjson.com/json/" + code + ".json", function(set){
      loadedSets.push(set);
      this.setState({ loadedSets: loadedSets })
    }.bind(this))
  },

  componentWillMount: function() {
    var expansions = this.state.expansions;
    $.getJSON("http://mtgjson.com/json/SetList.json", function(list){
      list.forEach(function(set){
        expansions[set.code] = set;
      })

      this.setState({ expansions: expansions })
    }.bind(this))
  },

  render: function() {
    var self = this;
    var years = {};
    var expansions = this.state.expansions;

    Object.keys(expansions).forEach(function(code){
      var expansion = expansions[code];
      var year = new Date(expansion.releaseDate).getFullYear();

      if (years[year]) {
        years[year].push(expansion);
      } else {
        years[year] = [expansion];
      }
    })

    var expansions = Object.keys(years).map(function(year){
      var sets = years[year];
      return React.createElement(ExpansionYear, {year: year, loadCards: self.handleOnClick, key: year, sets: sets})
    })

    return (
      React.createElement("div", {id: "deck-builder"}, 
        React.createElement("div", {id: "expansion-list"}, 
          expansions
        ), 

        React.createElement("div", {id: "active-sets"}
        )
      )
    )
  }
})

var ExpansionYear = React.createClass({displayName: 'ExpansionYear',
  render: function() {
    var self = this;
    var expansions = this.props.sets.map(function(set){
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
    console.log(e);
  },

  render: function() {
    return (
      React.createElement("div", {onClick: this.props.loadCards.bind(null, this.props.code, this.props.releaseDate), className: "expansion"}, this.props.name)
    )
  }
})

function renderList() {
  React.render(
    React.createElement(ExpansionList, null),
    document.getElementById("set-list")
  )
}