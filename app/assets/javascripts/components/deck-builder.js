var DeckBuilder = React.createClass({displayName: 'DeckBuilder',
  getInitialState: function() {
    return {
      expansionSelect: true,
      pickedCards: {},
      cards: [],
      filters: {
        colors: {
          Blue: false,
          Red: false,
          Green: false,
          White: false,
          Black: false
        },

        spells: {
          Sorcery: false,
          Creature: false,
          Instant: false,
          Land: false,
          Artifact: false,
          Enchantment: false
        }
      },
      highlightedCard: {},
      expansions: []
    }
  },

  componentWillMount: function() {
    var expansions = this.state.expansions;
    $.getJSON("/expansions/list", function(list){
      expansions = list.filter(function(set){
        var year = new Date(set.release_date).getFullYear();
        set.selected = false;
        return year > 2010;
      })
      this.setState({ expansions: expansions })
    }.bind(this))
  },

  handleAddCard: function(card, e) {
    var pickedCards = this.state.pickedCards;

    if (pickedCards[card.id]) {
      pickedCards[card.id].count += 1;
    } else {
      pickedCards[card.id] = card;
      pickedCards[card.id].count = 1;
    }
    this.setState({ pickedCards: pickedCards })
  },

  handleShowHighlight: function(card, e) {
    this.setState({ highlightedCard: card })
  },

  handleRemoveHighlight: function(e) {
    this.setState({ highlightedCard: {} })
  },

  handleExpSelection: function(expansion, e) {
    var expansions = this.state.expansions;
    expansions.forEach(function(set){
      if (set.code === expansion.code) {
        set.selected = !set.selected;
      }
    })
    this.setState({ expansions: expansions })
  },

  loadCards: function() {
    var expansions = this.state.expansions.filter(function(set){
      return set.selected;
    }).map(function(set){ return set.id });
    $.getJSON("/cards/query", { expansions: { expansion_id: expansions } }, function(cards){
      this.setState({ cards: cards, expansionSelect: false })
    }.bind(this))
  },

  applyFilters: function(filter, e) {
    var filters = this.state.filters;
    var query = {};

    query.expansion_id = this.state.expansions.filter(function(set){
      return set.selected;
    }).map(function(set){ return set.id })

    filters[filter.category][filter.subcategory] = !filters[filter.category][filter.subcategory];

    var colors = _.keys(filters.colors).filter(function(color){
      return filters.colors[color];
    })

    var spellTypes = _.keys(filters.spells).filter(function(spell){
      return filters.spells[spell];
    })

    if (colors.length > 0) {
      query.card_colors = colors;
    }

    if (spellTypes.length > 0) {
      query.card_type = spellTypes;
    }

    $.getJSON("/cards/filtered", { cards: query }, function(cards){
      this.setState({ filters: filters, cards: cards })
    }.bind(this))

  },

  render: function() {
    var pickedCards = this.state.pickedCards;

    var userCards = _.keys(pickedCards).map(function(cardID){
      var card = pickedCards[cardID];
      return React.createElement("div", {className: "picked-card"}, card.count, "x: ", card.name)
    })

    var showExpansions = { display: this.state.expansionSelect ? "block" : "none" };
    var activeMode = { display: this.state.expansionSelect ? "none" : "block" };
    var highlightedCard = this.state.highlightedCard.name
      ? React.createElement(CardHighlight, React.__spread({},  this.state.highlightedCard))
      : ""
    return (
      React.createElement("div", {id: "main"}, 
        React.createElement("div", {style: showExpansions, id: "deck-builder", className: "container"}, 
          React.createElement(Expansions, {onClick: this.handleExpSelection, sets: this.state.expansions}), 
          React.createElement("button", {onClick: this.loadCards, type: "button", className: "btn btn-default btn-md"}, "Load Cards")
        ), 

        React.createElement("div", {style: activeMode, id: "active-sets"}, 
          React.createElement(ControlPanel, null, 
            React.createElement(FilterSet, {onChange: this.applyFilters, category: "colors", filters: this.state.filters.colors}), 
            React.createElement(FilterSet, {onChange: this.applyFilters, category: "spells", filters: this.state.filters.spells})
          ), 

          React.createElement(CardList, {
            addCard: this.handleAddCard, 
            highlightCard: this.handleShowHighlight, 
            removeHighlight: this.handleRemoveHighlight, 
            cards: this.state.cards}
          ), 

          highlightedCard, 

          React.createElement(UserDeck, null, 
            userCards, 
            React.createElement(SaveCards, null)
          )
        )
      )
    )
  }
})

