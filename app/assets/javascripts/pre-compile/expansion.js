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
      expansions: [],
      cardPool: []
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

    return (
      <div id='deck-builder'>
        <ExpansionList list={this.state.expansions} expansionSelection={this.handleExpansionSelection} />
        <Builder>
          <ControlPanel onChange={this.handleFilterChange} />
          <CardList cards={this.state.cardPool} />
        </Builder>
      </div>
    )
  }
})

var ExpansionList = React.createClass({
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
        <ExpansionYear year={year} expansionSelection={self.props.expansionSelection} expansions={sortedByYear[year]} key={year} />
      )
    })

    return (
      <div id='expansion-list'>
        {expansionsByYear}
      </div>
    )
  }
})

var ExpansionYear = React.createClass({
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
        <Expansion addExpansion={self.props.expansionSelection} key={set.code} {...set} />
      )
    })

    return (
      <div className="year-set" onMouseEnter={this.toggleSets} onMouseLeave={this.toggleSets}>
        <h5>{this.props.year}</h5>
        <div className='sets'>
          {this.state.showExpansions ? expansions : ""}
        </div>
      </div>
    )
  }
})


var Expansion = React.createClass({
  render: function() {
    var style = { backgroundColor: this.props.selected ? "#dddddd" : "#eeeeee" };
    return (
      <div style={style} onClick={this.props.addExpansion.bind(null, this.props.number)} className="expansion">{this.props.name}</div>
    )
  }
})

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
      return <input key={color} type='checkbox' value={color} ref={color} />
    })

    return (
      <div id='control-panel'>
        <h5>filter options</h5>
        <div id='filter-options'>
          <form onChange={this.handleFilterValues} ref='zeeInput'>
            {colors}
          </form>
        </div>
      </div>
    )
  }
})

var CardList = React.createClass({
  render: function() {
    var cards = this.props.cards.map(function(card){
      return <li><a href="#" onClick={self.props.addCard.bind(null, card)}>{card.name}</a></li>
    })
    return (
      <div id='card-list'>
        {cards}
      </div>
    )
  }
})