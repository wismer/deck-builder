# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

require 'json'
require 'date'

def convert_type(array)
  array.join(", ") if array
end

file = File.open("./AllSets.json")
@all_cards = {}

card_data = JSON.load(file)
card_data.each do |code, expansion|
  if expansion["booster"]
    exp = Expansion.create(
      name: expansion["name"],
      release_date: Date.parse(expansion["releaseDate"]),
      code: code,
      booster: convert_type(expansion["booster"])
    )

    cards = expansion["cards"]

    cards.each do |card|
      card['expansion_id'] = exp.id
      @all_cards[card["name"]] = card
    end
  end
end


@all_cards.each do |name,card|
  Card.create(
    name: name,
    cmc: card["cmc"],
    flavor: card["flavor"],
    image_name: card["imageName"],
    mana_cost: card["manaCost"],
    multiverseid: card["multiverseid"],
    card_colors: convert_type(card["colors"]),
    card_type_desc: card["type"],
    supertypes: convert_type(card["supertypes"]),
    card_type: convert_type(card["types"]),
    card_subtype: convert_type(card["subtypes"]),
    rarity: card["rarity"],
    card_text: card["text"],
    power: card["power"],
    toughness: card["loyalty"] || card["toughness"],
    expansion_id: card["expansion_id"]
  )
end