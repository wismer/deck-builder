// // Should the card filtering happen at the parent node, DeckBuilder, by filtering everytime it gets rendered?
// // It would seem to me that that is not an very efficient process to use. If, say, I remove a filter,
// // main component - parent of all
// // Expansion list is on the left, active list on the right.
// // filters will be handled by the active list component
// var DeckBuilder = React.createClass({
//   getInitialState: function() {
//     return {
//       draftMode: false,
//       activeCard: {},
//       expansions: [],
//       cardPool: [],
//       activeFilters: {
//         colors: {
//           Red: true,
//           Green: true,
//           Blue: true,
//           White: true,
//           Black: true,
//           Multi: true
//         },

//         spells: {
//           Creature: false,
//           Instant: false,
//           Artifact: false,
//           Enchantment: false,
//           Sorcery: false,
//           Land: false
//         }

//       },
//       savedCards: {}
//     };
//   },

//   handleCardSearch: function(e) {
//     var input = e.target.value;
//     var expansions = this.state.expansions;

//     $.ajax({
//       url: "/cards/search",
//       data: { card: { name: input, limit: 100 } },
//       dataType: "json",
//       success: function(results) {
//         this.setState({ cardPool: results })
//       }.bind(this)
//     })

//   },

//   componentWillMount: function() {
//     var expansions = this.state.expansions;
//     $.getJSON("/expansions/list", function(list){
//       list.forEach(function(expansion, index){
//         expansion.releaseYear = new Date(expansion.release_date).getFullYear();
//         expansion.selected = false;
//         expansion.number = index;
//         expansions.push(expansion);
//       })

//       this.setState({ expansions: expansions })
//     }.bind(this))
//   },

//   handleFilterChange: function(setting, e) {
//     var cardFilter = this.state.activeFilters
//     var cardPool = [];
//     cardFilter[setting.category][setting.filter] = !cardFilter[setting.category][setting.filter];
//     var colors = _.keys(cardFilter.colors).filter(function(color){ return !cardFilter.colors[color] })

//     this.state.expansions.forEach(function(expansion){
//       if (expansion.selected) {
//         expansion.cards.forEach(function(card){
//           if (_.contains(colors, card.card_colors)) {
//             cardPool.push(card)
//           }
//         })
//       }
//     })

//     this.setState({ activeFilters: cardFilter, cardPool: cardPool })
//   },

//   handleExpansionSelection: function(index, e) {
//     var expansions = this.state.expansions;
//     var expansion = expansions[index];

//     $.getJSON("/expansions/expansion/" + expansion.code, function(cards){
//       expansion.cards = cards;
//     })

//     expansion.selected = !expansion.selected;
//     this.setState({ expansions: expansions })
//   },

//   handleRemoveCard: function(card, e) {
//     var cards = this.state.savedCards;
//     cards[card.id].count -= 1;
//     if (cards[card.id].count === 0 ) {
//       delete cards[card.id];
//     }

//     this.setState({ savedCards: cards })
//   },

//   handleAddCard: function(card, e) {
//     e.preventDefault();
//     var cards = this.state.savedCards;
//     if (cards[card.id]) {
//       cards[card.id].count += 1;
//     } else {
//       cards[card.id] = { count: 1, attributes: card }
//     }
//     this.setState({ savedCards: cards })
//   },

//   handleActiveCard: function(card, e) {
//     this.setState({ activeCard: card })
//   },

//   render: function() {
//     var inactive = [],
//         active = [],
//         self = this;

//     _.each(this.state.expansions, function(expansion){
//       if (expansion.selected) {
//         active.push(expansion)
//       } else {
//         inactive.push(expansion)
//       }
//     })

//     var activeCard = this.state.activeCard.name ? <ActiveCard {...this.state.activeCard} /> : ""
//     return (
//       <div id='deck-builder'>
//         <ExpansionList list={this.state.expansions} expansionSelection={this.handleExpansionSelection} />
//         <Builder>
//           <ControlPanel cardSearch={this.handleCardSearch} onChange={this.handleFilterChange} loadedSets={active} filters={this.state.activeFilters}/>
//           <CardList onMouseOver={this.handleActiveCard} cards={this.state.cardPool} addCard={this.handleAddCard} />
//           <UserPanel cards={this.state.savedCards} removeCard={this.handleRemoveCard}/>
//           {activeCard}
//         </Builder>
//       </div>
//     )
//   }
// })

// var ExpansionList = React.createClass({
//   getDefaultProps: function() {
//     var years = [];
//     for (var year = 1993; year < 2015; year++) {
//       years.push(year);
//     }
//     return { years: years };
//   },

//   render: function() {
//     var sortedByYear = {},
//         list = this.props.list,
//         years = this.props.years,
//         self = this;

//     _.each(years, function(year){
//       sortedByYear[year] = list.filter(function(expansion){
//         return expansion.releaseYear === year;
//       })
//     })

