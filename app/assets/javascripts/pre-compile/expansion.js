// Should the card filtering happen at the parent node, DeckBuilder, by filtering everytime it gets rendered?
// It would seem to me that that is not an very efficient process to use. If, say, I remove a filter,
// main component - parent of all
// Expansion list is on the left, active list on the right.
// filters will be handled by the active list component
var DeckBuilder = React.createClass({
  getInitialState: function() {
    return {
      draftMode: false,
      activeCard: {},
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
    }).map(function(c){ return c.color })


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

  handleDraftMode: function(e) {
    var activeSets = this.state.activeSets,
        inactiveSets = this.state.inactiveSets

    _.each(activeSets, function(set){
      inactiveSets[set.code] = set;
    })

    _.keys(inactiveSets, function(set){
      if (!set.booster) {
        delete inactiveSets[set.code]
      }
    })

    this.setState({ draftMode: e.target.checked, inactiveSets: inactiveSets, activeSets: [], cardPool: [] })
  },

  handleActiveCard: function(card, e) {
    e.preventDefault();
    this.setState({ activeCard: card })
  },

  render: function() {
    var categories = this.state.categories;

    return (
      <div id='deck-builder'>
        <div id='draft-mode'>
          draft mode: <input type='checkbox' value='draft' onChange={this.handleDraftMode} />
        </div>
        <InActiveExpansionList handleAddExpansion={this.handleAddExpansion} sets={this.state.inactiveSets} />
        <Builder>
          <ControlPanel>
            <CardFilter
              onChange={this.handleFilterChange}
              filterBy="colors"
              categories={categories.colors}
            />
          </ControlPanel>

          <CardList onClick={this.handleActiveCard} cards={this.state.cardPool} />
          <ActiveCard {...this.state.activeCard} />
        </Builder>
      </div>
    )
  }
})

var CardList = React.createClass({
  render: function() {
    var self = this;
    var cards = this.props.cards.map(function(card){
      return <li><a key={card.multiverseid} onClick={self.props.onClick.bind(null, card)}href="#">{card.name}</a></li>
    })

    return (
      <div id='card-list'>
        {cards}
      </div>
    )
  }
})

// actively selected sets are pooled into the builder component.
// most interactivity happens here. Lots of events to handle...

var Builder = React.createClass({
  render: function() {
    return (
      <div id='active-sets'>
        {this.props.children}
      </div>
    )
  }
})

var ControlPanel = React.createClass({
  // shows a summary of what's been pooled by the user and the view
  // preferences for looking at the card catalog.
  render: function() {
    return (
      <div id='control-panel'>
        <h5>filter options</h5>
        <div id='filter-options'>
          {this.props.children}
        </div>
      </div>
    )
  }
})
// mouse over a filter type and will reveal the options to pick and filter by.
var CardFilter = React.createClass({
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
        <div className='sub-option'>
          <input
            onChange={self.props.onChange.bind(null, self.props.filterBy, subcategory)}
            key={subcategory.color} type='checkbox' value={subcategory.color}
            checked={subcategory.isActive}
          />
            {subcategory.color}
        </div>
      )
    })

    var active = "filter" + (this.state.displaySubMenu ? " active" : "");
    return (
      <div className='card-filter' onMouseEnter={this.subMenu} onMouseLeave={this.subMenu}>
        {this.props.filterBy}
        <div className={active}>
          {options}
        </div>
      </div>
    )
  }
})


var CardCatalog = React.createClass({
  render: function() {

    return (
      <div id='card-catalog'>
      </div>
    )
  }
})

var ActiveCard = React.createClass({
  render: function() {
    var cardImg = this.props.id ? <img src={"http://mtgimage.com/multiverseid/" + this.props.id + ".jpg"}/> : ""
    return (
      <div>{cardImg}</div>
    )
  }
})

var InActiveExpansionList = React.createClass({
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
      return <ExpansionYear year={year} handleAddExpansion={self.props.handleAddExpansion} key={year} sets={setsOfYear} />
    })

    return (
      <div id='expansion-list'>
        {expansions}
      </div>
    )
  }
})


var ExpansionYear = React.createClass({
  render: function() {
    var self = this;
    var expansions = this.props.sets.map(function(set){
      return (
        <Expansion addExpansion={self.props.handleAddExpansion} key={set.code} {...set} />
      )
    })
    return (
      <div className="year-set">
        <h5>{this.props.year}</h5>
        {expansions}
      </div>
    )
  }
})

var Expansion = React.createClass({
  render: function() {
    return (
      <div onClick={this.props.addExpansion.bind(null, this.props.code, this.props.releaseDate)} className="expansion">{this.props.name}</div>
    )
  }
})