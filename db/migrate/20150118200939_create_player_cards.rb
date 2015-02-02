class CreatePlayerCards < ActiveRecord::Migration
  def change
    create_table :player_cards do |t|
      t.integer :count
      t.references :deck, index: true

      t.timestamps
    end
  end
end
