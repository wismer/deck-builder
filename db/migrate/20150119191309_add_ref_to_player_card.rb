class AddRefToPlayerCard < ActiveRecord::Migration
  def change
    add_reference :player_cards, :card, index: true
  end
end
