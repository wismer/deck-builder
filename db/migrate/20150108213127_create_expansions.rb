class CreateExpansions < ActiveRecord::Migration
  def change
    create_table :expansions do |t|
      t.string :name
      t.date :release_date
      t.string :code

      t.timestamps
    end
  end
end
