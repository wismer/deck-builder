// Should the card filtering happen at the parent node, DeckBuilder, by filtering everytime it gets rendered?
// It would seem to me that that is not an very efficient process to use. If, say, I remove a filter,
// main component - parent of all
// Expansion list is on the left, active list on the right.
// filters will be handled by the active list component
var DeckBuilder = React.createClass({displayName: 'DeckBuilder',
  getInitialState: function() {
    return {
      activeSets: [],
      inactiveSets: {},
      cardPool: [],
      cardFilters: {
        byColor: {
          red: false,
          blue: false,
          green: false,
          artifact: false,
          land: false,
          black: false,
          white: false
        },

        byType: {
          artifact: false,
          creature: false,
          enchantment: false,
          sorcery: false,
          instant: false,
          land: false
        }
      }
    };
  },

  // remove expansion from the card catalog.

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

  // add expansion to the card catalog.

  handleAddExpansion: function(code, year) {
    // takes the set residing in inactiveSets
    // and places it into activeSets. Then re-renders.
    var inactiveSets = this.state.inactiveSets;
    var activeSets = this.state.activeSets;
    var addedSet = inactiveSets[code];

    if (addedSet.cards === undefined) {
      $.getJSON("/expansions/" + code + ".json", function(set){
        // add a property of which expansion each card belongs to for future cleanup
        _.each(set.cards, function(card){
          debugger
          card.expansion = code;
        })
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

  filterCards: function() {

  },

  // download json file for set list.

  componentWillMount: function() {
    var inactiveSets = this.state.inactiveSets;
    $.getJSON("/expansions", function(list){
      list.forEach(function(set){
        inactiveSets[set.code] = set;
      })

      this.setState({ inactiveSets: inactiveSets })
    }.bind(this))
  },

  handleFilterChange: function(e) {

  },

  render: function() {
    var cardPool = [];
    var sets = [];

    _.each(this.state.activeSets, function(set){
      sets.push({ name: set.name, code: set.code })
      cardPool = cardPool.concat(set.cards);
    })

    return (
      React.createElement("div", {id: "deck-builder"}, 
        React.createElement(InActiveExpansionList, {handleAddExpansion: this.handleAddExpansion, sets: this.state.inactiveSets}), 
        React.createElement(Builder, null, 
          React.createElement(ControlPanel, null, 
            React.createElement(CardFilter, {onChange: this.handleFilterChange, filterBy: "colors", type: this.state.cardFilters.byColor}), 
            React.createElement(CardFilter, {onChange: this.handleFilterChange, filterBy: "spells", type: this.state.cardFilters.byType})
          )
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
      React.createElement("div", {id: "active-sets"}, 
        this.props.children
      )
    )
  }
})

var ControlPanel = React.createClass({displayName: 'ControlPanel',
  // shows a summary of what's been pooled by the user and the view
  // preferences for looking at the card catalog.
  render: function() {
    return (
      React.createElement("div", null, 
        this.props.children
      )
    )
  }
})
// mouse over a filter type and will reveal the options to pick and filter by.
var CardFilter = React.createClass({displayName: 'CardFilter',
  getInitialState: function() {
    return { displaySubMenu: false };
  },

  subMenu: function() {
    this.setState({ displaySubMenu: !this.state.displaySubMenu })
  },

  render: function() {
    var category = this.props.type;
    var options = _.keys(category).map(function(subcategory){
      return (
        React.createElement("div", {className: "sub-option"}, 
          React.createElement("input", {key: subcategory, type: "checkbox", value: subcategory}), subcategory
        )
      )
    })
    var active = "filter" + (this.state.displaySubMenu ? " active" : "");
    return (
      React.createElement("div", {className: "card-filter", onMouseEnter: this.subMenu, onMouseLeave: this.subMenu}, 
        this.props.filterBy, 
        React.createElement("div", {className: active}, 
          options
        )
      )
    )
  }
})


var CardCatalog = React.createClass({displayName: 'CardCatalog',
  getInitialState: function() {
    return { activeCard: {} };
  },

  showCard: function(card, e) {
    e.preventDefault();
    this.setState({ activeCard: card })
  },

  render: function() {
    var activeCard = this.state.activeCard;
    var self = this;
    var cardList = this.props.cards.map(function(card){
      var isActive = activeCard.multiverseid === card.multiverseid ? "card active" : "card";
      return (
        React.createElement("div", {className: isActive, key: card.multiverseid}, React.createElement("a", {href: "#", onClick: self.showCard.bind(null, card)}, card.name))
      )
    })

    return (
      React.createElement("div", {id: "card-catalog"}, 
        React.createElement("div", {id: "filter-nav"}, 
          React.createElement(CardFilter, React.__spread({type: "color", filterChange: this.handleFilterChange},  this.state.byColor)), 
          React.createElement(CardFilter, React.__spread({type: "type", filterChange: this.handleFilterChange},  this.state.byType))
        ), 

        React.createElement("div", {id: "card-list"}, 
          cardList
        ), 

        React.createElement(ActiveCard, React.__spread({},  this.state.activeCard))
      )
    )
  }
})

var ActiveCard = React.createClass({displayName: 'ActiveCard',
  render: function() {
    return React.createElement("div", null)
  }
})

var InActiveExpansionList = React.createClass({displayName: 'InActiveExpansionList',
  render: function() {
    var self = this;
    var years = {};
    var sets = this.props.sets;

    Object.keys(sets).forEach(function(code){
      var expansion = sets[code];
      var year = new Date(expansion.release_date).getFullYear();

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
