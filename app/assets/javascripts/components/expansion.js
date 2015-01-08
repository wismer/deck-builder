
// main component - parent of all
// Expansion list is on the left, active list on the right.
// filters will be handled by the active list component
var DeckBuilder = React.createClass({displayName: 'DeckBuilder',
  getInitialState: function() {
    return { activeSets: [], inactiveSets: {} };
  },

  handleAddExpansion: function(code, year) {
    // takes the set residing in inactiveSets
    // and places it into activeSets. Then re-renders.
    var inactiveSets = this.state.inactiveSets;
    var activeSets = this.state.activeSets;
    var selectedSet = inactiveSets[code];


  },

  componentWillMount: function() {
    var inactiveSets = this.state.inactiveSets;
    $.getJSON("http://mtgjson.com/json/SetList.json", function(list){
      list.forEach(function(set){
        inactiveSets[set.code] = set;
      })

      this.setState({ inactiveSets: inactiveSets })
    }.bind(this))
  },

  render: function() {
    var cardPool = [];

    Object.keys(this.state.activeSets).forEach(function(set){
      cardPool = cardPool.concat(set.cards);
    })

    return (
      React.createElement("div", {id: "deck-builder"}, 
        React.createElement(InActiveExpansionList, {handleAddExpansion: this.handleAddExpansion, sets: this.state.inactiveSets}), 
        React.createElement(Builder, {sets: this.state.activeSets}, 
          React.createElement(ExpansionTags, null), 
          React.createElement(CardCatalog, {cardPool: cardPool})
        )
      )
    )
  }
})

// actively selected sets are pooled into the builder component.
// most interactivity happens here. Lots of events to handle...

var Builder = React.createClass({displayName: 'Builder',
  render: function() {
    return (
      React.createElement("div", null, this.props.children)
    )
  }
})

var ExpansionTags = React.createClass({displayName: 'ExpansionTags',
  render: function() {
    return (
      React.createElement("div", null)
    )
  }
})


var CardCatalog = React.createClass({displayName: 'CardCatalog',
  getInitialState: function() {
    return {

    }
  },

  render: function() {
    return ( React.createElement("div", null) )
  }
})

var InActiveExpansionList = React.createClass({displayName: 'InActiveExpansionList',
  render: function() {
    var self = this;
    var years = {};
    var sets = this.props.sets;

    Object.keys(sets).forEach(function(code){
      var expansion = sets[code];
      var year = new Date(expansion.releaseDate).getFullYear();

      if (years[year]) {
        years[year].push(expansion);
      } else {
        years[year] = [expansion];
      }
    })

    var expansions = Object.keys(years).map(function(year){
      var setsOfYear = years[year];
      return React.createElement(ExpansionYear, {year: year, handleAddExpansion: self.props.handleAddExpansion, key: year, sets: setsOfYear})
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
        React.createElement(Expansion, React.__spread({addExpansion: self.props.handleAddExpansion, key: set.code},  set))
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
  render: function() {
    return (
      React.createElement("div", {onClick: this.props.addExpansion.bind(null, this.props.code, this.props.releaseDate), className: "expansion"}, this.props.name)
    )
  }
})
