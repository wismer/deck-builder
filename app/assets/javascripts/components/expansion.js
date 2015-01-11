// Should the card filtering happen at the parent node, DeckBuilder, by filtering everytime it gets rendered?
// It would seem to me that that is not an very efficient process to use. If, say, I remove a filter,
// main component - parent of all
// Expansion list is on the left, active list on the right.
// filters will be handled by the active list component
var DeckBuilder = React.createClass({displayName: 'DeckBuilder',
  getInitialState: function() {
    return {
      draftMode: false,
      activeCard: {},
      expansions: [],
      cardPool: [],
      savedCards: {}
    };
  },

  componentWillMount: function() {
    var expansions = this.state.expansions;
    $.getJSON("/expansions/list", function(list){
      list.forEach(function(expansion, index){
        expansion.releaseYear = new Date(expansion.release_date).getFullYear();
        expansion.selected = false;
        expansion.number = index;
        expansions.push(expansion);
      })

      this.setState({ expansions: expansions })
    }.bind(this))
  },

  handleFilterChange: function(e, colors) {
    var expansions = this.state.expansions.filter(function(expansion){
      return expansion.selected;
    }).map(function(c){ return c.id })

    if (colors.length > 0) {
      $.ajax({
        url: "/cards",
        dataType: "json",
        data: { filter: { expansion_id: expansions, card_colors: colors } },
        success: function(cards) {
          this.setState({ cardPool: cards })
        }.bind(this)
      })
    } else {
      this.setState({ cardPool: [] })
    }
  },

  handleExpansionSelection: function(index, e) {
    var expansions = this.state.expansions;
    var expansion = expansions[index];
    expansion.selected = !expansion.selected;
    this.setState({ expansions: expansions })
  },

  handleRemoveCard: function(card, e) {
    var cards = this.state.savedCards;
    cards[card.id].count -= 1;
    if (cards[card.id].count === 0 ) {
      delete cards[card.id];
    }

    this.setState({ savedCards: cards })
  },

  handleAddCard: function(card, e) {
    e.preventDefault();
    var cards = this.state.savedCards;
    if (cards[card.id]) {
      cards[card.id].count += 1;
    } else {
      cards[card.id] = { count: 1, attributes: card }
    }
    this.setState({ savedCards: cards })
  },

  handleActiveCard: function(card, e) {
    this.setState({ activeCard: card })
  },

  render: function() {
    var inactive = [],
        active = [],
        self = this;

    _.each(this.state.expansions, function(expansion){
      if (expansion.selected) {
        active.push(expansion)
      } else {
        inactive.push(expansion)
      }
    })

    var activeCard = this.state.activeCard.name ? React.createElement(ActiveCard, React.__spread({},  this.state.activeCard)) : ""
    return (
      React.createElement("div", {id: "deck-builder"}, 
        React.createElement(ExpansionList, {list: this.state.expansions, expansionSelection: this.handleExpansionSelection}), 
        React.createElement(Builder, null, 
          React.createElement(ControlPanel, {onChange: this.handleFilterChange, loadedSets: active}), 
          React.createElement(CardList, {onMouseOver: this.handleActiveCard, cards: this.state.cardPool, addCard: this.handleAddCard}), 
          React.createElement(UserPanel, {cards: this.state.savedCards, removeCard: this.handleRemoveCard}), 
          activeCard
        )
      )
    )
  }
})

var ExpansionList = React.createClass({displayName: 'ExpansionList',
  getDefaultProps: function() {
    var years = [];
    for (var year = 1993; year < 2015; year++) {
      years.push(year);
    }
    return { years: years };
  },

  render: function() {
    var sortedByYear = {},
        list = this.props.list,
        years = this.props.years,
        self = this;

    _.each(years, function(year){
      sortedByYear[year] = list.filter(function(expansion){
        return expansion.releaseYear === year;
      })
    })

    var expansionsByYear = _.map(_.keys(sortedByYear), function(year){
      return (
        React.createElement(ExpansionYear, {year: year, expansionSelection: self.props.expansionSelection, expansions: sortedByYear[year], key: year})
      )
    })

    return (
      React.createElement("div", {id: "expansion-list"}, 
        expansionsByYear
      )
    )
  }
})

