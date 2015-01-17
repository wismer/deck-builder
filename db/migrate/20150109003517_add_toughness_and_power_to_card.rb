class AddToughnessAndPowerToCard < ActiveRecord::Migration
  def change
    add_column :cards, :toughness, :string
    add_column :cards, :power, :string
  end
end
