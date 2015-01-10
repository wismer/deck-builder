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
      categories: {
        colors: [
          { color: "Red", isActive: false },
          { color: "Green", isActive: false },
          { color: "Blue", isActive: false },
          { color: "White", isActive: false },
          { color: "Black", isActive: false },
          { color: "Multi", isActive: false }
        ]
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
      $.getJSON("/expansions/expansion/" + code + ".json", function(set){
        // add a property of which expansion each card belongs to for future cleanup
        _.each(set.cards, function(card){
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
    $.getJSON("/expansions/list", function(list){
      list.forEach(function(set){
        inactiveSets[set.code] = set;
      })

      this.setState({ inactiveSets: inactiveSets })
    }.bind(this))
  },

  handleFilterChange: function(category, subcategory, e) {
    var categories = this.state.categories;
    var checked = e.target.checked;
    var expansions = this.state.activeSets.map(function(set){
      return set.id;
    })

    _.each(categories[category], function(subcat, index) {
      if (subcat.color === subcategory.color) {
        categories[category][index].isActive = checked;
      }
    })

    var activeColors = _.filter(categories.colors, function(c){
      return c.isActive;
    })

    if (activeColors.length === 0) {
      this.setState({ cardPool: [], categories: categories })
    } else {
      $.ajax({
        url: "/cards",
        dataType: "json",
        type: "GET",
        data: { filter: { expansion_id: expansions, card_colors: activeColors } },
        success: function(cards) {
          this.setState({ cardPool: cards, categories: categories })
        }.bind(this)
      })
    }
  },

  render: function() {
    var categories = this.state.categories;

    return (
      React.createElement("div", {id: "deck-builder"}, 
        React.createElement(InActiveExpansionList, {handleAddExpansion: this.handleAddExpansion, sets: this.state.inactiveSets}), 
        React.createElement(Builder, null, 
          React.createElement(ControlPanel, null, 
            React.createElement(CardFilter, {
              onChange: this.handleFilterChange, 
              filterBy: "colors", 
              categories: categories.colors}
            )
          ), 

          React.createElement(CardList, {cards: this.state.cardPool})
        )
      )
    )
  }
})

var CardList = React.createClass({displayName: 'CardList',
  render: function() {
    var cards = this.props.cards.map(function(card){
      return React.createElement("li", null, React.createElement("a", {href: "#"}, card.name))
    })

    return (
      React.createElement("div", {id: "card-list"}, 
        cards
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
      React.createElement("div", {id: "control-panel"}, 
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
    var self = this;
    var options = this.props.categories.map(function(subcategory){
      return (
        React.createElement("div", {className: "sub-option"}, 
          React.createElement("input", {
            onChange: self.props.onChange.bind(null, self.props.filterBy, subcategory), 
            key: subcategory.color, type: "checkbox", value: subcategory.color, 
            checked: subcategory.isActive}
          ), 
            subcategory.color
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
  render: function() {

    return (
      React.createElement("div", {id: "card-catalog"}
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