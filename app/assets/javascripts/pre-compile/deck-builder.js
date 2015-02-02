var WelcomeMat = React.createClass({
  getInitialState: function() {
    return { menuSelect: true, builder: false, viewer: false };
  },

  handleBuildDeck: function(e) {
    e.preventDefault();
    this.setState({ menuSelect: false, builder: true, viewer: false })
  },

  handleViewDecks: function(e) {
    e.preventDefault();
    this.setState({ menuSelect: false, builder: false, viewer: true })
  },

  render: function() {
    var state = this.state;
    return (
      <div id='main'>
        <div style={{display: state.menuSelect ? "block" : "none" }} className='jumbotron'>
          <p><a onClick={this.handleBuildDeck} className="btn btn-primary btn-lg" href="#" role="button">Build a Deck</a></p>
          <p><a onClick={this.handleViewDecks} className="btn btn-primary btn-lg" href="#" role="button">View Decks</a></p>
        </div>

        <div style={{display: state.builder ? "block" : "none" }} id='builder'>
          <DeckBuilder userID={this.props.userID} />
        </div>

        <div style={{display: state.viewer ? "block" : "none" }} id='viewer'>
          <DeckViewer userID={this.props.userID} />
        </div>
      </div>
    )
  }
})

var DeckViewer = React.createClass({
  getInitialState: function() {
    return { decks: [] };
  },

  componentWillMount: function() {
    var userID = this.props.userID;
    var params = { user: { user_id: userID } }
    $.getJSON("/decks", params, function(decks){
      this.setState({ decks: decks })
    }.bind(this))
  },

  render: function() {
    var decks = this.state.decks.map(function(deck){
      return <p>{deck.name}</p>
    })
    return (
      <div>{decks}</div>
    )
  }
})

var DeckBuilder = React.createClass({
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
      expansions: [],
      deck_id: null
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
    var data = {};
    data.expansions = {
      expansion_id: this.state.expansions.filter(function(set){
      return set.selected;
      }).map(function(set){ return set.id })
    };


    data.user = { name: this.refs.deckName.getDOMNode().value, user_id: this.props.userID };

    $.getJSON("/decks/new", data, function(response){
      this.setState({ deck_id: response.deck, cards: response.cards, expansionSelect: false })
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
      return <div className='picked-card'>{card.count}x: {card.name}</div>
    })

    var showExpansions = { display: this.state.expansionSelect ? "block" : "none" };
    var activeMode = { display: this.state.expansionSelect ? "none" : "block" };
    var highlightedCard = this.state.highlightedCard.name
      ? <CardHighlight {...this.state.highlightedCard} />
      : ""
    return (
      <div id='main' className='container'>
        <div style={showExpansions} id='deck-builder' className='container'>
          <Expansions onClick={this.handleExpSelection} sets={this.state.expansions} />
          <input type='text' ref='deckName' />
          <button onClick={this.loadCards} type='button' className='btn btn-default btn-md'>Load Cards</button>
        </div>

        <div style={activeMode} id='active-sets'>
          <ControlPanel>
            <FilterSet onChange={this.applyFilters} category="colors" filters={this.state.filters.colors}/>
            <FilterSet onChange={this.applyFilters} category="spells" filters={this.state.filters.spells}/>
          </ControlPanel>

          <CardList
            addCard={this.handleAddCard}
            highlightCard={this.handleShowHighlight}
            removeHighlight={this.handleRemoveHighlight}
            cards={this.state.cards}
          />

          {highlightedCard}

          <UserDeck>
            {userCards}
            <SaveCards userID={this.props.userID} deckID={this.state.deck_id} cards={pickedCards} />
          </UserDeck>
        </div>
      </div>
    )
  }
})

var UserDeck = React.createClass({
  render: function() {
    return (
      <div id='user-deck'>
        {this.props.children}
      </div>
    )
  }
})

var SaveCards = React.createClass({
  handleSaveCards: function(e) {
    e.preventDefault();
    var data = {};
    var deckID = this.props.deckID;
    var savedCards = this.props.cards;

    data.cards = {
      deck: deckID,
      player_cards: _.keys(savedCards).map(function(id){
        // return [id, savedCards[id].count]
        return { deck_id: deckID, card_id: id, count: savedCards[id].count };
      })
    }

    data.deck = deckID

    $.ajax({
      method: "POST",
      dataType: "json",
      url: "/decks",
      data: data,
      success: function(d) {
        debugger
      }
    })
  },

  render: function() {
    return (
      <div id='submit-deck'>
        <input onClick={this.handleSaveCards} type='submit' name='deck[cards]'/>
      </div>
    )
  }
})

var ControlPanel = React.createClass({
  render: function() {
    return (
      <div id='controlpanel'>{this.props.children}</div>
    )
  }
})

var FilterSet = React.createClass({
  render: function() {
    var category = this.props.category;
    var filters = this.props.filters;
    var self = this;
    var subcategories = _.keys(filters).map(function(subcategory){
      var style = { opacity: filters[subcategory] ? 1.0 : 0.5 };
      var cat = { category: category, subcategory: subcategory };

      return (
        <div style={{fontAlign: "center"}} onClick={self.props.onChange.bind(null, cat)} className="filter-set" key={subcategory}>
          <img style={style} src={subcategory + ".png"} height='15' width='15'/>{subcategory}
        </div>
      )
    })

    return (
      <div className='categories'>
        {subcategories}
      </div>
    )
  }
})

var CardList = React.createClass({
  render: function() {
    var self = this;
    var cards = this.props.cards.map(function(card){
      var icons = card.mana_cost.map(function(color,i){
        return <img key={i} src={color + ".png"} height="15" width="15" />
      })
      return (
        <div
          key={card.multiverseid}
          onClick={self.props.addCard.bind(null, card)}
          onMouseEnter={self.props.highlightCard.bind(null, card)}
          onMouseLeave={self.props.removeHighlight}
          style={{backgroundColor: card.card_colors}}
          className='card'
        >{card.name}
          <div className='icons'>
            {icons}
          </div>
        </div>
      )
    })

    return (
      <div id='card-list'>
        {cards}
      </div>
    )
  }
})

var CardHighlight = React.createClass({
  render: function() {
    return (
      <div style={{position: "fixed", top: 200, left: 400}}>
        <h6>{this.props.name}</h6>
        <img height='225' width='150' src={"http://mtgimage.com/multiverseid/" + this.props.multiverseid + ".jpg"}/>
      </div>
    )
  }
})

var Expansions = React.createClass({
  getInitialState: function() {
    return { isSelected: false };
  },

  render: function() {
    var self = this;
    var sets = this.props.sets.map(function(expansion){
      return (
        <Expansion
          key={expansion.code}
          {...expansion}
          onClick={self.props.onClick.bind(null, expansion)}
        />
      )
    })

    return (
      <div id='expansion-list container'>
        {sets}
      </div>
    )
  }
})

var Expansion = React.createClass({
  render: function() {
    var buttonClass = this.props.selected
      ? "btn btn-default btn-md active"
      : "btn btn-default btn-md";
    var style = { float: "left", padding: 10 };
    return (
      <div style={style}><button onClick={this.props.onClick} style={style} type='button' className={buttonClass}>{this.props.name}</button></div>
    )
  }
})