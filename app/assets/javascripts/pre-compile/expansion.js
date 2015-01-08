
// main component - parent of all
// Expansion list is on the left, active list on the right.
// filters will be handled by the active list component
var DeckBuilder = React.createClass({
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
      <div id='deck-builder'>
        <InActiveExpansionList handleAddExpansion={this.handleAddExpansion} sets={this.state.inactiveSets} />
        <Builder removeExpansion={this.handleRemoveExpansion} sets={this.state.activeSets} />
      </div>
    )
  }
})

// actively selected sets are pooled into the builder component.
// most interactivity happens here. Lots of events to handle...

var Builder = React.createClass({
  render: function() {
    var cards = [];

    this.props.sets.forEach(function(set){
      cards = cards.concat(set.cards);
    })

    var setTags = this.props.sets.map(function(set){
      return { name: set.name, code: set.code };
    })

    return (
      <div id='active-sets'>
        <ControlPanel setTags={setTags} removeExpansion={this.props.removeExpansion} cardCount={cards.length} />
        <CardCatalog cards={cards} />
      </div>
    )
  }
})

var ControlPanel = React.createClass({
  // shows a summary of what's been pooled by the user and the view
  // preferences for looking at the card catalog.
  render: function() {
    var self = this;
    var tags = this.props.setTags.map(function(set){
      return (
        <a href="#" key={set.code} onClick={self.props.removeExpansion.bind(null, set)}>
          <div className='set-tag'>{set.name}</div>
        </a>
      )
    })

    return (
      <div>
        <div id='tags'>{tags}</div>
      </div>
    )
  }
})


var CardCatalog = React.createClass({
  getInitialState: function() {
    return {

    }
  },

  render: function() {
    return ( <div></div> )
  }
})

var InActiveExpansionList = React.createClass({
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