//     var expansionsByYear = _.map(_.keys(sortedByYear), function(year){
//       return (
//         <ExpansionYear year={year} expansionSelection={self.props.expansionSelection} expansions={sortedByYear[year]} key={year} />
//       )
//     })

//     return (
//       <div id='expansion-list'>
//         {expansionsByYear}
//       </div>
//     )
//   }
// })

// var ExpansionYear = React.createClass({
//   getInitialState: function() {
//     return { showExpansions: false };
//   },

//   toggleSets: function() {
//     this.setState({ showExpansions: !this.state.showExpansions })
//   },

//   render: function() {
//     var self = this;
//     var expansions = this.props.expansions.map(function(set){
//       return (
//         <Expansion addExpansion={self.props.expansionSelection} key={set.code} {...set} />
//       )
//     })

//     return (
//       <div className="year-set" onMouseEnter={this.toggleSets} onMouseLeave={this.toggleSets}>
//         <h5>{this.props.year}</h5>
//         <div className='sets'>
//           {this.state.showExpansions ? expansions : ""}
//         </div>
//       </div>
//     )
//   }
// })


// var Expansion = React.createClass({
//   render: function() {
//     var style = { backgroundColor: this.props.selected ? "#dddddd" : "#eeeeee" };
//     return (
//       <div style={style} onClick={this.props.addExpansion.bind(null, this.props.number)} className="expansion">{this.props.name}</div>
//     )
//   }
// })

// var Builder = React.createClass({
//   render: function() {
//     return (
//       <div id='active-sets'>
//         {this.props.children}
//       </div>
//     )
//   }
// })

// var ControlPanel = React.createClass({
//   getDefaultProps: function() {
//     return {
//       colors: [
//         { color: "Red", hex: "#E49976" },
//         { color: "Green", hex: "#A1BE93" },
//         { color: "Blue", hex: "#C1D7E8" },
//         { color: "Black", hex: "#B9B0A9" },
//         { color: "White", hex: "#F5F2D4"}
//       ],

//       spells: ["Instant", "Enchantment", "Artifact", "Creature", "Sorcery"]
//     }
//   },

//   handleFilterValues: function(e) {
//     // I want to do the same thing I did before --- check all the checkboxes...

//   },

//   render: function() {
//     var activeColors = this.props.filters.colors;
//     var self = this;
//     var colors = this.props.colors.map(function(type){
//       var style = { opacity: activeColors[type.color] ? "0.5" : "1.0", backgroundColor: type.hex, padding: "5px" }
//       return (
//         <div className="color-filter">
//           <img className="color-symbol" style={style}
//             alt={type.color}
//             src={"/" + type.color + ".gif"}
//             height="20" width="20"
//             onClick={self.props.onChange.bind(null, { category: "colors", filter: type.color })}
//           />
//         </div>
//       )
//     })

//     return (
//       <div id='control-panel'>
//         <h5>Card Search</h5>
//         <input type='text' />
//         <h5>filter options</h5>
//         <div id='filter-options'>
//           {colors}
//         </div>
//       </div>
//     )
//   }
// })

// var CardList = React.createClass({
//   render: function() {
//     var self = this;
//     var cards = this.props.cards.map(function(card){
//       debugger
//       return (
//         <Card key={card.id} {...card}>
//           <Tag colors={card.card_colors} types={card.card_types} />
//         </Card>
//       )
//     })
//     return (
//       <div id='card-list'>
//         {cards}
//       </div>
//     )
//   }
// })

// var Tag = React.createClass({
//   render: function() {
//     var colors = this.props.colors.map(function(color){
//       return 
//     })
//     return (
//       <div className='tags'>
//         {colors}
//       </div>
//     )
//   }
// })

// var Card = React.createClass({
//   render: function() {
//     return (
//       <div className='card-link'>
//         {this.props.children}
//       </div>
//     )
//   }
// })


// var UserPanel = React.createClass({
//   render: function() {
//     var self = this;
//     var savedCards = this.props.cards;
//     var cards = _.keys(this.props.cards).map(function(id){
//       var count = savedCards[id].count;
//       var attributes = savedCards[id].attributes;

//       return <li key={id}><a href="#" onClick={self.props.removeCard.bind(null, attributes)}>{count}x: {attributes.name}</a></li>
//     })

//     return (
//       <div id='user-cards'>
//         <div>
//           <h5>Summary</h5>
//         </div>
//         <div id='save-cards'>
//         </div>
//         {cards}
//       </div>
//     )
//   }
// })

// var ActiveCard = React.createClass({
//   render: function() {
//     var imgTag = "http://mtgimage.com/card/" + this.props.image_name + ".jpg";
//     return (
//       <div>
//         <h5>{this.props.name}</h5>
//         <div className="img-tag">
//           <img src={imgTag} height="225" width="150" />
//         </div>

//       </div>
//     )
//   }
// })

