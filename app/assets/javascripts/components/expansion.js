
// main component - parent of all
// Expansion list is on the left, active list on the right.
// filters will be handled by the active list component
var DeckBuilder = React.createClass({displayName: 'DeckBuilder',
  getInitialState: function() {
    return { activeSets: [], inactiveSets: {} };
  },

  handleRemoveExpansion: function(selectedSet) {
    var activeSets = this.state.activeSets;
    var inactiveSets = this.state.inactiveSets;
    var removedSet;

    activeSets = _.filter(activeSets, function(set){
      if (set.code === selectedSet.code) {
        removedSet = set;
        return false;
      } else {
        return true;
      }
    })

    inactiveSets[selectedSet.code] = removedSet;
    this.setState({ activeSets: activeSets, inactiveSets: inactiveSets })
  },

  handleAddExpansion: function(code, year) {
    // takes the set residing in inactiveSets
    // and places it into activeSets. Then re-renders.
    var inactiveSets = this.state.inactiveSets;
    var activeSets = this.state.activeSets;
    var addedSet = inactiveSets[code];

    if (addedSet.cards === undefined) {
      $.getJSON("http://mtgjson.com/json/" + code + ".json", function(set){
        // attach the "display" property to the object
        set.displaySet = true;
        // download cards, remove the set from the inactive list and add it to the active one.
        addedSet = set;
        delete inactiveSets[code];
        activeSets.push(addedSet);
        this.setState({ activeSets: activeSets, inactiveSets: inactiveSets })
      }.bind(this))
    }
  },

  // download json file for set list.

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
        React.createElement(Builder, {removeExpansion: this.handleRemoveExpansion, sets: this.state.activeSets})
      )
    )
  }
})

// actively selected sets are pooled into the builder component.
// most interactivity happens here. Lots of events to handle...

var Builder = React.createClass({displayName: 'Builder',
  render: function() {
    var cards = [];

    this.props.sets.forEach(function(set){
      cards = cards.concat(set.cards);
    })

    var setTags = this.props.sets.map(function(set){
      return { name: set.name, code: set.code };
    })

    return (
      React.createElement("div", {id: "active-sets"}, 
        React.createElement(ControlPanel, {setTags: setTags, removeExpansion: this.props.removeExpansion, cardCount: cards.length}), 
        React.createElement(CardCatalog, {cards: cards})
      )
    )
  }
})

var ControlPanel = React.createClass({displayName: 'ControlPanel',
  // shows a summary of what's been pooled by the user and the view
  // preferences for looking at the card catalog.
  render: function() {
    var self = this;
    var tags = this.props.setTags.map(function(set){
      return (
        React.createElement("a", {href: "#", key: set.code, onClick: self.props.removeExpansion.bind(null, set)}, 
          React.createElement("div", {className: "set-tag"}, set.name)
        )
      )
    })

    return (
      React.createElement("div", null, 
        React.createElement("div", {id: "tags"}, tags)
      )
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
      React.createElement("div", {id: "expansion-list"}, 
        expansions
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