var ExpansionYear = React.createClass({displayName: 'ExpansionYear',
  getInitialState: function() {
    return { showExpansions: false };
  },

  toggleSets: function() {
    this.setState({ showExpansions: !this.state.showExpansions })
  },

  render: function() {
    var self = this;
    var expansions = this.props.expansions.map(function(set){
      return (
        React.createElement(Expansion, React.__spread({addExpansion: self.props.expansionSelection, key: set.code},  set))
      )
    })

    return (
      React.createElement("div", {className: "year-set", onMouseEnter: this.toggleSets, onMouseLeave: this.toggleSets}, 
        React.createElement("h5", null, this.props.year), 
        React.createElement("div", {className: "sets"}, 
          this.state.showExpansions ? expansions : ""
        )
      )
    )
  }
})


var Expansion = React.createClass({displayName: 'Expansion',
  render: function() {
    var style = { backgroundColor: this.props.selected ? "#dddddd" : "#eeeeee" };
    return (
      React.createElement("div", {style: style, onClick: this.props.addExpansion.bind(null, this.props.number), className: "expansion"}, this.props.name)
    )
  }
})

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
  getDefaultProps: function() {
    return {
      colors: ["Red", "Green", "Blue", "Black", "White"],
      spells: ["Instant", "Enchantment", "Artifact", "Creature", "Sorcery"]
    }
  },

  handleFilterValues: function(e) {
    var self = this;
    var colors = this.props.colors.filter(function(color){
      return self.refs[color].getDOMNode().checked;
    })

    this.props.onChange(e, colors);
  },

  render: function() {
    var colors = this.props.colors.map(function(color){
      return React.createElement("input", {key: color, type: "checkbox", value: color, ref: color})
    })

    return (
      React.createElement("div", {id: "control-panel"}, 
        React.createElement("h5", null, "filter options"), 
        React.createElement("div", {id: "filter-options"}, 
          React.createElement("form", {onChange: this.handleFilterValues}, 
            colors
          )
        )
      )
    )
  }
})

var CardList = React.createClass({displayName: 'CardList',
  render: function() {
    var self = this;
    var cards = this.props.cards.map(function(card){
      return React.createElement("li", {key: card.id, onMouseOver: self.props.onMouseOver.bind(null, card)}, React.createElement("a", {href: "#", onClick: self.props.addCard.bind(null, card)}, card.name))
    })
    return (
      React.createElement("div", {id: "card-list"}, 
        cards
      )
    )
  }
})

var UserPanel = React.createClass({displayName: 'UserPanel',
  render: function() {
    var self = this;
    var savedCards = this.props.cards;
    var cards = _.keys(this.props.cards).map(function(id){
      var count = savedCards[id].count;
      var attributes = savedCards[id].attributes;

      return React.createElement("li", {key: id}, React.createElement("a", {href: "#", onClick: self.props.removeCard.bind(null, attributes)}, count, "x: ", attributes.name))
    })

    return (
      React.createElement("div", {id: "user-cards"}, 
        React.createElement("div", null, 
          React.createElement("h5", null, "Summary")
        ), 
        React.createElement("div", {id: "save-cards"}
        ), 
        cards
      )
    )
  }
})

var ActiveCard = React.createClass({displayName: 'ActiveCard',
  render: function() {
    var imgTag = "http://mtgimage.com/card/" + this.props.image_name + ".jpg";
    return (
      React.createElement("div", null, 
        React.createElement("h5", null, this.props.name), 
        React.createElement("div", {className: "img-tag"}, 
          React.createElement("img", {src: imgTag, height: "225", width: "150"})
        )
      )
    )
  }
})