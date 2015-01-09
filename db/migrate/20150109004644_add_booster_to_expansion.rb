class AddBoosterToExpansion < ActiveRecord::Migration
  def change
    add_column :expansions, :booster, :string
  end
end