var UserDeck = React.createClass({displayName: 'UserDeck',
  render: function() {
    return (
      React.createElement("div", {id: "user-deck"}, 
        this.props.children
      )
    )
  }
})

var SaveCards = React.createClass({displayName: 'SaveCards',
  render: function() {
    return (
      React.createElement("div", {id: "save-form"}, 
        React.createElement("input", {type: "button", name: "save[cards]"})
      )
    )
  }
})

var ControlPanel = React.createClass({displayName: 'ControlPanel',
  render: function() {
    return (
      React.createElement("div", {id: "controlpanel"}, this.props.children)
    )
  }
})

var FilterSet = React.createClass({displayName: 'FilterSet',
  render: function() {
    var category = this.props.category;
    var filters = this.props.filters;
    var self = this;
    var subcategories = _.keys(filters).map(function(subcategory){
      var style = { opacity: filters[subcategory] ? 1.0 : 0.5 };
      var cat = { category: category, subcategory: subcategory };

      return (
        React.createElement("div", {style: {fontAlign: "center"}, onClick: self.props.onChange.bind(null, cat), className: "filter-set", key: subcategory}, 
          React.createElement("img", {style: style, src: subcategory + ".png", height: "15", width: "15"}), subcategory
        )
      )
    })

    return (
      React.createElement("div", {className: "categories"}, 
        subcategories
      )
    )
  }
})

var CardList = React.createClass({displayName: 'CardList',
  render: function() {
    var self = this;
    var cards = this.props.cards.map(function(card){
      var icons = card.mana_cost.map(function(color,i){
        return React.createElement("img", {key: i, src: color + ".png", height: "15", width: "15"})
      })
      return (
        React.createElement("div", {
          key: card.multiverseid, 
          onClick: self.props.addCard.bind(null, card), 
          onMouseEnter: self.props.highlightCard.bind(null, card), 
          onMouseLeave: self.props.removeHighlight, 
          style: {backgroundColor: card.card_colors}, 
          className: "card"
        }, card.name, 
          React.createElement("div", {className: "icons"}, 
            icons
          )
        )
      )
    })

    return (
      React.createElement("div", {id: "card-list"}, 
        cards
      )
    )
  }
})

var CardHighlight = React.createClass({displayName: 'CardHighlight',
  render: function() {
    return (
      React.createElement("div", {style: {position: "fixed", top: 200, left: 400}}, 
        React.createElement("h6", null, this.props.name), 
        React.createElement("img", {height: "225", width: "150", src: "http://mtgimage.com/multiverseid/" + this.props.multiverseid + ".jpg"})
      )
    )
  }
})

var Expansions = React.createClass({displayName: 'Expansions',
  getInitialState: function() {
    return { isSelected: false };
  },

  render: function() {
    var self = this;
    var sets = this.props.sets.map(function(expansion){
      return (
        React.createElement(Expansion, React.__spread({
          key: expansion.code}, 
          expansion, 
          {onClick: self.props.onClick.bind(null, expansion)})
        )
      )
    })

    return (
      React.createElement("div", {id: "expansion-list container"}, 
        sets
      )
    )
  }
})

var Expansion = React.createClass({displayName: 'Expansion',
  render: function() {
    var buttonClass = this.props.selected
      ? "btn btn-default btn-md active"
      : "btn btn-default btn-md";
    var style = { float: "left", padding: 10 };
    return (
      React.createElement("div", {style: style}, React.createElement("button", {onClick: this.props.onClick, style: style, type: "button", className: buttonClass}, this.props.name))
    )
  }
})