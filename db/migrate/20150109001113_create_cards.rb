class CreateCards < ActiveRecord::Migration
  def change
    create_table :cards do |t|
      t.string :name
      t.integer :cmc
      t.text :flavor
      t.string :image_name
      t.string :mana_cost
      t.integer :multiverseid
      t.string :rarity
      t.string :card_subtype
      t.text :card_text
      t.string :card_type_desc
      t.string :card_type
      t.string :card_colors
      t.references :expansion, index: true

      t.timestamps
    end
  end
end
