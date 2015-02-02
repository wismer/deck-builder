class Deck < ActiveRecord::Base
  has_many :player_cards
  has_many :cards, :through => :player_cards
  belongs_to :user
  accepts_nested_attributes_for :player_cards

  def all_cards
    deck = { name: name }
    deck[:cards] = player_cards.map do |card|
      { card: Card.find(card.card_id), count: card.count }
    end

    deck
  end
end
