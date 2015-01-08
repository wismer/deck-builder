
// main component - parent of all
// Expansion list is on the left, active list on the right.
// filters will be handled by the active list component
var DeckBuilder = React.createClass({
  getInitialState: function() {
    return { activeSets: [], inactiveSets: [] };
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
    return (
      <div id='deck-builder'>
        <ExpansionList sets={this.state.inactiveSets} />
      </div>
    )
  }
})

var ExpansionList = React.createClass({
  getInitialState: function() {
    return { expansions: {}, setsToLoad: [], activeSets: [] };
  },

  handleOnClick: function(code, releaseDate) {
    var expansions = this.state.expansions;
    var expansion = expansions[code];
    var activeSets = this.state.activeSets;

    delete expansions[code];

    $.getJSON("http://mtgjson.com/json/" + code + ".json", function(set){
      activeSets.push(set);
      this.setState({ activeSets: activeSets })
    }.bind(this))
  },

  componentWillMount: function() {
    var expansions = this.state.expansions;
    $.getJSON("http://mtgjson.com/json/SetList.json", function(list){
      list.forEach(function(set){
        expansions[set.code] = set;
      })

      this.setState({ expansions: expansions })
    }.bind(this))
  },

  render: function() {
    var self = this;
    var years = {};
    var expansions = this.state.expansions;

    Object.keys(expansions).forEach(function(code){
      var expansion = expansions[code];
      var year = new Date(expansion.releaseDate).getFullYear();

      if (years[year]) {
        years[year].push(expansion);
      } else {
        years[year] = [expansion];
      }
    })

    var expansions = Object.keys(years).map(function(year){
      var sets = years[year];
      return <ExpansionYear year={year} loadCards={self.handleOnClick} key={year} sets={sets} />
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


// card-catalog ->
//    deck -> cards
//    preferences ->
//    active-sets ->
//      


var CardCatalog = React.createClass({
  getInitialState: function() {
    return {

    }
  },

  render: function() {

  }
})

var ActiveSet = React.createClass({
  render: function() {
    return (
      <div className='active-set'>

      </div>
    )
  }
})

var ExpansionYear = React.createClass({
  render: function() {
    var self = this;
    var expansions = this.props.sets.map(function(set){
      return (
        <Expansion loadCards={self.props.loadCards} key={set.code} {...set} />
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
  what: function(e) {
    console.log(e);
  },

  render: function() {
    return (
      <div onClick={this.props.loadCards.bind(null, this.props.code, this.props.releaseDate)} className="expansion">{this.props.name}</div>
    )
  }
})

function renderList() {
  React.render(
    <ExpansionList />,
    document.getElementById("set-list")
  )
}