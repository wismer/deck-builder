class AddSupertypesToCard < ActiveRecord::Migration
  def change
    add_column :cards, :supertypes, :string
  end
end
