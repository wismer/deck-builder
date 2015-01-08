
// main component - parent of all
// Expansion list is on the left, active list on the right.
// filters will be handled by the active list component
var DeckBuilder = React.createClass({
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
      <div id='deck-builder'>
        <InActiveExpansionList handleAddExpansion={this.handleAddExpansion} sets={this.state.inactiveSets} />
        <Builder sets={this.state.activeSets}>
          <ExpansionTags />
          <CardCatalog cardPool={cardPool} />
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
      <div>{this.props.children}</div>
    )
  }
})

var ExpansionTags = React.createClass({
  render: function() {
    return (
      <div></div>
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
      <div id='deck-builder'>
        <div id='expansion-list'>
          {expansions}
        </div>

        <div id='active-sets'>
        </div>
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
