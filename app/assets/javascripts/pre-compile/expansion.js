// Should the card filtering happen at the parent node, DeckBuilder, by filtering everytime it gets rendered?
// It would seem to me that that is not an very efficient process to use. If, say, I remove a filter,
// main component - parent of all
// Expansion list is on the left, active list on the right.
// filters will be handled by the active list component
var DeckBuilder = React.createClass({
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
      <div id='deck-builder'>
        <InActiveExpansionList handleAddExpansion={this.handleAddExpansion} sets={this.state.inactiveSets} />
        <Builder>
          <ControlPanel>
            <CardFilter onChange={this.handleFilterChange} filterBy="colors" type={this.state.cardFilters.byColor} />
            <CardFilter onChange={this.handleFilterChange} filterBy="spells" type={this.state.cardFilters.byType} />
          </ControlPanel>
        </Builder>
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
      <div>
        {this.props.children}
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
    var category = this.props.type;
    var options = _.keys(category).map(function(subcategory){
      return (
        <div className='sub-option'>
          <input key={subcategory} type='checkbox' value={subcategory} />{subcategory}
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
        <div className={isActive} key={card.multiverseid}><a href="#" onClick={self.showCard.bind(null, card)}>{card.name}</a></div>
      )
    })

    return (
      <div id='card-catalog'>
        <div id='filter-nav'>
          <CardFilter type="color" filterChange={this.handleFilterChange} {...this.state.byColor} />
          <CardFilter type="type" filterChange={this.handleFilterChange} {...this.state.byType} />
        </div>

        <div id='card-list'>
          {cardList}
        </div>

        <ActiveCard {...this.state.activeCard}/>
      </div>
    )
  }
})

var ActiveCard = React.createClass({
  render: function() {
    return <div></div>
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
