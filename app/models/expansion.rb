class Expansion < ActiveRecord::Base
  self.primary_key = "code"
  has_many :cards
end
